/**
 * src/components/Navbar.jsx
 * - All hooks called unconditionally before any early return
 * - Safe fallback strings so it never crashes if STRINGS is undefined
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useT } from '../hooks/useTranslation';
import LanguageToggle from './LanguageToggle';

// Inline fallback — works even if i18n/strings.js hasn't been created yet
const NAV_STRINGS = {
  browse: 'Browse', myOrders: 'My Orders', dashboard: 'Dashboard',
  myProducts: 'My Products', orders: 'Orders', profile: 'Profile',
  login: 'Login', register: 'Register', logout: 'Logout',
  loggedInAs: 'Logged in as', signOut: 'Sign Out', language: 'Language',
};

// Try to load from strings.js — if the file doesn't exist yet this won't crash
let EXTERNAL_STRINGS = NAV_STRINGS;
try {
  // Dynamic require so a missing file degrades gracefully
  const mod = require('../i18n/strings');
  if (mod && mod.STRINGS && mod.STRINGS.navbar) {
    EXTERNAL_STRINGS = mod.STRINGS.navbar;
  }
} catch (_) {
  // strings.js not found — use inline fallback above
}

export default function Navbar() {
  // ── ALL hooks at the top — never after a conditional return ──
  const { user, logout } = useAuth();
  const { isUrdu }       = useLang();
  const { t }            = useT(EXTERNAL_STRINGS);
  const navigate         = useNavigate();
  const location         = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // ─────────────────────────────────────────────────────────────

  const isHome   = location.pathname === '/';
  const isFarmer = user?.role === 'farmer';
  const isAdmin  = user?.role === 'admin';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Admin users have their own sidebar — no public navbar needed
  if (isAdmin) return null;

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (p) => location.pathname === p;

  const navBg = isHome
    ? scrolled ? 'rgba(5,41,18,0.96)' : 'transparent'
    : 'rgba(5,41,18,0.97)';

  const farmerLinks = [
    { path: '/farmer-dashboard', label: t.dashboard  || 'Dashboard'   },
    { path: '/my-products',      label: t.myProducts || 'My Products' },
    { path: '/farmer-orders',    label: t.orders     || 'Orders'      },
    { path: '/farmer-profile',   label: t.profile    || 'Profile'     },
  ];
  const buyerLinks = [
    { path: '/products',  label: t.browse    || 'Browse'    },
    { path: '/my-orders', label: t.myOrders  || 'My Orders' },
  ];
  const guestLinks = [
    { path: '/products', label: t.browse || 'Browse' },
  ];
  const links = isFarmer ? farmerLinks : user ? buyerLinks : guestLinks;

  const urStyle = isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', serif" } : {};

  const CSS = `
    .ksn {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: ${navBg};
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: ${scrolled || !isHome ? '1px solid rgba(255,255,255,0.06)' : 'none'};
      box-shadow: ${scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'};
      transition: background 0.3s, box-shadow 0.3s;
    }
    .ksn-inner {
      max-width: 1280px; margin: 0 auto;
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 clamp(16px, 4vw, 48px);
      height: clamp(56px, 8vw, 68px);
    }
    .ksn-logo { font-size: clamp(20px,3vw,26px); font-weight: 800; color: #FAFAF7; text-decoration: none; font-family: Georgia, serif; }
    .ksn-logo span { color: #FAC775; }
    .ksn-center { display: flex; align-items: center; gap: clamp(20px, 3vw, 40px); }
    .ksn-link { font-size: clamp(13px,1.5vw,15px); font-weight: 500; color: rgba(255,255,255,0.85); text-decoration: none; position: relative; padding-bottom: 3px; transition: color 0.15s; white-space: nowrap; }
    .ksn-link:hover { color: #fff; }
    .ksn-link.act { color: #4ADE80; font-weight: 600; }
    .ksn-link.act::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 2px; background: #4ADE80; border-radius: 2px; }
    .ksn-right { display: flex; align-items: center; gap: clamp(8px, 1.5vw, 14px); }
    .ksn-pill { display: flex; align-items: center; gap: 8px; padding: 5px 14px 5px 6px; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15); border-radius: 100px; }
    .ksn-dot { width: 28px; height: 28px; border-radius: 50%; background: #22C55E; color: #052912; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
    .ksn-logout { padding: 7px 18px; border-radius: 100px; background: transparent; color: rgba(255,255,255,0.75); border: 1.5px solid rgba(255,255,255,0.25); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
    .ksn-logout:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
    .ksn-signin { padding: 8px 22px; border-radius: 100px; background: #22C55E; color: #052912; border: none; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; text-decoration: none; display: inline-block; }
    .ksn-signin:hover { background: #16A34A; }
    .ksn-login-lnk { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.15s; }
    .ksn-login-lnk:hover { color: #fff; }
    .ksn-ham { display: none; background: none; border: none; color: rgba(255,255,255,0.85); font-size: 22px; padding: 6px; cursor: pointer; border-radius: 8px; }
    .ksn-mob {
      position: fixed; inset: 0; z-index: 999; background: #052912;
      display: flex; flex-direction: column;
      transform: translateX(${menuOpen ? '0' : '100%'});
      transition: transform 0.25s cubic-bezier(.4,0,.2,1);
      overflow-y: auto;
    }
    .ksn-mob-hdr { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); min-height: 60px; }
    .ksn-mob-close { background: none; border: none; color: rgba(255,255,255,0.55); font-size: 24px; cursor: pointer; padding: 4px 8px; border-radius: 8px; }
    .ksn-mob-links { flex: 1; padding: 12px 16px; display: flex; flex-direction: column; gap: 3px; }
    .ksn-mob-link { padding: 13px 16px; border-radius: 10px; font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.75); text-decoration: none; transition: background 0.12s; border: 1px solid transparent; display: block; }
    .ksn-mob-link:hover { background: rgba(255,255,255,0.06); }
    .ksn-mob-link.act { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.20); color: #D1FAE5; font-weight: 600; }
    .ksn-mob-foot { padding: 16px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 10px; }
    .ksn-mob-lang { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.07); }
    .ksn-mob-lang-lbl { font-size: 13px; color: rgba(255,255,255,0.40); font-weight: 500; }
    .ksn-mob-out { width: 100%; padding: 13px; border-radius: 10px; background: rgba(239,68,68,0.10); border: 1px solid rgba(239,68,68,0.20); color: #FCA5A5; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
    .ksn-mob-in  { display: block; width: 100%; padding: 13px; border-radius: 10px; text-align: center; background: #22C55E; color: #052912; font-size: 15px; font-weight: 700; text-decoration: none; }
    .ksn-mob-reg { display: block; width: 100%; padding: 13px; border-radius: 10px; text-align: center; background: transparent; color: rgba(255,255,255,0.75); border: 1.5px solid rgba(255,255,255,0.20); font-size: 15px; font-weight: 600; text-decoration: none; }
    @media (max-width: 768px) {
      .ksn-center, .ksn-right { display: none !important; }
      .ksn-ham { display: flex !important; align-items: center; }
    }
  `;

  const roleLetter = user?.email?.charAt(0).toUpperCase() || 'U';
  const roleLabel  = isFarmer ? '🌾 Farmer' : '🛒 Buyer';

  return (
    <>
      <style>{CSS}</style>

      {/* ── Desktop navbar ── */}
      <nav className="ksn" aria-label="Main navigation">
        <div className="ksn-inner">
          <Link to={isFarmer ? '/farmer-dashboard' : '/'} className="ksn-logo">
            Khet<span>Se</span>
          </Link>

          <div className="ksn-center">
            {links.map(l => (
              <Link key={l.path} to={l.path}
                className={`ksn-link${isActive(l.path) ? ' act' : ''}`}
                style={urStyle}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ksn-right">
            <LanguageToggle />
            {user ? (
              <>
                <div className="ksn-pill">
                  <div className="ksn-dot">{roleLetter}</div>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                    {roleLabel}
                  </span>
                </div>
                <button className="ksn-logout" onClick={handleLogout}>
                  {t.logout || 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="ksn-login-lnk">{t.login    || 'Login'}</Link>
                <Link to="/register" className="ksn-signin">{t.register || 'Register'} →</Link>
              </>
            )}
          </div>

          <button className="ksn-ham" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            ☰
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div className="ksn-mob" role="dialog" aria-modal="true" aria-label="Mobile menu">
        <div className="ksn-mob-hdr">
          <Link to="/" className="ksn-logo" style={{ fontSize: '20px' }}>
            Khet<span>Se</span>
          </Link>
          <button className="ksn-mob-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="ksn-mob-links">
          {links.map(l => (
            <Link key={l.path} to={l.path}
              className={`ksn-mob-link${isActive(l.path) ? ' act' : ''}`}
              style={urStyle}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ksn-mob-foot">
          <div className="ksn-mob-lang">
            <span className="ksn-mob-lang-lbl">{t.language || 'Language'}:</span>
            <LanguageToggle />
          </div>

          {user ? (
            <>
              <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px', textTransform: 'uppercase' }}>
                  {t.loggedInAs || 'Logged in as'}
                </div>
                <div style={{ fontSize: '14px', color: '#4ADE80', fontWeight: '600' }}>
                  {user.email}
                </div>
              </div>
              <button className="ksn-mob-out" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                {t.signOut || 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="ksn-mob-in"  onClick={() => setMenuOpen(false)}>{t.login    || 'Login'}</Link>
              <Link to="/register" className="ksn-mob-reg" onClick={() => setMenuOpen(false)}>{t.register || 'Register'} →</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}