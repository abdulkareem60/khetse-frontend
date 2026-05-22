/**
 * src/components/LanguageToggle.jsx
 *
 * Segmented EN / اردو button.
 * Props:
 *   light       {boolean} — green-on-white variant (for white backgrounds)
 *   translating {boolean} — show spinning indicator
 *   size        {'sm'|'md'} — sm for compact toolbars
 */

import { useLang } from '../context/LanguageContext';

const CSS = `
  .lt-wrap     { display:inline-flex; align-items:center; gap:8px; flex-shrink:0; }
  .lt-pill     { display:inline-flex; align-items:center; border-radius:100px; overflow:hidden; cursor:pointer; user-select:none; transition:border-color .15s; }
  .lt-pill-dk  { border:1.5px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.08); }
  .lt-pill-dk:hover { border-color:rgba(255,255,255,0.45); }
  .lt-pill-lt  { border:1.5px solid #CBD5E1; background:#F8FAFC; }
  .lt-pill-lt:hover { border-color:#94A3B8; }

  .lt-seg { padding:5px 13px; font-size:12.5px; font-weight:700; border:none; background:transparent; cursor:pointer; font-family:inherit; transition:all .15s; line-height:1.4; white-space:nowrap; }
  .lt-seg-sm  { padding:3px 10px; font-size:11.5px; }
  /* Dark theme */
  .lt-seg-dk  { color:rgba(255,255,255,0.50); }
  .lt-seg-dk:hover:not(.lt-active-dk) { color:rgba(255,255,255,0.85); }
  .lt-active-dk { background:#22C55E; color:#052912; border-radius:100px; margin:2px; padding:3px 11px; }
  .lt-active-dk.lt-seg-sm { padding:1px 9px; }
  /* Light theme */
  .lt-seg-lt  { color:#64748B; }
  .lt-seg-lt:hover:not(.lt-active-lt) { color:#0F172A; }
  .lt-active-lt { background:#16A34A; color:#fff; border-radius:100px; margin:2px; padding:3px 11px; }
  .lt-active-lt.lt-seg-sm { padding:1px 9px; }

  /* Urdu font */
  .lt-ur { font-family:'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif; }

  /* Spinner */
  .lt-spin { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:500; }
  .lt-spin-dk { color:#4ADE80; }
  .lt-spin-lt { color:#16A34A; }
  .lt-spin-svg { animation:lt-rotate .8s linear infinite; }
  @keyframes lt-rotate { to { transform:rotate(360deg); } }
`;

export default function LanguageToggle({ light = false, translating = false, size = 'md' }) {
  const { lang, setLang } = useLang();
  const theme  = light ? 'lt' : 'dk';
  const segSm  = size === 'sm' ? ' lt-seg-sm' : '';

  return (
    <>
      <style>{CSS}</style>
      <div className="lt-wrap">
        <div className={`lt-pill lt-pill-${theme}`} role="group" aria-label="Language selector">
          <button
            className={`lt-seg lt-seg-${theme}${segSm}${lang === 'en' ? ` lt-active-${theme}` : ''}`}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
          <button
            className={`lt-seg lt-seg-${theme} lt-ur${segSm}${lang === 'ur' ? ` lt-active-${theme}` : ''}`}
            onClick={() => setLang('ur')}
            aria-pressed={lang === 'ur'}
          >
            اردو
          </button>
        </div>

        {translating && (
          <span className={`lt-spin lt-spin-${theme}`}>
            <svg className="lt-spin-svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.8"
                strokeDasharray="12 8" strokeLinecap="round"/>
            </svg>
            {light ? 'Translating…' : ''}
          </span>
        )}
      </div>
    </>
  );
}