import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Package, ShoppingCart, DollarSign,
  Clock, Truck, CheckSquare, LayoutGrid,
  ArrowRight, TrendingUp
} from 'lucide-react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

const STATUS_CLS = { pending:'ap-yellow', confirmed:'ap-blue', delivered:'ap-green', cancelled:'ap-red' };

export default function AdminDashboard() {
  const [stats,  setStats]   = useState(null);
  const [users,  setUsers]   = useState([]);
  const [orders, setOrders]  = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/dashboard'),
      API.get('/admin/users'),
      API.get('/admin/orders'),
    ]).then(([s,u,o]) => { setStats(s.data); setUsers(u.data.slice(0,6)); setOrders(o.data.slice(0,6)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="ap-loading">Loading dashboard…</div></AdminLayout>;

  const STATS1 = [
    { Icon:Users,       label:'Total Users',    value:stats?.totalUsers    ?? 0, sub:`${stats?.totalFarmers??0} farmers · ${stats?.totalBuyers??0} buyers`, accent:'#2563EB', iconBg:'#EFF6FF', iconColor:'#2563EB', link:'/admin/users'    },
    { Icon:Package,     label:'Products',       value:stats?.totalProducts ?? 0, sub:`${stats?.activeProducts??0} active listings`,                          accent:'#16A34A', iconBg:'#F0FDF4', iconColor:'#16A34A', link:'/admin/products' },
    { Icon:ShoppingCart,label:'Total Orders',   value:stats?.totalOrders   ?? 0, sub:`${stats?.pendingOrders??0} pending`,                                   accent:'#0891B2', iconBg:'#ECFEFF', iconColor:'#0891B2', link:'/admin/orders'   },
    { Icon:DollarSign,  label:'Revenue',        value:`Rs.${(stats?.totalRevenue??0).toLocaleString()}`, sub:'From paid orders',                             accent:'#D97706', iconBg:'#FFFBEB', iconColor:'#D97706'                         },
  ];

  const STATS2 = [
    { Icon:Clock,       label:'Pending Orders',    value:stats?.pendingOrders    ??0, accent:'#F59E0B', iconBg:'#FFFBEB', iconColor:'#D97706', link:'/admin/orders'    },
    { Icon:Truck,       label:'Delivered',          value:stats?.deliveredOrders  ??0, accent:'#10B981', iconBg:'#F0FDF4', iconColor:'#16A34A', link:'/admin/orders'    },
    { Icon:CheckSquare, label:'Pending Approvals',  value:stats?.pendingProfileRequests??0, accent:'#EF4444', iconBg:'#FEF2F2', iconColor:'#DC2626', link:'/admin/approvals' },
    { Icon:LayoutGrid,  label:'Active Listings',    value:stats?.activeProducts   ??0, accent:'#22C55E', iconBg:'#F0FDF4', iconColor:'#16A34A', link:'/admin/products'  },
  ];

  const roleColor = { farmer:{ bg:'#F0FDF4',color:'#15803D' }, buyer:{ bg:'#EFF6FF',color:'#1D4ED8' }, admin:{ bg:'#F5F3FF',color:'#7C3AED' } };

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div>
          <div className="ap-title">Platform Overview</div>
          <div className="ap-sub">KhetSe marketplace at a glance</div>
        </div>
      </div>

      {/* Pending alert */}
      {(stats?.pendingProfileRequests??0) > 0 && (
        <Link to="/admin/approvals" className="ap-infobar">
          <div className="ap-infobar-l">
            <TrendingUp size={18} className="ap-infobar-icon" />
            <div>
              <div className="ap-infobar-title">{stats.pendingProfileRequests} farmer profile request{stats.pendingProfileRequests>1?'s':''} awaiting review</div>
              <div className="ap-infobar-desc">Farmers are waiting — review profile update requests</div>
            </div>
          </div>
          <span className="ap-infobar-cta">Review now →</span>
        </Link>
      )}

      {/* Stats row 1 */}
      <div className="ap-g4" style={{ marginBottom:'clamp(12px,2vw,16px)' }}>
        {STATS1.map((s,i) => (
          <Link key={i} to={s.link||'#'} className="ap-stat"
            onMouseOver={e=>e.currentTarget.style.borderColor=s.accent+'44'}
            onMouseOut={e=>e.currentTarget.style.borderColor='var(--b)'}>
            <div className="ap-stat-bar" style={{ background:s.accent }} />
            <div className="ap-stat-icon" style={{ background:s.iconBg }}>
              <s.Icon size={20} color={s.iconColor} strokeWidth={1.8} />
            </div>
            <div className="ap-stat-val ap-mono">{s.value}</div>
            <div className="ap-stat-lbl">{s.label}</div>
            {s.sub && <div className="ap-stat-sub">{s.sub}</div>}
          </Link>
        ))}
      </div>

      {/* Stats row 2 — compact */}
      <div className="ap-g4" style={{ marginBottom:'clamp(16px,2.5vw,22px)' }}>
        {STATS2.map((s,i) => (
          <Link key={i} to={s.link||'#'} style={{
            display:'block', textDecoration:'none', background:'var(--s)',
            border:'1px solid var(--b)', borderRadius:'12px', padding:'clamp(13px,2vw,16px) clamp(14px,2.2vw,18px)',
            borderTop:`3px solid ${s.accent}`, boxShadow:'var(--sh1)', transition:'all .16s'
          }}
            onMouseOver={e=>{ e.currentTarget.style.boxShadow='var(--sh2)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseOut={e=>{ e.currentTarget.style.boxShadow='var(--sh1)'; e.currentTarget.style.transform='none'; }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:s.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <s.Icon size={16} color={s.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <div className="ap-mono" style={{ fontSize:'20px', fontWeight:'800', color:s.accent, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'12px', color:'var(--t3)', marginTop:'3px', fontWeight:'500' }}>{s.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tables */}
      <div className="ap-g2">
        {/* Recent users */}
        <div className="ap-card">
          <div className="ap-card-hdr">
            <div>
              <div className="ap-card-title">Recent Users</div>
              <div className="ap-card-sub">{users.length} of {stats?.totalUsers??0} total</div>
            </div>
            <Link to="/admin/users" className="ap-card-link">View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ padding:'6px 0' }}>
            {users.map((u,i) => {
              const av = roleColor[u.role]||roleColor.buyer;
              return (
                <div key={u.userId} style={{ display:'flex', alignItems:'center', gap:'11px', padding:'10px 20px', borderBottom:i<users.length-1?'1px solid var(--s3)':'none' }}>
                  <div className="ap-avatar ap-av-md" style={{ background:av.bg, color:av.color }}>
                    {u.fullName?.charAt(0).toUpperCase()||'U'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'13.5px', fontWeight:'600', color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.fullName}</div>
                    <div style={{ fontSize:'12px', color:'var(--t4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                  </div>
                  <span className={`ap-badge ap-${u.role==='farmer'?'green':u.role==='admin'?'purple':'blue'}`} style={{ textTransform:'capitalize' }}>{u.role}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div className="ap-card">
          <div className="ap-card-hdr">
            <div>
              <div className="ap-card-title">Recent Orders</div>
              <div className="ap-card-sub">{orders.length} of {stats?.totalOrders??0} total</div>
            </div>
            <Link to="/admin/orders" className="ap-card-link">View all <ArrowRight size={13} /></Link>
          </div>
          <div style={{ padding:'6px 0' }}>
            {orders.length===0 ? (
              <div className="ap-empty" style={{ padding:'28px' }}><div className="ap-empty-sub">No orders yet</div></div>
            ) : orders.map((o,i) => (
              <div key={o.orderId} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', borderBottom:i<orders.length-1?'1px solid var(--s3)':'none' }}>
                <div>
                  <div style={{ fontSize:'13.5px', fontWeight:'600', color:'var(--t1)' }}>
                    Order <span className="ap-mono" style={{ color:'#16A34A' }}>#{o.orderId}</span>
                  </div>
                  <div style={{ fontSize:'12px', color:'var(--t4)', marginTop:'1px' }}>
                    {o.buyer?.fullName||'—'} · <span className="ap-mono">Rs. {o.totalAmount}</span>
                  </div>
                </div>
                <span className={`ap-badge ap-${STATUS_CLS[o.status]||'slate'}`} style={{ textTransform:'capitalize' }}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}