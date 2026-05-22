import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, ClipboardList, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useT } from '../hooks/useTranslation';
import LanguageToggle from '../components/LanguageToggle';

/* ── All strings defined locally — zero dependency on i18n/strings.js ── */
const S = {
  greeting:        'Assalam-o-Alaikum 👋',
  addProduct:      '+ Add Product',
  viewOrders:      'View Orders',
  totalProducts:   'Total Products',
  activeListings:  'Active Listings',
  totalOrders:     'Total Orders',
  delivered:       'Delivered',
  activeNow:       'active',
  currentlyListed: 'Currently listed',
  pending:         'pending',
  completedOrders: 'Completed orders',
  ordersBreakdown: 'Orders Breakdown',
  byStatus:        'By current status',
  viewAll:         'View all →',
  profileStatus:   'Profile Status',
  accountInfo:     'Your account information',
  edit:            'Edit →',
  manageOrders:    'Manage All Orders →',
  updateProfile:   'Update Your Profile',
  updateProfileSub:'Add farm details to attract more buyers',
  pendingReview:   'Profile Update Pending Review',
  pendingReviewSub:'Your update request has been submitted. Admin will review it shortly.',
  approved:        'Profile Update Approved',
  approvedSub:     'Your profile has been updated successfully.',
  rejected:        'Profile Update Rejected',
  rejectedSub:     'Your update request was rejected. Please review the reason below.',
  tipTitle:        '📸 More photos = More orders',
  tipSub:          'Products with 3 clear photos get 4× more buyer inquiries than listings with no images. Make sure all your crops have quality photos.',
  updateListings:  'Update My Listings →',
  pending_label:   'Pending',
  confirmed_label: 'Confirmed',
  delivered_label: 'Delivered',
  addProductQ:     'Add Product',
  addProductSub:   'List a new crop',
  myProductsQ:     'My Products',
  myProductsSub:   'Manage listings',
  viewOrdersQ:     'View Orders',
  viewOrdersSub:   'Incoming orders',
  myProfileQ:      'My Profile',
  myProfileSub:    'Edit & update',
  fullName:        'Full Name',
  city:            'City',
  phone:           'Phone',
  farmName:        'Farm Name',
  farmSize:        'Farm Size',
  crops:           'Crops',
  loading:         'Loading your dashboard…',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --g950:#052912;--g900:#0A3D1F;--g800:#14532D;--g700:#166534;
    --g600:#16A34A;--g500:#22C55E;--g400:#4ADE80;--g50:#F0FDF4;
    --s:#fff;--s2:#F8FAFC;--s3:#F1F5F9;--b:#E2E8F0;
    --t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;
    --sh1:0 1px 3px rgba(0,0,0,.07);--sh2:0 4px 16px rgba(0,0,0,.08);
    --r-sm:8px;--r-md:12px;--r-lg:16px;--r-xl:20px;
    --font:'Plus Jakarta Sans',-apple-system,sans-serif;
    --mono:'JetBrains Mono',monospace;
    --px:clamp(16px,4vw,32px);--py:clamp(16px,3vw,28px);--gap:clamp(12px,2vw,20px);
  }
  .fd-shell{font-family:var(--font);background:var(--s2);min-height:100vh;padding-top:clamp(64px,9vw,90px);}
  .fd-page{max-width:1200px;margin:0 auto;padding:var(--py) var(--px);}
  .fd-loading{display:flex;align-items:center;justify-content:center;min-height:60vh;font-size:15px;color:var(--t4);}

  /* Hero */
  .fd-hero{background:linear-gradient(135deg,var(--g950) 0%,var(--g900) 45%,var(--g800) 100%);border-radius:var(--r-xl);padding:clamp(22px,4vw,36px) clamp(20px,4vw,40px);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:var(--gap);position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(5,41,18,.30);}
  .fd-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(34,197,94,.12) 0%,transparent 60%);pointer-events:none;}
  .fd-hero-l{position:relative;z-index:1;}
  .fd-hero-greet{font-size:clamp(11px,1.2vw,12px);font-weight:600;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.10em;margin-bottom:6px;}
  .fd-hero-name{font-size:clamp(20px,3.5vw,30px);font-weight:800;color:#F0FDF4;letter-spacing:-.4px;line-height:1.2;margin-bottom:4px;}
  .fd-hero-meta{font-size:clamp(12px,1.4vw,14px);color:rgba(255,255,255,.55);}
  .fd-hero-meta span{color:var(--g400);font-weight:600;}
  .fd-hero-r{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1;align-items:center;}
  .fd-btn-p{padding:clamp(9px,1.5vw,12px) clamp(16px,2.5vw,24px);background:var(--g500);color:var(--g950);border:none;border-radius:100px;font-size:clamp(13px,1.4vw,14px);font-weight:700;cursor:pointer;font-family:var(--font);text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;box-shadow:0 4px 14px rgba(34,197,94,.35);}
  .fd-btn-p:hover{background:#4ADE80;transform:translateY(-1px);}
  .fd-btn-s{padding:clamp(9px,1.5vw,12px) clamp(16px,2.5vw,22px);background:rgba(255,255,255,.10);color:rgba(255,255,255,.85);border:1.5px solid rgba(255,255,255,.20);border-radius:100px;font-size:clamp(13px,1.4vw,14px);font-weight:600;cursor:pointer;font-family:var(--font);text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
  .fd-btn-s:hover{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.35);}

  /* Stats */
  .fd-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr));gap:var(--gap);margin-bottom:var(--gap);}
  .fd-stat{background:var(--s);border:1px solid var(--b);border-radius:var(--r-lg);padding:clamp(16px,2.5vw,22px);position:relative;overflow:hidden;box-shadow:var(--sh1);transition:all .18s;}
  .fd-stat:hover{box-shadow:var(--sh2);transform:translateY(-2px);}
  .fd-stat-bar{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-lg) var(--r-lg) 0 0;}
  .fd-stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
  .fd-stat-val{font-size:clamp(22px,3vw,28px);font-weight:700;color:var(--t1);font-family:var(--mono);letter-spacing:-.5px;line-height:1;margin-bottom:4px;}
  .fd-stat-lbl{font-size:clamp(12px,1.3vw,13px);color:var(--t3);font-weight:500;}
  .fd-stat-sub{font-size:11.5px;color:var(--t4);margin-top:3px;}

  /* Quick actions */
  .fd-actions{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(180px,100%),1fr));gap:10px;margin-bottom:var(--gap);}
  .fd-action{display:flex;align-items:center;gap:12px;padding:clamp(14px,2.2vw,18px) clamp(14px,2.5vw,20px);background:var(--s);border:1.5px solid var(--b);border-radius:var(--r-lg);cursor:pointer;text-decoration:none;box-shadow:var(--sh1);transition:all .16s;}
  .fd-action:hover{border-color:var(--g400);box-shadow:var(--sh2);transform:translateY(-2px);}
  .fd-action-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .fd-action-lbl{font-size:13.5px;font-weight:700;color:var(--t1);}
  .fd-action-sub{font-size:11.5px;color:var(--t4);margin-top:2px;}
  .fd-action-arr{margin-left:auto;color:var(--t4);font-size:16px;transition:transform .13s;flex-shrink:0;}
  .fd-action:hover .fd-action-arr{transform:translateX(3px);color:var(--g600);}

  /* 2-col grid */
  .fd-g2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap);margin-bottom:var(--gap);}

  /* Cards */
  .fd-card{background:var(--s);border:1px solid var(--b);border-radius:var(--r-lg);box-shadow:var(--sh1);overflow:hidden;transition:box-shadow .18s;}
  .fd-card:hover{box-shadow:var(--sh2);}
  .fd-card-hdr{padding:clamp(14px,2.2vw,20px) clamp(16px,2.5vw,24px);border-bottom:1px solid var(--s3);display:flex;justify-content:space-between;align-items:center;}
  .fd-card-title{font-size:clamp(13px,1.6vw,15px);font-weight:700;color:var(--t1);}
  .fd-card-sub{font-size:12px;color:var(--t4);margin-top:2px;}
  .fd-card-link{font-size:12.5px;font-weight:600;color:var(--g600);text-decoration:none;white-space:nowrap;transition:color .13s;}
  .fd-card-link:hover{color:var(--g700);}
  .fd-card-body{padding:clamp(12px,2vw,20px) clamp(16px,2.5vw,24px);}

  /* Breakdown rows */
  .fd-brow{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--s3);}
  .fd-brow:last-child{border-bottom:none;}
  .fd-brow-lbl{font-size:13.5px;font-weight:600;color:var(--t2);}
  .fd-brow-sub{font-size:11.5px;color:var(--t4);margin-top:1px;}
  .fd-brow-count{font-family:var(--mono);font-size:20px;font-weight:700;padding:4px 14px;border-radius:10px;}

  /* Request banners */
  .fd-req-ban{border-radius:var(--r-lg);padding:clamp(14px,2.2vw,18px) clamp(16px,2.5vw,22px);margin-bottom:var(--gap);border:1.5px solid;display:flex;gap:12px;align-items:flex-start;}
  .fd-req-title{font-size:13.5px;font-weight:700;margin-bottom:2px;}
  .fd-req-sub{font-size:12.5px;line-height:1.5;}
  .fd-req-note{margin-top:10px;padding:10px 14px;border-radius:8px;font-size:12.5px;font-style:italic;}

  /* Profile info grid */
  .fd-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
  .fd-info-cell{background:var(--s2);border-radius:var(--r-sm);padding:10px 12px;border:1px solid var(--b);}
  .fd-info-lbl{font-size:10px;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
  .fd-info-val{font-size:13px;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

  /* Tip strip */
  .fd-tip{background:linear-gradient(135deg,var(--g950),var(--g900));border-radius:var(--r-lg);padding:clamp(20px,3.5vw,28px) clamp(20px,4vw,32px);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;box-shadow:0 6px 24px rgba(5,41,18,.22);}
  .fd-tip-title{font-size:clamp(14px,2vw,18px);font-weight:800;color:#F0FDF4;margin-bottom:6px;}
  .fd-tip-sub{font-size:clamp(12px,1.4vw,13.5px);color:rgba(255,255,255,.60);line-height:1.6;max-width:520px;}
  .fd-tip-btn{padding:11px 24px;border-radius:100px;background:#D4A017;color:var(--g950);border:none;font-size:13.5px;font-weight:700;cursor:pointer;font-family:var(--font);white-space:nowrap;text-decoration:none;display:inline-block;transition:all .15s;}
  .fd-tip-btn:hover{background:#E5B520;transform:translateY(-1px);}

  /* Responsive */
  @media(max-width:1024px){.fd-g2{grid-template-columns:1fr;}}
  @media(max-width:640px){
    .fd-hero{flex-direction:column;align-items:flex-start;}
    .fd-hero-r{width:100%;}
    .fd-btn-p,.fd-btn-s{flex:1;justify-content:center;}
    .fd-tip{flex-direction:column;}
    .fd-tip-btn{width:100%;text-align:center;}
  }
  @media(max-width:480px){
    .fd-actions{grid-template-columns:1fr;}
    .fd-hero-r{flex-direction:column;}
    .fd-btn-p,.fd-btn-s{width:100%;justify-content:center;}
  }
`;

export default function FarmerDashboard() {
  const { user }   = useAuth();
  const { isUrdu } = useLang();

  /* useT always receives the locally-defined S — never undefined */
  const { t, translating } = useT(S);

  const [stats,      setStats]      = useState(null);
  const [farmerUser, setFarmerUser] = useState(null);
  const [profile,    setProfile]    = useState(null);
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    Promise.all([
      API.get(`/profile/dashboard/${user.userId}`),
      API.get(`/profile/user/${user.userId}`),
      API.get(`/profile/${user.userId}`),
      API.get(`/profile/requests/${user.userId}`),
    ]).then(([s, u, p, r]) => {
      setStats(s.data);
      setFarmerUser(u.data);
      setProfile(p.data);
      setRequests(r.data);
    }).finally(() => setLoading(false));
  }, [user?.userId]); // eslint-disable-line

  if (loading) return (
    <div className="fd-shell">
      <style>{STYLES}</style>
      <div className="fd-page">
        <div className="fd-loading">{t.loading}</div>
      </div>
    </div>
  );

  /* Request status meta */
  const latestReq = requests[0];
  const reqStatus = latestReq?.status;
  const reqMeta = {
    pending:  { bg:'#FFFBEB', border:'#FDE68A', color:'#D97706', icon:'⏳', title: t.pendingReview,  sub: t.pendingReviewSub  },
    approved: { bg:'#F0FDF4', border:'#BBF7D0', color:'#15803D', icon:'✅', title: t.approved,       sub: t.approvedSub       },
    rejected: { bg:'#FEF2F2', border:'#FECACA', color:'#DC2626', icon:'❌', title: t.rejected,       sub: t.rejectedSub       },
  };

  /* Stat cards — Icon stored as capital key, rendered as <s.Icon /> */
  const STAT_CARDS = [
    { Icon: Package,       label: t.totalProducts,  value: stats?.totalProducts   ?? 0, sub: `${stats?.activeListings ?? 0} ${t.activeNow}`,  accent:'#16A34A', iconBg:'#F0FDF4', iconColor:'#16A34A' },
    { Icon: ShoppingBag,   label: t.activeListings, value: stats?.activeListings  ?? 0, sub: t.currentlyListed,                                accent:'#2563EB', iconBg:'#EFF6FF', iconColor:'#2563EB' },
    { Icon: ClipboardList, label: t.totalOrders,    value: stats?.totalOrders     ?? 0, sub: `${stats?.pendingOrders ?? 0} ${t.pending}`,      accent:'#D97706', iconBg:'#FFFBEB', iconColor:'#D97706' },
    { Icon: CheckCircle,   label: t.delivered,      value: stats?.deliveredOrders ?? 0, sub: t.completedOrders,                                accent:'#0891B2', iconBg:'#ECFEFF', iconColor:'#0891B2' },
  ];

  const QUICK_ACTIONS = [
    { to:'/add-product',    emoji:'🌱', bg:'#F0FDF4', color:'#15803D', label: t.addProductQ,  sub: t.addProductSub  },
    { to:'/my-products',    emoji:'📦', bg:'#EFF6FF', color:'#1D4ED8', label: t.myProductsQ,  sub: t.myProductsSub  },
    { to:'/farmer-orders',  emoji:'📋', bg:'#FFFBEB', color:'#D97706', label: t.viewOrdersQ,  sub: t.viewOrdersSub  },
    { to:'/farmer-profile', emoji:'👤', bg:'#F5F3FF', color:'#7C3AED', label: t.myProfileQ,   sub: t.myProfileSub   },
  ];

  const ORDER_BREAKDOWN = [
    { label: t.pending_label,   value: stats?.pendingOrders   ?? 0, color:'#D97706', bg:'#FFFBEB' },
    { label: t.confirmed_label, value: stats?.confirmedOrders ?? 0, color:'#2563EB', bg:'#EFF6FF' },
    { label: t.delivered_label, value: stats?.deliveredOrders ?? 0, color:'#15803D', bg:'#F0FDF4' },
  ];

  const PROFILE_FIELDS = [
    { label: t.fullName, value: farmerUser?.fullName || '—' },
    { label: t.city,     value: farmerUser?.city     || '—' },
    { label: t.phone,    value: farmerUser?.phone    || '—' },
    { label: t.farmName, value: profile?.farmName    || '—' },
    { label: t.farmSize, value: profile?.farmSize    || '—' },
    { label: t.crops,    value: profile?.cropsGrown  || '—' },
  ];

  const urStyle = isUrdu ? { fontFamily:"'Noto Nastaliq Urdu',serif", direction:'rtl' } : {};

  return (
    <div className="fd-shell">
      <style>{STYLES}</style>
      <div className="fd-page">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="fd-hero">
          <div className="fd-hero-l">
            <div className="fd-hero-greet" style={urStyle}>{t.greeting}</div>
            <div className="fd-hero-name">{farmerUser?.fullName || 'Farmer'}</div>
            <div className="fd-hero-meta">
              🌾 <span>{profile?.farmName || 'KhetSe Seller'}</span>
              {farmerUser?.city && <> · {farmerUser.city}</>}
            </div>
          </div>
          <div className="fd-hero-r">
            <LanguageToggle translating={translating} />
            <Link to="/add-product"   className="fd-btn-p" style={urStyle}>{t.addProduct}</Link>
            <Link to="/farmer-orders" className="fd-btn-s" style={urStyle}>{t.viewOrders}</Link>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────── */}
        <div className="fd-stats">
          {STAT_CARDS.map((s, i) => (
            <div key={i} className="fd-stat">
              <div className="fd-stat-bar" style={{ background: s.accent }} />
              <div className="fd-stat-icon" style={{ background: s.iconBg }}>
                <s.Icon size={20} color={s.iconColor} strokeWidth={1.8} />
              </div>
              <div className="fd-stat-val">{s.value}</div>
              <div className="fd-stat-lbl" style={urStyle}>{s.label}</div>
              <div className="fd-stat-sub" style={urStyle}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick actions ─────────────────────────────────── */}
        <div className="fd-actions">
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} to={a.to} className="fd-action">
              <div className="fd-action-icon" style={{ background: a.bg, color: a.color }}>
                {a.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="fd-action-lbl" style={urStyle}>{a.label}</div>
                <div className="fd-action-sub" style={urStyle}>{a.sub}</div>
              </div>
              <div className="fd-action-arr">→</div>
            </Link>
          ))}
        </div>

        {/* ── Orders breakdown + Profile status ─────────────── */}
        <div className="fd-g2">

          {/* Orders breakdown */}
          <div className="fd-card">
            <div className="fd-card-hdr">
              <div>
                <div className="fd-card-title" style={urStyle}>{t.ordersBreakdown}</div>
                <div className="fd-card-sub"   style={urStyle}>{t.byStatus}</div>
              </div>
              <Link to="/farmer-orders" className="fd-card-link">{t.viewAll}</Link>
            </div>
            <div className="fd-card-body">
              {ORDER_BREAKDOWN.map((row, i) => (
                <div key={i} className="fd-brow">
                  <div className="fd-brow-lbl" style={urStyle}>{row.label}</div>
                  <div className="fd-brow-count" style={{ color: row.color, background: row.bg }}>
                    {row.value}
                  </div>
                </div>
              ))}
              <Link to="/farmer-orders" style={{
                display:'block', width:'100%', marginTop:'16px', padding:'10px',
                background:'var(--s2)', border:'1px solid var(--b)',
                borderRadius:'var(--r-sm)', textAlign:'center',
                fontSize:'13px', fontWeight:'600', color:'var(--g600)', textDecoration:'none',
              }}>
                {t.manageOrders}
              </Link>
            </div>
          </div>

          {/* Profile status */}
          <div className="fd-card">
            <div className="fd-card-hdr">
              <div>
                <div className="fd-card-title" style={urStyle}>{t.profileStatus}</div>
                <div className="fd-card-sub"   style={urStyle}>{t.accountInfo}</div>
              </div>
              <Link to="/farmer-profile" className="fd-card-link">{t.edit}</Link>
            </div>
            <div className="fd-card-body">
              <div className="fd-info-grid">
                {PROFILE_FIELDS.map((f, i) => (
                  <div key={i} className="fd-info-cell">
                    <div className="fd-info-lbl">{f.label}</div>
                    <div className="fd-info-val">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Latest request status banner */}
              {latestReq && reqMeta[reqStatus] && (
                <div className="fd-req-ban" style={{
                  background:   reqMeta[reqStatus].bg,
                  borderColor:  reqMeta[reqStatus].border,
                }}>
                  <div style={{ fontSize:'18px', flexShrink:0 }}>{reqMeta[reqStatus].icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="fd-req-title" style={{ color: reqMeta[reqStatus].color, ...urStyle }}>
                      {reqMeta[reqStatus].title}
                    </div>
                    <div className="fd-req-sub" style={{ color: reqMeta[reqStatus].color, opacity:.8, ...urStyle }}>
                      {reqMeta[reqStatus].sub}
                    </div>
                    {latestReq.adminNote && (
                      <div className="fd-req-note" style={{
                        background: `${reqMeta[reqStatus].border}55`,
                        color:       reqMeta[reqStatus].color,
                      }}>
                        💬 {latestReq.adminNote}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No requests yet — prompt to update */}
              {!latestReq && (
                <Link to="/farmer-profile" style={{
                  display:'block', padding:'12px 16px',
                  background:'var(--g50)', border:'1.5px dashed var(--g400)',
                  borderRadius:'var(--r-sm)', textAlign:'center', textDecoration:'none',
                }}>
                  <div style={{ fontSize:'13.5px', fontWeight:'700', color:'var(--g700)', ...urStyle }}>
                    {t.updateProfile}
                  </div>
                  <div style={{ fontSize:'12px', color:'var(--g600)', marginTop:'2px', ...urStyle }}>
                    {t.updateProfileSub}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Pro tip strip ─────────────────────────────────── */}
        <div className="fd-tip">
          <div>
            <div className="fd-tip-title" style={urStyle}>{t.tipTitle}</div>
            <div className="fd-tip-sub"   style={urStyle}>{t.tipSub}</div>
          </div>
          <Link to="/my-products" className="fd-tip-btn" style={urStyle}>
            {t.updateListings}
          </Link>
        </div>

      </div>
    </div>
  );
}