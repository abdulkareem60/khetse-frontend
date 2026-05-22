import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useT, useTranslatedProducts } from '../hooks/useTranslation';
import LanguageToggle from '../components/LanguageToggle';
import ProductImages from '../components/ProductImages';

/* ── All UI strings defined right here — no external file needed ── */
const S = {
  title:             'Fresh Produce',
  sub:               'Direct from farms across Pakistan',
  searchPlaceholder: 'Search products…',
  allCategories:     'All Categories',
  orderNow:          'Order Now',
  available:         'available',
  noProducts:        'No products found',
  noProductsSub:     'Try a different search or category',
  loading:           'Loading products…',
  translating:       'Translating to Urdu…',
};

const CSS = `
  .pp-shell{padding:clamp(16px,3vw,28px);max-width:1200px;margin:0 auto;}
  .pp-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:clamp(16px,2.5vw,22px);}
  .pp-title{font-size:clamp(20px,3vw,26px);font-weight:800;color:#0F172A;letter-spacing:-0.4px;}
  .pp-sub{font-size:13px;color:#64748B;margin-top:3px;}
  .pp-filters{display:flex;gap:10px;margin-bottom:clamp(16px,2.5vw,20px);flex-wrap:wrap;}
  .pp-search{flex:1;min-width:180px;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;background:#fff;color:#0F172A;}
  .pp-search:focus{border-color:#22C55E;box-shadow:0 0 0 3px rgba(34,197,94,.10);}
  .pp-select{padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;outline:none;font-family:inherit;background:#fff;cursor:pointer;color:#0F172A;min-width:140px;}
  .pp-banner{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:10px 16px;margin-bottom:16px;font-size:13px;color:#15803D;font-weight:500;display:flex;align-items:center;gap:8px;}
  .pp-spin{animation:pp-r .8s linear infinite;}
  @keyframes pp-r{to{transform:rotate(360deg);}}
  .pp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr));gap:clamp(14px,2.5vw,20px);}
  .pp-card{background:#fff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:transform .18s,box-shadow .18s;display:flex;flex-direction:column;}
  .pp-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.09);}
  .pp-card-img{width:100%;aspect-ratio:4/3;overflow:hidden;background:#F1F5F9;}
  .pp-card-body{padding:clamp(12px,2vw,18px);flex:1;display:flex;flex-direction:column;gap:6px;}
  .pp-cat{display:inline-block;background:#F0FDF4;color:#15803D;border-radius:100px;padding:3px 10px;font-size:11.5px;font-weight:600;}
  .pp-name{font-size:clamp(15px,2vw,17px);font-weight:700;color:#0F172A;line-height:1.3;}
  .pp-name-ur{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;font-size:clamp(14px,2vw,16px);line-height:1.9;}
  .pp-desc{font-size:12.5px;color:#64748B;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .pp-desc-ur{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;font-size:12px;line-height:2.0;}
  .pp-price{font-size:clamp(18px,2.5vw,22px);font-weight:800;color:#16A34A;font-family:'JetBrains Mono',monospace;}
  .pp-price span{font-size:13px;color:#94A3B8;font-weight:400;font-family:inherit;}
  .pp-stock{font-size:12px;color:#94A3B8;}
  .pp-farmer{font-size:12.5px;color:#64748B;}
  .pp-btn{margin-top:auto;width:100%;padding:11px;background:#16A34A;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;}
  .pp-btn:hover{background:#15803D;}
  .pp-btn-ur{font-family:'Noto Nastaliq Urdu',serif;}
  .pp-skel{background:linear-gradient(90deg,#F1F5F9 25%,#E8EDF2 50%,#F1F5F9 75%);background-size:200% 100%;animation:pp-sh 1.4s infinite;border-radius:6px;height:18px;}
  @keyframes pp-sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .pp-empty{grid-column:1/-1;text-align:center;padding:60px 24px;}
  .pp-loading{text-align:center;padding:80px 24px;color:#94A3B8;}
  @media(max-width:640px){.pp-filters{flex-direction:column;}.pp-search,.pp-select{width:100%;}.pp-top{flex-direction:column;}}
`;

export default function Products() {
  const { user }   = useAuth();
  const { isUrdu } = useLang();
  const { t }      = useT(S);          // S is always defined — no crash possible
  const navigate   = useNavigate();

  const [rawProducts, setRawProducts] = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);

  const { items: products, translating } = useTranslatedProducts(rawProducts);

  useEffect(() => {
    Promise.all([API.get('/products/all'), API.get('/categories/all')])
      .then(([p, c]) => { setRawProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat    = selectedCat ? p.category?.categoryId === parseInt(selectedCat) : true;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOrder = (productId) => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'farmer') { alert('Farmers cannot place orders.'); return; }
    navigate(`/place-order/${productId}`);
  };

  const urStyle = isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' } : {};

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-shell">

        {/* Header + language toggle */}
        <div className="pp-top">
          <div>
            <div className="pp-title" style={urStyle}>{t.title}</div>
            <div className="pp-sub"   style={urStyle}>{t.sub}</div>
          </div>
          <LanguageToggle light translating={translating} />
        </div>

        {/* Translating indicator */}
        {translating && (
          <div className="pp-banner">
            <svg className="pp-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#16A34A" strokeWidth="1.8"
                strokeDasharray="12 6" strokeLinecap="round"/>
            </svg>
            {t.translating}
          </div>
        )}

        {/* Filters */}
        <div className="pp-filters">
          <input
            className="pp-search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={isUrdu ? { direction: 'rtl', fontFamily: "'Noto Nastaliq Urdu',serif" } : {}}
          />
          <select className="pp-select" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="">{t.allCategories}</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="pp-loading">{t.loading}</div>
        ) : (
          <div className="pp-grid">
            {filtered.length === 0 ? (
              <div className="pp-empty">
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌾</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#334155', ...urStyle }}>
                  {t.noProducts}
                </div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', ...urStyle }}>
                  {t.noProductsSub}
                </div>
              </div>
            ) : filtered.map(p => (
              <div key={p.productId} className="pp-card">
                <div className="pp-card-img">
                  <ProductImages productId={p.productId} />
                </div>
                <div className="pp-card-body">
                  <span className="pp-cat">{p.category?.name}</span>

                  {translating
                    ? <div className="pp-skel" style={{ width: '70%' }} />
                    : <div className={isUrdu ? 'pp-name pp-name-ur' : 'pp-name'}>{p.name}</div>
                  }

                  {p.description && (
                    translating
                      ? <div className="pp-skel" style={{ width: '90%', height: '14px' }} />
                      : <div className={isUrdu ? 'pp-desc pp-desc-ur' : 'pp-desc'}>{p.description}</div>
                  )}

                  <div className="pp-price">Rs. {p.pricePerKg}<span> / {p.unit || 'kg'}</span></div>
                  <div className="pp-stock" style={urStyle}>{p.stockKg} kg {t.available}</div>
                  <div className="pp-farmer">🌾 {p.farmer?.fullName} — {p.farmer?.city}</div>

                  <button
                    className={isUrdu ? 'pp-btn pp-btn-ur' : 'pp-btn'}
                    onClick={() => handleOrder(p.productId)}
                  >
                    {t.orderNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}