/**
 * LanguageToggle.jsx
 * Drop-in toggle button: EN ↔ اردو
 * Fits in navbar or any toolbar.
 */

import { useLang } from '../context/LanguageContext';

const css = `
  .lt-btn {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border-radius: 100px;
    overflow: hidden;
    border: 1.5px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.08);
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s;
    user-select: none;
  }
  .lt-btn:hover { border-color: rgba(255,255,255,0.50); }
  .lt-seg {
    padding: 5px 13px;
    font-size: 12.5px;
    font-weight: 700;
    color: rgba(255,255,255,0.55);
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    line-height: 1.4;
    white-space: nowrap;
  }
  .lt-seg.active {
    background: #22C55E;
    color: #052912;
    border-radius: 100px;
    margin: 2px;
    padding: 3px 11px;
  }
  .lt-seg:not(.active):hover { color: rgba(255,255,255,0.85); }
  .lt-loading {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #4ADE80;
    font-family: inherit;
    padding: 4px 10px;
    animation: lt-pulse 1.2s ease-in-out infinite;
  }
  @keyframes lt-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }

  /* Dark theme variant (for buyer/public navbar) */
  .lt-btn-light {
    border-color: rgba(22,163,74,0.30);
    background: rgba(22,163,74,0.06);
  }
  .lt-btn-light:hover { border-color: rgba(22,163,74,0.60); }
  .lt-btn-light .lt-seg { color: #64748B; }
  .lt-btn-light .lt-seg.active { background: #16A34A; color: #fff; }
  .lt-btn-light .lt-seg:not(.active):hover { color: #0F172A; }
`;

/**
 * @param {boolean} light   - Use light (green on white) styling instead of dark
 * @param {boolean} showLoading - Show a translating indicator
 */
export default function LanguageToggle({ light = false, translating = false }) {
  const { lang, setLang } = useLang();

  return (
    <>
      <style>{css}</style>
      <div className={`lt-btn${light ? ' lt-btn-light' : ''}`} role="group" aria-label="Language selector">
        <button
          className={`lt-seg${lang === 'en' ? ' active' : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
        <button
          className={`lt-seg${lang === 'ur' ? ' active' : ''}`}
          onClick={() => setLang('ur')}
          aria-pressed={lang === 'ur'}
          style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
        >
          اردو
        </button>
      </div>
      {translating && (
        <span className="lt-loading">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="#4ADE80" strokeWidth="1.5" strokeDasharray="8 4">
              <animateTransform attributeName="transform" type="rotate" from="0 5 5" to="360 5 5" dur=".8s" repeatCount="indefinite"/>
            </circle>
          </svg>
          Translating…
        </span>
      )}
    </>
  );
}