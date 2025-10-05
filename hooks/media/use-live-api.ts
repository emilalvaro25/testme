/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GenAILiveClient,
  LiveClientStatus,
} from '../../lib/genai-live-client';
import { LiveConnectConfig, LiveServerToolCall } from '@google/genai';
import { AudioStreamer } from '../../lib/audio-streamer';
import { audioContext } from '../../lib/utils';
import { useLogStore, useSettings } from '@/lib/state';
import VolMeterWorket from '../../lib/worklets/vol-meter';

export type UseLiveApiResults = {
  client: GenAILiveClient;
  status: LiveClientStatus;
  connect: (config: LiveConnectConfig) => Promise<void>;
  disconnect: () => void;
  connected: boolean;
  playbackProgress: number;
  volume: number;
};

export function useLiveApi({
  apiKey,
}: {
  apiKey: string;
}): UseLiveApiResults {
  const { model } = useSettings();
  const client = useMemo(
    () => new GenAILiveClient(apiKey, model),
    [apiKey, model],
  );

  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<LiveClientStatus>('disconnected');
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [volume, setVolume] = useState(0);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then(async (audioCtx: AudioContext) => {
        const streamer = new AudioStreamer(audioCtx);
        streamer.onProgress = progress => {
          setPlaybackProgress(progress);
        };
        await streamer.addWorklet(
          'playback-vol-meter',
          VolMeterWorket,
          function (ev: MessageEvent) {
            setVolume(ev.data.volume);
          },
        );
        audioStreamerRef.current = streamer;
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
      setStatus('connected');
    };

    const onClose = () => {
      setConnected(false);
      setStatus('disconnected');
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    // Bind event listeners
    client.on('open', onOpen);
    client.on('close', onClose);
    client.on('interrupted', stopAudioStreamer);
    client.on('audio', onAudio);

    const onToolCall = (toolCall: LiveServerToolCall) => {
      const functionResponses: any[] = [];

      for (const fc of toolCall.functionCalls) {
        // Log the function call trigger
        const triggerMessage = `Triggering function call: **${
          fc.name
        }**\n\`\`\`json\n${JSON.stringify(fc.args, null, 2)}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: triggerMessage,
          isFinal: true,
        });

        // Prepare the response
        functionResponses.push({
          id: fc.id,
          name: fc.name,
          response: { result: 'ok' }, // simple, hard-coded function response
        });
      }

      // Log the function call response
      if (functionResponses.length > 0) {
        const responseMessage = `Function call response:\n\`\`\`json\n${JSON.stringify(
          functionResponses,
          null,
          2,
        )}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: responseMessage,
          isFinal: true,
        });
      }

      client.sendToolResponse({ functionResponses: functionResponses });
    };

    client.on('toolcall', onToolCall);

    return () => {
      // Clean up event listeners
      client.off('open', onOpen);
      client.off('close', onClose);
      client.off('interrupted', stopAudioStreamer);
      client.off('audio', onAudio);
      client.off('toolcall', onToolCall);
    };
  }, [client]);

  const connect = useCallback(
    async (config: LiveConnectConfig) => {
      if (!config || Object.keys(config).length === 0) {
        console.error('Connect called with an empty config.');
        return;
      }
      client.disconnect();
      setStatus('connecting');
      await client.connect(config);
    },
    [client],
  );

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
    setStatus('disconnected');
  }, [setConnected, client]);

  return {
    client,
    status,
    connect,
    connected,
    disconnect,
    playbackProgress,
    volume,
  };
}