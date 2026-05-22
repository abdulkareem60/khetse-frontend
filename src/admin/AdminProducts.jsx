import { useEffect, useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Package } from 'lucide-react';
import API from '../api/axios';
import AdminLayout from './AdminLayout';

export default function AdminProducts() {
  const [products,setProducts]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [search,  setSearch]  =useState('');
  const [loading, setLoading] =useState(true);
  const [alert,   setAlert]   =useState(null);

  useEffect(()=>{ API.get('/admin/products').then(r=>setProducts(r.data)).finally(()=>setLoading(false)); },[]);
  useEffect(()=>{ setFiltered(products.filter(p=>[p.name,p.farmer?.fullName,p.category?.name].some(v=>v?.toLowerCase().includes(search.toLowerCase())))); },[products,search]);

  const flash=(type,text)=>{ setAlert({type,text}); setTimeout(()=>setAlert(null),3500); };
  const handleDelete=async(id)=>{ if(!window.confirm('Delete this product?')) return; try { await API.delete(`/admin/products/${id}`); setProducts(p=>p.filter(x=>x.productId!==id)); flash('ok','Product deleted.'); } catch { flash('err','Delete failed.'); } };
  const handleToggle=async(id)=>{ try { await API.put(`/admin/products/${id}/toggle`); setProducts(p=>p.map(x=>x.productId===id?{...x,isAvailable:!x.isAvailable}:x)); flash('ok','Availability updated.'); } catch { flash('err','Toggle failed.'); } };

  return (
    <AdminLayout>
      <div className="ap-hdr">
        <div><div className="ap-title">Product Management</div><div className="ap-sub">{filtered.length} product{filtered.length!==1?'s':''}</div></div>
      </div>
      {alert && <div className={`ap-alert ap-alert-${alert.type==='ok'?'ok':'err'}`}>{alert.text}</div>}
      <div style={{position:'relative',maxWidth:'420px',marginBottom:'18px'}}>
        <Search size={14} style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:'var(--t4)'}}/>
        <input className="ap-input" style={{paddingLeft:'34px'}} placeholder="Search by product, farmer, or category…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="ap-tbl-wrap">
        <div className="ap-tbl-scroll">
          <table className="ap-tbl">
            <thead><tr>{['Product','Category','Farmer','Price / kg','Stock','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="ap-loading">Loading products…</td></tr>
                : filtered.length===0 ? <tr><td colSpan={7}><div className="ap-empty"><div className="ap-empty-icon"><Package size={36}/></div><div className="ap-empty-title">No products found</div></div></td></tr>
                : filtered.map(p=>(
                  <tr key={p.productId}>
                    <td style={{fontWeight:'600',color:'var(--t1)'}}>{p.name}</td>
                    <td><span className="ap-badge ap-green">{p.category?.name||'—'}</span></td>
                    <td style={{color:'var(--t3)'}}>{p.farmer?.fullName||'—'}</td>
                    <td className="ap-mono" style={{fontWeight:'600',color:'#16A34A'}}>Rs. {p.pricePerKg}</td>
                    <td className="ap-mono" style={{color:'var(--t3)'}}>{p.stockKg} kg</td>
                    <td><span className={`ap-badge ap-${p.isAvailable?'green':'red'}`}>{p.isAvailable?'Active':'Hidden'}</span></td>
                    <td>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button className={`ap-btn ap-btn-sm ap-btn-${p.isAvailable?'warn':'ghost'}`} onClick={()=>handleToggle(p.productId)}>
                          {p.isAvailable?<><EyeOff size={12}/> Hide</>:<><Eye size={12}/> Show</>}
                        </button>
                        <button className="ap-btn ap-btn-sm ap-btn-danger" onClick={()=>handleDelete(p.productId)}>
                          <Trash2 size={12}/> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}