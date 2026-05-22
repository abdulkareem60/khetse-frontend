import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  CheckSquare, DollarSign, BarChart2, Shield,
  ScrollText, ChevronLeft, ChevronRight, LogOut,
  Wheat, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: 'Dashboard',   path: '/admin',           permission: 'VIEW_DASHBOARD',    group: 'overview' },
  { Icon: Users,           label: 'Users',       path: '/admin/users',     permission: 'VIEW_USERS',         group: 'data'     },
  { Icon: Package,         label: 'Products',    path: '/admin/products',  permission: 'VIEW_PRODUCTS',      group: 'data'     },
  { Icon: ShoppingCart,    label: 'Orders',      path: '/admin/orders',    permission: 'VIEW_ORDERS',        group: 'data'     },
  { Icon: CheckSquare,     label: 'Approvals',   path: '/admin/approvals', permission: 'MANAGE_APPROVALS',   group: 'ops'      },
  { Icon: DollarSign,      label: 'Finance',     path: '/admin/finance',   permission: 'VIEW_FINANCE',       group: 'ops'      },
  { Icon: BarChart2,       label: 'Analytics',   path: '/admin/analytics', permission: 'VIEW_ANALYTICS',     group: 'ops'      },
  { Icon: Shield,          label: 'Admin Roles', path: '/admin/roles',     permission: 'MANAGE_ADMIN_ROLES', group: 'system'   },
  { Icon: ScrollText,      label: 'Audit Logs',  path: '/admin/audit',     permission: 'VIEW_AUDIT_LOGS',    group: 'system'   },
];

