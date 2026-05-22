import { useEffect, useState } from 'react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function AdminAnalytics() {
  const [stats,   setStats]   =useState(null);
  const [products,setProducts]=useState([]);
  const [users,   setUsers]   =useState([]);
  const [orders,  setOrders]  =useState([]);
  const [loading, setLoading] =useState(true);

  useEffect(()=>{ Promise.all([API.get('/admin/dashboard'),API.get('/admin/analytics/top-products'),API.get('/admin/users'),API.get('/admin/orders')]).then(([s,p,u,o])=>{setStats(s.data);setProducts(p.data);setUsers(u.data);setOrders(o.data);}).finally(()=>setLoading(false)); },[]);

  if(loading) return <AdminLayout><div className="ap-loading">Loading analytics…</div></AdminLayout>;

  const farmers=users.filter(u=>u.role==='farmer');
  const buyers =users.filter(u=>u.role==='buyer');
  const revenue=orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+parseFloat(o.totalAmount||0),0);
  const breakdown=['pending','confirmed','delivered','cancelled'].map(s=>({
    status:s, count:orders.filter(o=>o.status===s).length,
    pct:orders.length?Math.round(orders.filter(o=>o.status===s).length/orders.length*100):0,
  }));
  const SA={pending:'#D97706',confirmed:'#2563EB',delivered:'#16A34A',cancelled:'#DC2626'};

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Platform Analytics</div><div className="ap-sub">KhetSe performance overview</div></div>
      </div>

      {/* Hero strip */}
      <div className="ap-hero-strip">
        <div className="ap-g4" style={{position:'relative',zIndex:1,gap:'24px'}}>
          {[
            {label:'Total Revenue',   value:`Rs. ${revenue.toLocaleString()}`, sub:'From delivered orders'},
            {label:'Total Orders',    value:stats?.totalOrders??0,              sub:'All time'},
            {label:'Active Products', value:stats?.activeProducts??0,           sub:'Currently listed'},
            {label:'Platform Users',  value:stats?.totalUsers??0,               sub:'Farmers + Buyers'},
          ].map((item,i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div className="ap-mono" style={{fontSize:'clamp(18px,2.5vw,28px)',fontWeight:'800',color:'#F0FDF4',letterSpacing:'-0.5px',marginBottom:'5px'}}>{item.value}</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.65)',fontWeight:'600'}}>{item.label}</div>
              <div style={{fontSize:'11.5px',color:'rgba(255,255,255,0.32)',marginTop:'2px'}}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ap-g2" style={{marginBottom:'22px'}}>
        {/* User distribution */}
        <div className="ap-card ap-card-body">
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)',marginBottom:'18px'}}>User Distribution</div>
          {[
            {label:'Farmers',count:farmers.length,color:'#16A34A',pct:users.length?Math.round(farmers.length/users.length*100):0},
            {label:'Buyers', count:buyers.length, color:'#2563EB',pct:users.length?Math.round(buyers.length/users.length*100):0},
          ].map((row,i)=>(
            <div key={i} style={{marginBottom:i===0?'18px':'0'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                <span style={{fontSize:'13.5px',fontWeight:'600',color:'var(--t2)'}}>{row.label}</span>
                <span className="ap-mono" style={{fontSize:'13px',fontWeight:'700',color:row.color}}>{row.count} · {row.pct}%</span>
              </div>
              <div className="ap-prog-bg"><div className="ap-prog-fill" style={{width:`${row.pct}%`,background:row.color}}/></div>
            </div>
          ))}
          <div className="ap-hr"/>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:'13px',color:'var(--t3)'}}>Total Platform Users</span>
            <span className="ap-mono" style={{fontWeight:'700',color:'var(--t1)'}}>{users.length}</span>
          </div>
        </div>

        {/* Order breakdown */}
        <div className="ap-card ap-card-body">
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)',marginBottom:'18px'}}>Order Status Breakdown</div>
          {breakdown.map((row,i)=>(
            <div key={i} style={{marginBottom:i<breakdown.length-1?'14px':'0'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                <span style={{fontSize:'13.5px',fontWeight:'600',color:'var(--t2)',textTransform:'capitalize'}}>{row.status}</span>
                <span className="ap-mono" style={{fontSize:'13px',fontWeight:'700',color:SA[row.status]}}>{row.count} · {row.pct}%</span>
              </div>
              <div className="ap-prog-bg"><div className="ap-prog-fill" style={{width:`${row.pct}%`,background:SA[row.status]}}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="ap-tbl-wrap">
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--s3)'}}>
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)'}}>Recent Product Listings</div>
        </div>
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['Product','Category','Farmer','Price / kg','Stock','Status'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.productId}>
                  <td style={{fontWeight:'600',color:'var(--t1)'}}>{p.name}</td>
                  <td><span className="ap-badge ap-green">{p.category?.name||'—'}</span></td>
                  <td style={{color:'var(--t3)'}}>{p.farmer?.fullName||'—'}</td>
                  <td className="ap-mono" style={{fontWeight:'600',color:'#16A34A'}}>Rs. {p.pricePerKg}</td>
                  <td className="ap-mono" style={{color:'var(--t3)'}}>{p.stockKg} kg</td>
                  <td><span className={`ap-badge ap-${p.isAvailable?'green':'red'}`}>{p.isAvailable?'Active':'Hidden'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}