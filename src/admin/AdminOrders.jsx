import { useEffect, useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

const SC={ pending:'ap-yellow', confirmed:'ap-blue', delivered:'ap-green', cancelled:'ap-red' };

export default function AdminOrders() {
  const [orders,  setOrders]  =useState([]);
  const [filtered,setFiltered]=useState([]);
  const [search,  setSearch]  =useState('');
  const [status,  setStatus]  =useState('all');
  const [loading, setLoading] =useState(true);

  useEffect(()=>{ API.get('/admin/orders').then(r=>setOrders(r.data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ let r=orders; if(status!=='all') r=r.filter(o=>o.status===status); if(search) r=r.filter(o=>String(o.orderId).includes(search)||o.buyer?.fullName?.toLowerCase().includes(search.toLowerCase())); setFiltered(r); },[orders,search,status]);

  const revenue=orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+parseFloat(o.totalAmount||0),0);

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Order Management</div><div className="ap-sub">{filtered.length} order{filtered.length!==1?'s':''}</div></div>
      </div>
      <div className="ap-g4" style={{marginBottom:'22px'}}>
        {[
          {label:'Total Orders',  value:orders.length,                                      accent:'#2563EB'},
          {label:'Pending',       value:orders.filter(o=>o.status==='pending').length,       accent:'#D97706'},
          {label:'Delivered',     value:orders.filter(o=>o.status==='delivered').length,     accent:'#16A34A'},
          {label:'Revenue (Delivered)', value:`Rs. ${revenue.toLocaleString()}`,             accent:'#7C3AED'},
        ].map((c,i)=>(
          <div key={i} style={{background:'var(--s)',border:'1px solid var(--b)',borderRadius:'12px',padding:'clamp(14px,2vw,18px)',borderTop:`3px solid ${c.accent}`,boxShadow:'var(--sh1)'}}>
            <div className="ap-mono" style={{fontSize:'22px',fontWeight:'800',color:c.accent,marginBottom:'4px'}}>{c.value}</div>
            <div style={{fontSize:'12.5px',color:'var(--t3)',fontWeight:'500'}}>{c.label}</div>
          </div>
        ))}
      </div>
      <div className="ap-filters">
        <div style={{flex:'1',minWidth:'200px',position:'relative'}}>
          <Search size={14} style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:'var(--t4)'}}/>
          <input className="ap-input" style={{paddingLeft:'34px'}} placeholder="Search order ID or buyer…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['all','pending','confirmed','delivered','cancelled'].map(s=>(
          <button key={s} className={`ap-filter-tab${status===s?' act':''}`} onClick={()=>setStatus(s)} style={{textTransform:'capitalize'}}>{s==='all'?'All':s}</button>
        ))}
      </div>
      <div className="ap-tbl-wrap">
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['Order','Buyer','Amount','Method','Status','Date'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading?<tr><td colSpan={6} className="ap-loading">Loading orders…</td></tr>
                :filtered.length===0?<tr><td colSpan={6}><div className="ap-empty"><div className="ap-empty-icon"><ShoppingCart size={36}/></div><div className="ap-empty-title">No orders found</div></div></td></tr>
                :filtered.map(o=>(
                  <tr key={o.orderId}>
                    <td className="ap-mono" style={{fontWeight:'700',color:'#16A34A'}}>#{o.orderId}</td>
                    <td><div style={{fontWeight:'600',color:'var(--t1)',fontSize:'13.5px'}}>{o.buyer?.fullName||'—'}</div><div style={{fontSize:'12px',color:'var(--t4)'}}>{o.buyer?.city||''}</div></td>
                    <td className="ap-mono" style={{fontWeight:'600'}}>Rs. {o.totalAmount}</td>
                    <td style={{color:'var(--t3)',textTransform:'capitalize'}}>{o.payment?.method||'COD'}</td>
                    <td><span className={`ap-badge ap-${SC[o.status]||'slate'}`} style={{textTransform:'capitalize'}}>{o.status}</span></td>
                    <td style={{color:'var(--t4)',fontSize:'12.5px'}}>{o.createdAt?new Date(o.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}):'—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}