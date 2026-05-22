import { useEffect, useState } from 'react';
import { Lock, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

const ROLE_OPTIONS=['SUPER_ADMIN','PRODUCT_MODERATOR','SUPPORT_ADMIN','FINANCE_ADMIN'];
const ROLE_META={
  SUPER_ADMIN:       {label:'Super Admin',       cls:'ap-yellow',perms:['Full platform access','All permissions']},
  PRODUCT_MODERATOR: {label:'Product Moderator', cls:'ap-green', perms:['View & manage products','Feature products','Manage categories']},
  SUPPORT_ADMIN:     {label:'Support Admin',     cls:'ap-blue',  perms:['View users & orders','Manage orders','Approve profiles']},
  FINANCE_ADMIN:     {label:'Finance Admin',     cls:'ap-purple',perms:['View finance','Manage payouts','Financial analytics']},
};

export default function AdminRoles() {
  const { user }         = useAuth();
  const { isSuperAdmin } = useAdminPermissions();
  const [admins,     setAdmins]     =useState([]);
  const [loading,    setLoading]    =useState(true);
  const [alert,      setAlert]      =useState(null);
  const [showCreate, setShowCreate] =useState(false);
  const [form, setForm]=useState({fullName:'',email:'',password:'',phone:'',city:'',adminRole:'SUPPORT_ADMIN'});

  useEffect(()=>{ fetchAdmins(); },[]);
  const fetchAdmins=async()=>{ try{const r=await API.get('/rbac/admins');setAdmins(r.data);}catch{}finally{setLoading(false);} };
  const flash=(type,text)=>{ setAlert({type,text}); setTimeout(()=>setAlert(null),4000); };

  const handleCreate=async e=>{ e.preventDefault(); try{const r=await API.post('/rbac/admins/create',form,{headers:{'X-Admin-Id':String(user?.userId)}}); if(r.data.status==='success'){flash('ok',r.data.message);setShowCreate(false);setForm({fullName:'',email:'',password:'',phone:'',city:'',adminRole:'SUPPORT_ADMIN'});fetchAdmins();}else flash('err',r.data.message);}catch{flash('err','Failed to create admin.');} };
  const handleRoleChange=async(profileId,newRole)=>{ try{const r=await API.put(`/rbac/admins/${profileId}/role`,{adminRole:newRole},{headers:{'X-Admin-Id':String(user?.userId)}});if(r.data.status==='success'){flash('ok','Role updated.');fetchAdmins();}else flash('err',r.data.message);}catch{flash('err','Failed.');} };
  const handleToggle=async(profileId)=>{ try{await API.put(`/rbac/admins/${profileId}/toggle`,{},{headers:{'X-Admin-Id':String(user?.userId)}});flash('ok','Status updated.');fetchAdmins();}catch{flash('err','Toggle failed.');} };

  if(!isSuperAdmin&&!loading) return (
    <AdminLayout><div className="ap-card"><div className="ap-denied">
      <div className="ap-denied-icon"><Lock size={40}/></div>
      <div className="ap-denied-title">Access Denied</div>
      <div className="ap-denied-sub">Only Super Admin can manage admin roles.</div>
    </div></div></AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Admin Role Management</div><div className="ap-sub">{admins.length} admin account{admins.length!==1?'s':''}</div></div>
        <button className="ap-btn ap-btn-primary" onClick={()=>setShowCreate(!showCreate)}><Plus size={15}/> Create Admin</button>
      </div>
      {alert && <div className={`ap-alert ap-alert-${alert.type==='ok'?'ok':'err'}`}>{alert.text}</div>}

      {/* Role reference */}
      <div className="ap-g4" style={{marginBottom:'22px'}}>
        {ROLE_OPTIONS.map(role=>{const m=ROLE_META[role]; return (
          <div key={role} className="ap-card ap-card-body">
            <span className={`ap-badge ${m.cls}`} style={{marginBottom:'10px',display:'inline-block'}}>{m.label}</span>
            <ul style={{margin:0,padding:'0 0 0 14px'}}>
              {m.perms.map((p,i)=><li key={i} style={{fontSize:'12px',color:'var(--t3)',marginBottom:'3px'}}>{p}</li>)}
            </ul>
          </div>
        );})}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="ap-card ap-card-body" style={{marginBottom:'22px',borderLeft:'3px solid var(--g600)'}}>
          <div style={{fontWeight:'700',fontSize:'15px',color:'var(--t1)',marginBottom:'18px'}}>Create New Admin Account</div>
          <form onSubmit={handleCreate}>
            <div className="ap-form-row" style={{marginBottom:'14px'}}>
              {[
                {label:'Full Name',name:'fullName',placeholder:'Ahmed Khan',req:true},
                {label:'Email',name:'email',placeholder:'ahmed@khetse.pk',type:'email',req:true},
                {label:'Password',name:'password',placeholder:'••••••••',type:'password',req:true},
                {label:'Phone',name:'phone',placeholder:'03001234567'},
                {label:'City',name:'city',placeholder:'Karachi'},
              ].map(f=>(
                <div key={f.name}>
                  <label className="ap-label">{f.label}</label>
                  <input type={f.type||'text'} placeholder={f.placeholder} value={form[f.name]} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={!!f.req} className="ap-input"/>
                </div>
              ))}
              <div>
                <label className="ap-label">Admin Role</label>
                <select className="ap-select" value={form.adminRole} onChange={e=>setForm({...form,adminRole:e.target.value})}>
                  {ROLE_OPTIONS.filter(r=>r!=='SUPER_ADMIN').map(r=><option key={r} value={r}>{ROLE_META[r].label}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <button type="submit" className="ap-btn ap-btn-primary">Create Admin Account</button>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={()=>setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Admins table */}
      <div className="ap-tbl-wrap">
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['Admin','Email','City','Role','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading?<tr><td colSpan={6} className="ap-loading">Loading…</td></tr>
                :admins.map(a=>{const m=ROLE_META[a.adminRole]||ROLE_META.SUPPORT_ADMIN;const isSelf=a.userId===user?.userId; return (
                  <tr key={a.profileId}>
                    <td>
                      <div className="ap-user-cell">
                        <div className="ap-avatar ap-av-md" style={{background:'var(--g50)',color:'#15803D'}}>{a.fullName?.charAt(0).toUpperCase()||'A'}</div>
                        <div style={{fontWeight:'600',color:'var(--t1)',fontSize:'13.5px'}}>
                          {a.fullName} {isSelf&&<span style={{fontSize:'11px',color:'#16A34A'}}>(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{color:'var(--t3)',fontSize:'13px'}}>{a.email}</td>
                    <td style={{color:'var(--t3)'}}>{a.city||'—'}</td>
                    <td>
                      {isSelf||a.adminRole==='SUPER_ADMIN' ? <span className={`ap-badge ${m.cls}`}>{m.label}</span>
                        : <select className="ap-select" style={{fontSize:'12.5px',padding:'5px 10px',width:'auto'}} value={a.adminRole} onChange={e=>handleRoleChange(a.profileId,e.target.value)}>
                            {ROLE_OPTIONS.filter(r=>r!=='SUPER_ADMIN').map(r=><option key={r} value={r}>{ROLE_META[r].label}</option>)}
                          </select>}
                    </td>
                    <td><span className={`ap-badge ap-${a.isActive?'green':'red'}`}>{a.isActive?'Active':'Inactive'}</span></td>
                    <td>
                      {!isSelf&&a.adminRole!=='SUPER_ADMIN' ? (
                        <button className={`ap-btn ap-btn-sm ap-btn-${a.isActive?'warn':'ghost'}`} onClick={()=>handleToggle(a.profileId)}>
                          {a.isActive?<><ToggleLeft size={13}/> Deactivate</>:<><ToggleRight size={13}/> Activate</>}
                        </button>
                      ) : <span style={{fontSize:'12px',color:'var(--t4)'}}>—</span>}
                    </td>
                  </tr>
                );})}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}