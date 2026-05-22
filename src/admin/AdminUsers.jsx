import { useEffect, useState } from 'react';
import { Search, UserX, UserCheck, Trash2, Users } from 'lucide-react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

const AV_COLOR = { farmer:{bg:'#F0FDF4',color:'#15803D'}, buyer:{bg:'#EFF6FF',color:'#1D4ED8'}, admin:{bg:'#F5F3FF',color:'#7C3AED'} };

export default function AdminUsers() {
  const [users,    setUsers]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState('');
  const [role,     setRole]     = useState('all');
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState(null);

  useEffect(() => { API.get('/admin/users').then(r=>setUsers(r.data)).finally(()=>setLoading(false)); },[]);
  useEffect(() => {
    let r = users;
    if (role!=='all') r=r.filter(u=>u.role===role);
    if (search) r=r.filter(u=>[u.fullName,u.email,u.city].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
    setFiltered(r);
  }, [users,search,role]);

  const flash=(type,text)=>{ setAlert({type,text}); setTimeout(()=>setAlert(null),3500); };

  const handleStatus=async(id,status)=>{
    try { await API.put(`/admin/users/${id}/status`,{status}); setUsers(p=>p.map(u=>u.userId===id?{...u,status}:u)); flash('ok',`User ${status==='suspended'?'suspended':'activated'}.`); }
    catch { flash('err','Action failed.'); }
  };
  const handleDelete=async(id)=>{
    if(!window.confirm('Permanently delete this user?')) return;
    try { await API.delete(`/admin/users/${id}`); setUsers(p=>p.filter(u=>u.userId!==id)); flash('ok','User deleted.'); }
    catch { flash('err','Delete failed.'); }
  };

  const counts={all:users.length,farmer:users.filter(u=>u.role==='farmer').length,buyer:users.filter(u=>u.role==='buyer').length,admin:users.filter(u=>u.role==='admin').length};

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">User Management</div><div className="ap-sub">{filtered.length} user{filtered.length!==1?'s':''} shown</div></div>
      </div>
      {alert && <div className={`ap-alert ap-alert-${alert.type==='ok'?'ok':'err'}`}>{alert.type==='ok'?<UserCheck size={15}/>:<UserX size={15}/>} {alert.text}</div>}

      <div className="ap-filters">
        <div style={{ flex:'1', minWidth:'200px', position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'var(--t4)' }} />
          <input className="ap-input" style={{ paddingLeft:'34px' }}
            placeholder="Search name, email or city…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        {[{k:'all',l:`All (${counts.all})`},{k:'farmer',l:`Farmers (${counts.farmer})`},{k:'buyer',l:`Buyers (${counts.buyer})`},{k:'admin',l:`Admins (${counts.admin})`}].map(f=>(
          <button key={f.k} className={`ap-filter-tab${role===f.k?' act':''}`} onClick={()=>setRole(f.k)}>{f.l}</button>
        ))}
      </div>

      <div className="ap-tbl-wrap">
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['User','Email','Phone','City','Role','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="ap-loading">Loading users…</td></tr>
                : filtered.length===0 ? <tr><td colSpan={7}><div className="ap-empty"><div className="ap-empty-icon"><Users size={36}/></div><div className="ap-empty-title">No users found</div><div className="ap-empty-sub">Try adjusting your search or filter</div></div></td></tr>
                : filtered.map(u=>{
                  const av=AV_COLOR[u.role]||AV_COLOR.buyer;
                  return (
                    <tr key={u.userId}>
                      <td><div className="ap-user-cell"><div className="ap-avatar ap-av-md" style={{background:av.bg,color:av.color}}>{u.fullName?.charAt(0).toUpperCase()||'U'}</div><span style={{fontWeight:'600',color:'var(--t1)'}}>{u.fullName}</span></div></td>
                      <td style={{color:'var(--t3)',fontSize:'13px'}}>{u.email}</td>
                      <td className="ap-mono" style={{color:'var(--t3)',fontSize:'12.5px'}}>{u.phone||'—'}</td>
                      <td style={{color:'var(--t3)'}}>{u.city||'—'}</td>
                      <td><span className={`ap-badge ap-${u.role==='farmer'?'green':u.role==='admin'?'purple':'blue'}`} style={{textTransform:'capitalize'}}>{u.role}</span></td>
                      <td><span className={`ap-badge ap-${u.status==='suspended'?'red':'green'}`}>{u.status==='suspended'?'Suspended':'Active'}</span></td>
                      <td>
                        {u.role!=='admin' ? (
                          <div style={{display:'flex',gap:'6px'}}>
                            <button className={`ap-btn ap-btn-sm ap-btn-${u.status==='suspended'?'ghost':'warn'}`} onClick={()=>handleStatus(u.userId,u.status==='suspended'?'active':'suspended')}>
                              {u.status==='suspended'?<><UserCheck size={12}/> Activate</>:<><UserX size={12}/> Suspend</>}
                            </button>
                            <button className="ap-btn ap-btn-sm ap-btn-danger" onClick={()=>handleDelete(u.userId)}>
                              <Trash2 size={12}/> Delete
                            </button>
                          </div>
                        ) : <span style={{fontSize:'12px',color:'var(--t4)'}}>Protected</span>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}