const ROLE_STYLES = {
  SUPER_ADMIN:       { label: 'Super Admin',       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
  PRODUCT_MODERATOR: { label: 'Product Moderator', color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)'  },
  SUPPORT_ADMIN:     { label: 'Support Admin',     color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
  FINANCE_ADMIN:     { label: 'Finance Admin',     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
};

const GROUP_LABELS = { overview: 'Overview', data: 'Management', ops: 'Operations', system: 'System' };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --g950:#031a0a; --g900:#052912; --g800:#0A3D1F; --g700:#166534;
    --g600:#16A34A; --g500:#22C55E; --g400:#4ADE80; --g50:#F0FDF4;
    --s:#fff; --s2:#F8FAFC; --s3:#F1F5F9;
    --b:#E2E8F0; --b2:#CBD5E1;
    --t1:#0F172A; --t2:#334155; --t3:#64748B; --t4:#94A3B8;
    --sh1:0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04);
    --sh2:0 4px 16px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
    --sh3:0 12px 32px rgba(0,0,0,0.12),0 4px 8px rgba(0,0,0,0.06);
    --r1:6px; --r2:10px; --r3:14px; --r4:18px;
    --font:'Inter',-apple-system,sans-serif; --mono:'JetBrains Mono',monospace;
    --sw:240px; --sc:64px; --th:56px;
  }
  body { font-family:var(--font); background:var(--s2); color:var(--t1); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
  img,svg { display:block; }
  button { cursor:pointer; font-family:var(--font); }
  a { text-decoration:none; }
  *::-webkit-scrollbar { width:4px; height:4px; }
  *::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:4px; }
  * { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.15) transparent; }

  .al-shell { display:flex; min-height:100vh; }

  /* ═══ SIDEBAR ═══════════════════════════════════════════ */
  .al-side {
    width:var(--sw); background:var(--g950);
    display:flex; flex-direction:column;
    position:fixed; inset:0 auto 0 0; z-index:300;
    transition:width .22s cubic-bezier(.4,0,.2,1);
    overflow:hidden;
    border-right:1px solid rgba(255,255,255,0.05);
  }
  .al-side.col { width:var(--sc); }

  /* Logo */
  .al-logo {
    display:flex; align-items:center; gap:11px;
    padding:18px 16px 16px;
    border-bottom:1px solid rgba(255,255,255,0.06);
    overflow:hidden; white-space:nowrap; flex-shrink:0;
  }
  .al-logo-icon {
    width:36px; height:36px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(140deg,var(--g700) 0%,var(--g500) 100%);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px rgba(34,197,94,0.35);
    color:#fff;
  }
  .al-logo-text { overflow:hidden; }
  .al-logo-name { font-size:15px; font-weight:800; color:#F0FDF4; letter-spacing:-0.3px; line-height:1.2; }
  .al-logo-sub  { font-size:9.5px; font-weight:600; color:rgba(255,255,255,0.28); text-transform:uppercase; letter-spacing:0.10em; margin-top:1px; }

  /* Role pill */
  .al-pill {
    margin:10px 10px 4px; padding:8px 12px; border-radius:var(--r2);
    display:flex; align-items:center; gap:8px;
    overflow:hidden; white-space:nowrap;
    border:1px solid; flex-shrink:0;
    transition:opacity .2s;
  }
  .al-pill-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .al-pill-text { font-size:11.5px; font-weight:700; }

  /* Nav */
  .al-nav { flex:1; padding:6px 8px; overflow-y:auto; scrollbar-width:none; }
  .al-nav::-webkit-scrollbar { display:none; }
  .al-nav-grp { padding:14px 8px 4px; font-size:9.5px; font-weight:800; color:rgba(255,255,255,0.22); text-transform:uppercase; letter-spacing:.12em; white-space:nowrap; overflow:hidden; }
  .al-nav-item {
    display:flex; align-items:center; gap:10px;
    padding:9px 10px; border-radius:9px; margin-bottom:2px;
    text-decoration:none; overflow:hidden; white-space:nowrap;
    border:1px solid transparent;
    transition:background .13s, border-color .13s;
  }
  .al-nav-item:hover { background:rgba(255,255,255,0.06); }
  .al-nav-item.act { background:rgba(34,197,94,0.12); border-color:rgba(34,197,94,0.20); }
  .al-nav-icon { flex-shrink:0; color:rgba(255,255,255,0.28); transition:color .13s; }
  .al-nav-item:hover .al-nav-icon { color:rgba(255,255,255,0.65); }
  .al-nav-item.act .al-nav-icon  { color:var(--g400); }
  .al-nav-label { font-size:13.5px; font-weight:500; color:rgba(255,255,255,0.55); transition:color .13s; }
  .al-nav-item:hover .al-nav-label { color:rgba(255,255,255,0.90); }
  .al-nav-item.act .al-nav-label  { color:#D1FAE5; font-weight:600; }

  /* Footer */
  .al-foot { padding:10px 8px 12px; border-top:1px solid rgba(255,255,255,0.05); flex-shrink:0; }
  .al-foot-btn {
    width:100%; display:flex; align-items:center; gap:9px;
    padding:8px 10px; border-radius:9px; border:1px solid transparent;
    background:transparent; font-family:var(--font); font-size:12.5px; font-weight:500;
    transition:all .13s; white-space:nowrap; overflow:hidden; margin-bottom:4px; color:rgba(255,255,255,0.35);
  }
  .al-foot-btn:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.70); }
  .al-foot-out { color:#FCA5A5 !important; border-color:rgba(239,68,68,0.16) !important; background:rgba(239,68,68,0.07) !important; }
  .al-foot-out:hover { background:rgba(239,68,68,0.14) !important; border-color:rgba(239,68,68,0.30) !important; color:#FEE2E2 !important; }
  .al-foot-icon { flex-shrink:0; }

  /* ═══ MAIN ═══════════════════════════════════════════════ */
  .al-main { margin-left:var(--sw); flex:1; display:flex; flex-direction:column; min-height:100vh; transition:margin-left .22s cubic-bezier(.4,0,.2,1); }
  .al-main.col { margin-left:var(--sc); }

  /* Topbar */
  .al-top {
    height:var(--th); background:var(--s);
    border-bottom:1px solid var(--b);
    padding:0 clamp(16px,3vw,28px);
    display:flex; justify-content:space-between; align-items:center;
    position:sticky; top:0; z-index:200;
    box-shadow:0 1px 4px rgba(0,0,0,0.05);
  }
  .al-top-left { display:flex; align-items:center; gap:12px; }
  .al-mob-btn {
    display:none; align-items:center; justify-content:center;
    width:36px; height:36px; border-radius:var(--r1);
    background:var(--s3); border:1px solid var(--b);
    color:var(--t2); transition:background .13s;
  }
  .al-mob-btn:hover { background:var(--b); }
  .al-bc { display:flex; align-items:center; gap:5px; }
  .al-bc-root { font-size:12px; color:var(--t4); font-weight:500; }
  .al-bc-sep  { font-size:12px; color:var(--t4); }
  .al-bc-cur  { font-size:13px; color:var(--t1); font-weight:700; }
  .al-top-badge {
    display:flex; align-items:center; gap:5px;
    padding:4px 12px; border-radius:100px; font-size:11.5px; font-weight:700;
    border:1px solid;
  }
  .al-top-dot { width:6px; height:6px; border-radius:50%; }

  /* Body */
  .al-body { padding:clamp(16px,3vw,28px); flex:1; }

  /* Mobile overlay */
  .al-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:290; backdrop-filter:blur(2px); }
  .al-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; z-index:295; background:var(--g950); display:flex; flex-direction:column; transform:translateX(-100%); transition:transform .22s cubic-bezier(.4,0,.2,1); border-right:1px solid rgba(255,255,255,0.05); }
  .al-drawer.open { transform:translateX(0); box-shadow:var(--sh3); }

  @media (max-width:768px) {
    .al-side { display:none !important; }
    .al-main { margin-left:0 !important; }
    .al-mob-btn { display:flex !important; }
    .al-body { padding:16px !important; }
  }
  @media (max-width:480px) { .al-body { padding:12px !important; } .al-top { padding:0 12px !important; } }

  /* ═══ SHARED PAGE COMPONENTS ════════════════════════════ */

  /* Page header */
  .ap-hdr { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:clamp(18px,3vw,26px); }
  .ap-title { font-size:clamp(18px,2.5vw,21px); font-weight:800; color:var(--t1); letter-spacing:-0.4px; }
  .ap-sub   { font-size:13px; color:var(--t3); margin-top:3px; font-weight:400; }

  /* Stat cards */
  .ap-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr)); gap:clamp(12px,2vw,16px); margin-bottom:clamp(16px,2.5vw,22px); }
  .ap-stat {
    background:var(--s); border:1px solid var(--b); border-radius:var(--r3);
    padding:clamp(16px,2.5vw,22px); position:relative; overflow:hidden;
    box-shadow:var(--sh1); transition:all .18s; cursor:default; text-decoration:none; display:block;
  }
  .ap-stat:hover { box-shadow:var(--sh2); transform:translateY(-1px); }
  .ap-stat-bar { position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
  .ap-stat-icon { width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
  .ap-stat-val  { font-size:clamp(22px,3vw,28px); font-weight:800; color:var(--t1); font-family:var(--mono); letter-spacing:-0.5px; line-height:1; margin-bottom:4px; }
  .ap-stat-lbl  { font-size:clamp(11.5px,1.3vw,13px); color:var(--t3); font-weight:500; }
  .ap-stat-sub  { font-size:11px; color:var(--t4); margin-top:3px; }

  /* Info/alert bar */
  .ap-infobar {
    background:linear-gradient(135deg,#FFFBEB,#FEF9EC);
    border:1px solid #FDE68A; border-radius:var(--r3); padding:13px 18px;
    margin-bottom:clamp(16px,2.5vw,22px);
    display:flex; justify-content:space-between; align-items:center;
    gap:12px; flex-wrap:wrap; text-decoration:none; transition:border-color .15s;
  }
  .ap-infobar:hover { border-color:#FCD34D; }
  .ap-infobar-l { display:flex; align-items:center; gap:11px; }
  .ap-infobar-icon { color:#D97706; flex-shrink:0; }
  .ap-infobar-title { font-size:13px; font-weight:700; color:#92400E; }
  .ap-infobar-desc  { font-size:12px; color:#B45309; margin-top:2px; }
  .ap-infobar-cta   { font-size:12.5px; font-weight:700; color:#D97706; white-space:nowrap; }

  /* Cards */
  .ap-card { background:var(--s); border:1px solid var(--b); border-radius:var(--r3); box-shadow:var(--sh1); overflow:hidden; transition:box-shadow .18s; }
  .ap-card:hover { box-shadow:var(--sh2); }
  .ap-card-hdr { padding:clamp(14px,2.2vw,18px) clamp(16px,2.5vw,22px); border-bottom:1px solid var(--s3); display:flex; justify-content:space-between; align-items:center; }
  .ap-card-title { font-size:14px; font-weight:700; color:var(--t1); }
  .ap-card-sub   { font-size:12px; color:var(--t4); margin-top:2px; }
  .ap-card-link  { font-size:12.5px; font-weight:600; color:var(--g600); text-decoration:none; display:flex; align-items:center; gap:4px; transition:color .13s; white-space:nowrap; }
  .ap-card-link:hover { color:var(--g700); }
  .ap-card-body  { padding:clamp(14px,2.2vw,20px) clamp(16px,2.5vw,22px); }

  /* Tables */
  .ap-tbl-wrap { background:var(--s); border:1px solid var(--b); border-radius:var(--r3); overflow:hidden; box-shadow:var(--sh1); }
  .ap-tbl-scroll { width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .ap-tbl { width:100%; border-collapse:collapse; min-width:560px; }
  .ap-tbl thead tr { background:var(--s2); }
  .ap-tbl thead th { padding:10px 16px; text-align:left; font-size:10.5px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:.09em; border-bottom:1px solid var(--b); white-space:nowrap; }
  .ap-tbl tbody tr { border-bottom:1px solid var(--s3); transition:background .10s; }
  .ap-tbl tbody tr:last-child { border-bottom:none; }
  .ap-tbl tbody tr:hover { background:#F9FBFF; }
  .ap-tbl tbody td { padding:clamp(10px,1.5vw,13px) 16px; font-size:13.5px; color:var(--t2); vertical-align:middle; }

  /* Badges */
  .ap-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:100px; font-size:11.5px; font-weight:600; white-space:nowrap; }
  .ap-green  { background:var(--g50); color:#15803D; }
  .ap-red    { background:#FEF2F2; color:#DC2626; }
  .ap-yellow { background:#FFFBEB; color:#D97706; }
  .ap-blue   { background:#EFF6FF; color:#1D4ED8; }
  .ap-purple { background:#F5F3FF; color:#7C3AED; }
  .ap-slate  { background:var(--s3); color:var(--t3); }

  /* Buttons */
  .ap-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:var(--r2); font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid transparent; transition:all .14s; font-family:var(--font); white-space:nowrap; }
  .ap-btn-primary { background:var(--g600); color:#fff; border-color:var(--g600); }
  .ap-btn-primary:hover { background:var(--g700); box-shadow:0 3px 10px rgba(22,163,74,0.28); }
  .ap-btn-ghost   { background:var(--s3); color:var(--t2); border-color:var(--b); }
  .ap-btn-ghost:hover { background:var(--b); }
  .ap-btn-danger  { background:#FEF2F2; color:#DC2626; border-color:#FECACA; }
  .ap-btn-danger:hover { background:#FEE2E2; border-color:#FCA5A5; }
  .ap-btn-warn    { background:#FFFBEB; color:#D97706; border-color:#FDE68A; }
  .ap-btn-warn:hover { background:#FEF3C7; }
  .ap-btn-sm { padding:5px 11px; font-size:12px; border-radius:var(--r1); }
  .ap-btn-full { width:100%; justify-content:center; }

  /* Inputs */
  .ap-input,.ap-select,.ap-textarea {
    padding:9px 12px; border:1.5px solid var(--b); border-radius:var(--r2);
    font-size:13.5px; font-family:var(--font); color:var(--t1);
    background:var(--s); outline:none; width:100%;
    transition:border-color .15s, box-shadow .15s;
  }
  .ap-input:focus,.ap-select:focus,.ap-textarea:focus { border-color:var(--g500); box-shadow:0 0 0 3px rgba(34,197,94,.09); }
  .ap-input::placeholder,.ap-textarea::placeholder { color:var(--t4); }
  .ap-textarea { resize:vertical; min-height:76px; }
  .ap-label { font-size:12px; font-weight:600; color:var(--t2); display:block; margin-bottom:6px; }
  .ap-field { margin-bottom:14px; }
  .ap-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* Alerts */
  .ap-alert { display:flex; align-items:center; gap:9px; padding:11px 15px; border-radius:var(--r2); font-size:13px; font-weight:500; margin-bottom:18px; border:1px solid; }
  .ap-alert-ok   { background:var(--g50);  color:#15803D; border-color:#A7F3D0; }
  .ap-alert-err  { background:#FEF2F2; color:#DC2626; border-color:#FECACA; }
  .ap-alert-warn { background:#FFFBEB; color:#D97706; border-color:#FDE68A; }

  /* Filter bar */
  .ap-filters { display:flex; gap:8px; margin-bottom:clamp(14px,2.5vw,18px); flex-wrap:wrap; align-items:center; }
  .ap-filter-tab { padding:7px 15px; border-radius:var(--r2); border:1.5px solid var(--b); background:var(--s); color:var(--t3); font-size:12.5px; font-weight:600; cursor:pointer; transition:all .13s; font-family:var(--font); white-space:nowrap; }
  .ap-filter-tab:hover { border-color:var(--b2); color:var(--t2); }
  .ap-filter-tab.act { background:var(--g700); border-color:var(--g700); color:#fff; }

  /* Avatar */
  .ap-avatar { border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; }
  .ap-av-sm { width:30px; height:30px; font-size:11px; }
  .ap-av-md { width:36px; height:36px; font-size:13px; }
  .ap-user-cell { display:flex; align-items:center; gap:10px; }

  /* Empty */
  .ap-empty { text-align:center; padding:clamp(48px,8vw,72px) 24px; }
  .ap-empty-icon { margin-bottom:12px; color:var(--t4); display:flex; justify-content:center; }
  .ap-empty-title { font-size:15px; font-weight:700; color:var(--t2); margin-bottom:5px; }
  .ap-empty-sub   { font-size:13px; color:var(--t4); }
  .ap-loading { text-align:center; padding:72px 24px; color:var(--t4); font-size:14px; }
  .ap-denied  { text-align:center; padding:72px 24px; }
  .ap-denied-icon  { display:flex; justify-content:center; margin-bottom:16px; color:#DC2626; }
  .ap-denied-title { font-size:17px; font-weight:700; color:#DC2626; margin-bottom:6px; }
  .ap-denied-sub   { font-size:13px; color:var(--t4); }

  /* Grids */
  .ap-g2 { display:grid; grid-template-columns:1fr 1fr; gap:clamp(14px,2.5vw,20px); }
  .ap-g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(12px,2vw,16px); }
  .ap-g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(12px,2vw,16px); }
  .ap-auto { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr)); gap:clamp(12px,2vw,16px); }

  /* Progress */
  .ap-prog-bg   { background:var(--s3); border-radius:100px; height:6px; overflow:hidden; margin-top:7px; }
  .ap-prog-fill { height:6px; border-radius:100px; transition:width .7s ease; }

  /* Hero strip */
  .ap-hero-strip {
    background:linear-gradient(135deg,var(--g950) 0%,var(--g900) 45%,var(--g800) 100%);
    border-radius:var(--r3); padding:clamp(22px,4vw,32px) clamp(20px,4vw,36px);
    margin-bottom:clamp(16px,2.5vw,22px); position:relative; overflow:hidden;
    border:1px solid rgba(255,255,255,0.04);
  }
  .ap-hero-strip::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 50%,rgba(34,197,94,0.09) 0%,transparent 60%); pointer-events:none; }

  /* Divider */
  .ap-hr { height:1px; background:var(--s3); margin:14px 0; }

  /* Mono */
  .ap-mono { font-family:var(--mono); }
  .ap-link { font-size:12.5px; font-weight:600; color:var(--g600); text-decoration:none; transition:color .13s; }
  .ap-link:hover { color:var(--g700); }

  /* Section label */
  .ap-sec-label { font-size:10.5px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:.09em; display:flex; align-items:center; gap:8px; margin-bottom:14px; }
  .ap-sec-label::after { content:''; flex:1; height:1px; background:var(--b); }

  @media (max-width:1024px) { .ap-g2,.ap-g4 { grid-template-columns:repeat(2,1fr); } .ap-g3 { grid-template-columns:1fr 1fr; } }
  @media (max-width:640px)  { .ap-g2,.ap-g3,.ap-g4 { grid-template-columns:1fr; } .ap-auto { grid-template-columns:repeat(2,1fr); } .ap-form-row { grid-template-columns:1fr; } }
  @media (max-width:480px)  { .ap-auto { grid-template-columns:1fr; } }
`;

export default function AdminLayout({ children }) {
  const { logout }   = useAuth();
  const location     = useLocation();
  const navigate     = useNavigate();
  const [collapsed,   setCollapsed]  = useState(false);
  const [mobileOpen,  setMobileOpen] = useState(false);
  const { adminRole, permissions, loading } = useAdminPermissions();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const visible   = NAV_ITEMS.filter(n => permissions.includes(n.permission));
  const byGroup   = (g) => visible.filter(n => n.group === g);
  const groups    = ['overview', 'data', 'ops', 'system'];
  const rs        = ROLE_STYLES[adminRole] || ROLE_STYLES.SUPPORT_ADMIN;
  const pageLabel = NAV_ITEMS.find(n => isActive(n.path))?.label || 'Admin';

  const SidebarInner = ({ overlay = false }) => (
    <>
      <div className="al-logo">
        <div className="al-logo-icon"><Wheat size={18} strokeWidth={2.5} /></div>
        {(!collapsed || overlay) && (
          <div className="al-logo-text">
            <div className="al-logo-name">KhetSe</div>
            <div className="al-logo-sub">Admin Console</div>
          </div>
        )}
        {overlay && (
          <button onClick={() => setMobileOpen(false)} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.45)', cursor:'pointer', padding:'4px', borderRadius:'6px', flexShrink:0, display:'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {!loading && adminRole && (!collapsed || overlay) && (
        <div className="al-pill" style={{ background: rs.bg, borderColor: rs.border }}>
          <div className="al-pill-dot" style={{ background: rs.color }} />
          <span className="al-pill-text" style={{ color: rs.color }}>{rs.label}</span>
        </div>
      )}

      <nav className="al-nav">
        {loading ? (
          <div style={{ padding:'16px 10px', fontSize:'12px', color:'rgba(255,255,255,0.25)' }}>Loading…</div>
        ) : (
          groups.map(g => {
            const items = byGroup(g);
            if (!items.length) return null;
            return (
              <div key={g}>
                {(!collapsed || overlay) && <div className="al-nav-grp">{GROUP_LABELS[g]}</div>}
                {(collapsed && !overlay) && <div style={{ height:'6px' }} />}
                {items.map(({ Icon, label, path }) => (
                  <Link key={path} to={path}
                    className={`al-nav-item${isActive(path) ? ' act' : ''}`}
                    title={collapsed && !overlay ? label : undefined}>
                    <div className="al-nav-icon"><Icon size={16} strokeWidth={1.8} /></div>
                    {(!collapsed || overlay) && <span className="al-nav-label">{label}</span>}
                  </Link>
                ))}
              </div>
            );
          })
        )}
      </nav>

      <div className="al-foot">
        {!overlay && (
          <button className="al-foot-btn" onClick={() => setCollapsed(!collapsed)}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span className="al-foot-icon">
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        <button className="al-foot-btn al-foot-out" onClick={handleLogout}
          style={{ justifyContent: (collapsed && !overlay) ? 'center' : 'flex-start' }}>
          <span className="al-foot-icon"><LogOut size={14} /></span>
          {(!collapsed || overlay) && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">

        {/* Desktop sidebar */}
        <aside className={`al-side${collapsed ? ' col' : ''}`}>
          <SidebarInner />
        </aside>

        {/* Mobile overlay + drawer */}
        {mobileOpen && <div className="al-overlay" onClick={() => setMobileOpen(false)} />}
        <div className={`al-drawer${mobileOpen ? ' open' : ''}`}>
          <SidebarInner overlay />
        </div>

        {/* Main */}
        <main className={`al-main${collapsed ? ' col' : ''}`}>
          <header className="al-top">
            <div className="al-top-left">
              <button className="al-mob-btn" onClick={() => setMobileOpen(true)}>
                <Menu size={18} />
              </button>
              <div className="al-bc">
                <span className="al-bc-root">KhetSe Admin</span>
                <span className="al-bc-sep">›</span>
                <span className="al-bc-cur">{pageLabel}</span>
              </div>
            </div>
            {!loading && adminRole && (
              <div className="al-top-badge" style={{ background: rs.bg, borderColor: rs.border }}>
                <div className="al-top-dot" style={{ background: rs.color }} />
                <span style={{ color: rs.color }}>{rs.label}</span>
              </div>
            )}
          </header>
          <div className="al-body">{children}</div>
        </main>
      </div>
    </>
  );
}