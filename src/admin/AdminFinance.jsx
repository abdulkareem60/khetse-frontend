import { useEffect, useState } from 'react';
import { Lock, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function AdminFinance() {
  const { user } = useAuth();
  const [data,   setData]   =useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ API.get('/rbac/finance',{headers:{'X-Admin-Id':String(user?.userId)}}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); },[user?.userId]); // eslint-disable-line

  if(loading) return <AdminLayout><div className="ap-loading">Loading finance data…</div></AdminLayout>;
  if(!data||data.status==='error') return (
    <AdminLayout><div className="ap-card"><div className="ap-denied">
      <div className="ap-denied-icon"><Lock size={40}/></div>
      <div className="ap-denied-title">Access Denied</div>
      <div className="ap-denied-sub">You don't have permission to view financial data.</div>
    </div></div></AdminLayout>
  );

  const payments=data.payments||[];
  const paid   =payments.filter(p=>p.status==='paid');
  const pending=payments.filter(p=>p.status==='pending');
  const failed =payments.filter(p=>p.status==='failed');
  const methods=['cod','easypaisa','jazzcash','bank'].map(m=>({
    method:m, count:payments.filter(p=>p.method===m).length,
    total:payments.filter(p=>p.method===m).reduce((s,p)=>s+parseFloat(p.amount||0),0),
  })).filter(m=>m.count>0);
  const SC={paid:'ap-green',pending:'ap-yellow',failed:'ap-red'};

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Finance Dashboard</div><div className="ap-sub">Revenue tracking and payment monitoring</div></div>
      </div>

      <div className="ap-g4" style={{marginBottom:'22px'}}>
        {[
          {label:'Total Revenue',      value:`Rs. ${data.totalRevenue?.toLocaleString()}`, accent:'#16A34A'},
          {label:'Pending Payouts',    value:`Rs. ${data.pendingPayouts?.toLocaleString()}`,accent:'#D97706'},
          {label:'Paid Transactions',  value:paid.length,                                   accent:'#2563EB'},
          {label:'Total Transactions', value:data.totalTransactions,                         accent:'#7C3AED'},
        ].map((c,i)=>(
          <div key={i} style={{background:'var(--s)',border:'1px solid var(--b)',borderRadius:'var(--r3)',padding:'clamp(16px,2.5vw,22px)',borderTop:`3px solid ${c.accent}`,boxShadow:'var(--sh1)'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'9px',background:c.accent+'14',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px'}}>
              <DollarSign size={18} color={c.accent} strokeWidth={1.8}/>
            </div>
            <div className="ap-mono" style={{fontSize:'clamp(20px,2.5vw,26px)',fontWeight:'800',color:c.accent,marginBottom:'4px'}}>{c.value}</div>
            <div style={{fontSize:'12.5px',color:'var(--t3)',fontWeight:'500'}}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="ap-g2" style={{marginBottom:'22px'}}>
        <div className="ap-card ap-card-body">
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)',marginBottom:'16px'}}>Payment Status</div>
          {[{label:'Paid',count:paid.length,cls:'ap-green'},{label:'Pending',count:pending.length,cls:'ap-yellow'},{label:'Failed',count:failed.length,cls:'ap-red'}].map((r,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:i<2?'1px solid var(--s3)':'none'}}>
              <span style={{fontSize:'13.5px',fontWeight:'600',color:'var(--t2)'}}>{r.label}</span>
              <span className={`ap-badge ${r.cls}`}>{r.count}</span>
            </div>
          ))}
        </div>
        <div className="ap-card ap-card-body">
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)',marginBottom:'16px'}}>Payment Methods</div>
          {methods.length===0 ? <div style={{color:'var(--t4)',fontSize:'13px'}}>No transactions yet.</div>
            : methods.map((m,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:i<methods.length-1?'1px solid var(--s3)':'none'}}>
                <span style={{fontSize:'13.5px',fontWeight:'600',color:'var(--t2)',textTransform:'capitalize'}}>{m.method}</span>
                <div style={{textAlign:'right'}}>
                  <div className="ap-mono" style={{fontSize:'13px',fontWeight:'700',color:'#16A34A'}}>Rs. {m.total.toLocaleString()}</div>
                  <div style={{fontSize:'11px',color:'var(--t4)'}}>{m.count} transactions</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="ap-tbl-wrap">
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--s3)'}}>
          <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)'}}>All Transactions</div>
        </div>
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['Payment ID','Order ID','Amount','Method','Status'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {payments.length===0?<tr><td colSpan={5} style={{padding:'40px',textAlign:'center',color:'var(--t4)'}}>No transactions found.</td></tr>
                :payments.map(p=>(
                  <tr key={p.paymentId}>
                    <td className="ap-mono" style={{fontWeight:'600',color:'#16A34A'}}>#{p.paymentId}</td>
                    <td className="ap-mono" style={{color:'var(--t3)'}}>#{p.order?.orderId||'—'}</td>
                    <td className="ap-mono" style={{fontWeight:'600'}}>Rs. {p.amount}</td>
                    <td style={{color:'var(--t3)',textTransform:'capitalize'}}>{p.method||'COD'}</td>
                    <td><span className={`ap-badge ${SC[p.status]||'ap-slate'}`} style={{textTransform:'capitalize'}}>{p.status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}