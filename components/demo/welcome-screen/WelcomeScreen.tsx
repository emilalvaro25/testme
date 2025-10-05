/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';
import { useUI } from '../../../lib/state';

const WelcomeScreen: React.FC = () => {
  const { setView } = useUI();

  const handleStartSession = () => {
    setView('live');
  };

  return (
    <div className="home-screen">
      <div className="home-content">
        <h2 className="home-title">What can I help with?</h2>
        <div className="action-chips">
          <button className="chip">
            <span className="icon">palette</span> Create image
          </button>
          <button className="chip">
            <span className="icon">summarize</span> Summarize text
          </button>
          <button className="chip">
            <span className="icon">edit_square</span> Help me write
          </button>
          <button className="chip">More</button>
        </div>
      </div>
      <div className="bottom-input-bar">
        <button className="icon-button" aria-label="Upload image">
          <span className="icon">add_photo_alternate</span>
        </button>
        <div className="input-text-container" aria-label="Ask anything">
          <span>Ask anything</span>
        </div>
        <button
          className="icon-button"
          onClick={handleStartSession}
          aria-label="Start voice session"
        >
          <span className="icon">mic</span>
        </button>
        <button className="icon-button" aria-label="Ask with text">
          <span className="icon">graphic_eq</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;