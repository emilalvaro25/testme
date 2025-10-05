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

import cn from 'classnames';
import { memo, useEffect, useState } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';
import { useUI } from '@/lib/state';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

export type ControlTrayProps = {};

function ControlTray({}: ControlTrayProps) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(true);

  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const { setView } = useUI();

  useEffect(() => {
    if (!connected) {
      setMuted(false);
    }
  }, [connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder]);

  const handleMicClick = () => {
    if (connected) {
      setMuted(!muted);
    } else {
      // In this new UI, connect() is called when transitioning to the live view.
      // This button's primary role is now muting.
    }
  };

  const handleEndCall = () => {
    disconnect();
    setView('home');
  };

  const micButtonTitle = connected
    ? muted
      ? 'Unmute microphone'
      : 'Mute microphone'
    : 'Microphone';

  return (
    <section className="live-control-tray">
      <button
        className="control-button"
        onClick={() => setCameraOff(!cameraOff)}
        aria-label={cameraOff ? 'Turn camera on' : 'Turn camera off'}
        title={cameraOff ? 'Turn camera on' : 'Turn camera off'}
      >
        <span className="icon filled">
          {cameraOff ? 'videocam_off' : 'videocam'}
        </span>
      </button>
      <button
        className={cn('control-button', { active: connected && !muted })}
        onClick={handleMicClick}
        title={micButtonTitle}
        aria-label={micButtonTitle}
      >
        <span className="icon filled">{muted ? 'mic_off' : 'mic'}</span>
      </button>
      <button
        className="control-button"
        aria-label="More options"
        title="More options"
      >
        <span className="icon filled">more_horiz</span>
      </button>
      <button
        className="control-button end-call"
        onClick={handleEndCall}
        aria-label="End call"
        title="End call"
      >
        <span className="icon filled">close</span>
      </button>
    </section>
  );
}

export default memo(ControlTray);
