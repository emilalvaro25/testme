/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import cn from 'classnames';

export default function Header() {
  const { toggleSidebar, view } = useUI();
  const { status } = useLiveAPIContext();

  if (view === 'live') {
    return (
      <header className="app-header">
        <div className="header-left">
          <div
            className={cn('connection-status', status)}
            title={`Status: ${status}`}
          />
          <h2 className="session-name">Josefa</h2>
        </div>
        <div className="header-right">
          <button
            className="icon-button"
            aria-label="Toggle Captions"
            title="Toggle Captions"
          >
            <span className="icon">closed_caption</span>
          </button>
          <button
            className="icon-button"
            aria-label="Toggle Speaker"
            title="Toggle Speaker"
          >
            <span className="icon">volume_up</span>
          </button>
          <button
            className="icon-button"
            onClick={toggleSidebar}
            aria-label="Settings"
            title="Open settings panel"
          >
            <span className="icon">tune</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="icon-button"
          onClick={toggleSidebar}
          aria-label="Menu"
          title="Open menu"
        >
          <span className="icon">menu</span>
        </button>
        <div className="app-title-container">
          <h1 className="app-title">Kithai AI</h1>
          <div
            className={cn('connection-status', status)}
            title={`Status: ${status}`}
          />
        </div>
      </div>
      <div className="header-right">
        <button
          className="icon-button"
          aria-label="Toggle Captions"
          title="Toggle Captions"
        >
          <span className="icon">closed_caption</span>
        </button>
        <button
          className="icon-button"
          aria-label="Toggle Speaker"
          title="Toggle Speaker"
        >
          <span className="icon">volume_up</span>
        </button>
        <button
          className="icon-button"
          aria-label="Refresh"
          title="Refresh session"
        >
          <span className="icon">refresh</span>
        </button>
      </div>
    </header>
  );
}