import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function AdminApprovals() {
  const [requests,setRequests]=useState([]);
  const [loading, setLoading] =useState(true);
  const [notes,   setNotes]   =useState({});
  const [alert,   setAlert]   =useState(null);

  useEffect(()=>{ API.get('/admin/profile-requests/pending').then(r=>setRequests(r.data)).finally(()=>setLoading(false)); },[]);
  const flash=(type,text)=>{ setAlert({type,text}); setTimeout(()=>setAlert(null),3500); };

  const handleApprove=async(id)=>{
    try { await API.put(`/admin/profile-requests/${id}/approve`,{adminNote:notes[id]||''}); setRequests(r=>r.filter(x=>x.requestId!==id)); flash('ok','Request approved — profile updated.'); }
    catch { flash('err','Approval failed.'); }
  };
  const handleReject=async(id)=>{
    if(!notes[id]?.trim()){ flash('warn','Please add a rejection reason before rejecting.'); return; }
    try { await API.put(`/admin/profile-requests/${id}/reject`,{adminNote:notes[id]}); setRequests(r=>r.filter(x=>x.requestId!==id)); flash('ok','Request rejected.'); }
    catch { flash('err','Rejection failed.'); }
  };

  const getFields=(req)=>[
    {label:'Name',        value:req.requestedName},
    {label:'Phone',       value:req.requestedPhone},
    {label:'City',        value:req.requestedCity},
    {label:'Farm Name',   value:req.requestedFarmName},
    {label:'Farm Size',   value:req.requestedFarmSize},
    {label:'Farm Address',value:req.requestedFarmAddress},
    {label:'Crops',       value:req.requestedCropsGrown},
  ].filter(f=>f.value);

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Profile Approvals</div><div className="ap-sub">{requests.length} pending request{requests.length!==1?'s':''}</div></div>
      </div>
      {alert && <div className={`ap-alert ap-alert-${alert.type==='ok'?'ok':alert.type==='warn'?'warn':'err'}`}>{alert.text}</div>}

      {loading ? <div className="ap-loading">Loading requests…</div>
        : requests.length===0 ? (
          <div className="ap-card"><div className="ap-empty">
            <div className="ap-empty-icon"><ClipboardCheck size={40}/></div>
            <div className="ap-empty-title">All caught up!</div>
            <div className="ap-empty-sub">No pending profile update requests.</div>
          </div></div>
        ) : requests.map(req=>(
          <div key={req.requestId} className="ap-card" style={{marginBottom:'16px',borderLeft:'3px solid #F59E0B'}}>
            {/* Header */}
            <div className="ap-card-hdr">
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div className="ap-avatar ap-av-md" style={{background:'#F0FDF4',color:'#15803D'}}>{req.requestedName?.charAt(0)||'F'}</div>
                <div>
                  <div style={{fontWeight:'700',fontSize:'14px',color:'var(--t1)'}}>Request #{req.requestId}</div>
                  <div style={{fontSize:'12px',color:'var(--t4)',marginTop:'2px'}}>Farmer ID: {req.farmerId} · {req.submittedAt?new Date(req.submittedAt).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'}):'—'}</div>
                </div>
              </div>
              <span className="ap-badge ap-yellow">⏳ Pending Review</span>
            </div>

            <div className="ap-card-body">
              {/* Changes grid */}
              <div style={{background:'var(--s2)',borderRadius:'10px',padding:'16px',marginBottom:'16px'}}>
                <div className="ap-sec-label">Requested Changes</div>
                <div className="ap-auto" style={{gap:'10px'}}>
                  {getFields(req).map((f,i)=>(
                    <div key={i} style={{background:'var(--s)',borderRadius:'8px',padding:'10px 12px',border:'1px solid var(--b)'}}>
                      <div style={{fontSize:'10px',color:'var(--t4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'3px'}}>{f.label}</div>
                      <div style={{fontSize:'13.5px',fontWeight:'600',color:'var(--t1)'}}>{f.value}</div>
                    </div>
                  ))}
                </div>
                {req.requestedBio && (
                  <div style={{marginTop:'10px',background:'var(--s)',borderRadius:'8px',padding:'10px 12px',border:'1px solid var(--b)'}}>
                    <div style={{fontSize:'10px',color:'var(--t4)',textTransform:'uppercase',marginBottom:'3px'}}>Bio</div>
                    <div style={{fontSize:'13.5px',color:'var(--t2)',lineHeight:'1.6'}}>{req.requestedBio}</div>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="ap-field">
                <label className="ap-label">Admin Note <span style={{color:'#DC2626',fontWeight:'400'}}>(required for rejection)</span></label>
                <textarea className="ap-textarea" rows={2}
                  placeholder="Leave a note for the farmer…"
                  value={notes[req.requestId]||''} onChange={e=>setNotes(p=>({...p,[req.requestId]:e.target.value}))}/>
              </div>

              {/* Actions */}
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <button className="ap-btn ap-btn-primary ap-btn-full" onClick={()=>handleApprove(req.requestId)}>
                  <CheckCircle size={15}/> Approve & Apply Changes
                </button>
                <button className="ap-btn ap-btn-danger ap-btn-full" onClick={()=>handleReject(req.requestId)}>
                  <XCircle size={15}/> Reject Request
                </button>
              </div>
            </div>
          </div>
        ))}
    </AdminLayout>
  );
}