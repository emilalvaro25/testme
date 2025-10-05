/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';

export default function Header() {
  const { toggleSidebar, view } = useUI();

  if (view === 'live') {
    return (
      <header className="app-header">
        <div className="header-left">
          <h2 className="session-name">Josefa</h2>
        </div>
        <div className="header-right">
          <button className="icon-button" aria-label="Toggle Captions">
            <span className="icon">closed_caption</span>
          </button>
          <button className="icon-button" aria-label="Toggle Speaker">
            <span className="icon">volume_up</span>
          </button>
          <button
            className="icon-button"
            onClick={toggleSidebar}
            aria-label="Settings"
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
        >
          <span className="icon">menu</span>
        </button>
        <h1 className="app-title">Kithai AI</h1>
      </div>
      <div className="header-right">
        <button className="icon-button" aria-label="Toggle Captions">
          <span className="icon">closed_caption</span>
        </button>
        <button className="icon-button" aria-label="Toggle Speaker">
          <span className="icon">volume_up</span>
        </button>
        <button className="icon-button" aria-label="Refresh">
          <span className="icon">refresh</span>
        </button>
      </div>
    </header>
  );
}
