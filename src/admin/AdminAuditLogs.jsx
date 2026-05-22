import { useEffect, useState } from 'react';
import { Lock, ScrollText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

const ACTION_CLS=(action)=>{
  if(action?.includes('CREATE'))  return 'ap-green';
  if(action?.includes('DELETE'))  return 'ap-red';
  if(action?.includes('UPDATE')||action?.includes('APPROVE')) return 'ap-blue';
  if(action?.includes('REJECT'))  return 'ap-yellow';
  return 'ap-purple';
};

export default function AdminAuditLogs() {
  const { user }   = useAuth();
  const [logs,     setLogs]    =useState([]);
  const [loading,  setLoading] =useState(true);
  const [denied,   setDenied]  =useState(false);

  useEffect(()=>{ API.get('/rbac/audit-logs',{headers:{'X-Admin-Id':String(user?.userId)}}).then(r=>{if(r.data?.status==='error')setDenied(true);else setLogs(Array.isArray(r.data)?r.data:[]);}).catch(()=>setDenied(true)).finally(()=>setLoading(false)); },[user?.userId]); // eslint-disable-line

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Audit Logs</div><div className="ap-sub">Last 50 admin actions on the platform</div></div>
      </div>

      {denied ? (
        <div className="ap-card"><div className="ap-denied">
          <div className="ap-denied-icon"><Lock size={40}/></div>
          <div className="ap-denied-title">Access Denied</div>
          <div className="ap-denied-sub">Only Super Admin can view audit logs.</div>
        </div></div>
      ) : loading ? <div className="ap-loading">Loading audit logs…</div>
        : logs.length===0 ? (
          <div className="ap-card"><div className="ap-empty">
            <div className="ap-empty-icon"><ScrollText size={36}/></div>
            <div className="ap-empty-title">No logs yet</div>
            <div className="ap-empty-sub">Admin actions will appear here once performed.</div>
          </div></div>
        ) : (
          <div className="ap-tbl-wrap">
            <div className="ap-tbl-scroll">
              <table className="ap-tbl">
                <thead><tr>{['Time','Admin','Role','Action','Target','Details'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {logs.map(log=>(
                    <tr key={log.logId}>
                      <td className="ap-mono" style={{fontSize:'12px',color:'var(--t4)',whiteSpace:'nowrap'}}>
                        {log.performedAt?new Date(log.performedAt).toLocaleString('en-PK',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}
                      </td>
                      <td style={{fontWeight:'600',fontSize:'13px',color:'var(--t1)'}}>{log.adminEmail}</td>
                      <td><span className="ap-badge ap-green" style={{fontSize:'11px'}}>{log.adminRole}</span></td>
                      <td><span className={`ap-badge ${ACTION_CLS(log.action)} ap-mono`} style={{fontSize:'11px'}}>{log.action}</span></td>
                      <td className="ap-mono" style={{fontSize:'12.5px',color:'var(--t3)'}}>{log.targetType} {log.targetId?`#${log.targetId}`:''}</td>
                      <td style={{fontSize:'12px',color:'var(--t4)',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </AdminLayout>
  );
}