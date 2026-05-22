/**
 * Products.jsx — Buyer product browsing page with EN ↔ اردو translation.
 * Modified from the original to integrate LibreTranslate.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useTranslatedProducts } from '../hooks/useTranslation';
import LanguageToggle from '../components/LanguageToggle';
import ProductImages from '../components/ProductImages';

const css = `
  .prod-page { padding: clamp(16px, 3vw, 28px); max-width: 1200px; margin: 0 auto; }
  .prod-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: clamp(16px, 2.5vw, 24px); }
  .prod-title { font-size: clamp(20px, 3vw, 26px); font-weight: 800; color: #0F172A; letter-spacing: -0.4px; }
  .prod-sub   { font-size: 13px; color: #64748B; margin-top: 3px; }
  .prod-toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .prod-filter-row { display: flex; gap: 10px; margin-bottom: clamp(16px, 2.5vw, 22px); flex-wrap: wrap; }
  .prod-search { flex: 1; min-width: 180px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.15s; background: #fff; color: #0F172A; }
  .prod-search:focus { border-color: #22C55E; box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
  .prod-select { padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; background: #fff; cursor: pointer; color: #0F172A; min-width: 140px; }
  .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px,100%), 1fr)); gap: clamp(14px, 2.5vw, 20px); }
  .prod-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.18s, box-shadow 0.18s; display: flex; flex-direction: column; }
  .prod-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09); }
  .prod-card-img { width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #F1F5F9; }
  .prod-card-body { padding: clamp(12px, 2vw, 18px); flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .prod-cat { display: inline-block; background: #F0FDF4; color: #15803D; border-radius: 100px; padding: 3px 10px; font-size: 11.5px; font-weight: 600; }
  .prod-name { font-size: clamp(15px, 2vw, 17px); font-weight: 700; color: #0F172A; line-height: 1.3; }
  .prod-name-ur { font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif; font-size: clamp(14px,2vw,16px); direction: rtl; line-height: 1.8; }
  .prod-desc { font-size: 12.5px; color: #64748B; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .prod-desc-ur { font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-size: 12px; line-height: 1.9; }
  .prod-price { font-size: clamp(18px, 2.5vw, 22px); font-weight: 800; color: #16A34A; font-family: 'JetBrains Mono', monospace; }
  .prod-price span { font-size: 13px; color: #94A3B8; font-weight: 400; font-family: inherit; }
  .prod-stock  { font-size: 12px; color: #94A3B8; }
  .prod-farmer { font-size: 12.5px; color: #64748B; }
  .prod-btn { margin-top: auto; width: 100%; padding: 11px; background: #16A34A; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .prod-btn:hover { background: #15803D; }
  .prod-loading { text-align: center; padding: 80px 24px; color: #94A3B8; }
  .prod-translating-banner { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 10px 16px; margin-bottom: 16px; font-size: 13px; color: #15803D; font-weight: 500; display: flex; align-items: center; gap: 8px; }
  .prod-skeleton { background: linear-gradient(90deg, #F1F5F9 25%, #E8EDF2 50%, #F1F5F9 75%); background-size: 200% 100%; animation: prod-shimmer 1.4s infinite; border-radius: 6px; }
  @keyframes prod-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .prod-empty { grid-column: 1/-1; text-align: center; padding: 60px 24px; }
  @media (max-width: 640px) { .prod-filter-row { flex-direction: column; } .prod-search,.prod-select { width: 100%; } .prod-toolbar { flex-direction: column; align-items: flex-start; } }
`;

export default function Products() {
  const { user }   = useAuth();
  const { lang, isUrdu } = useLang();
  const navigate   = useNavigate();

  const [rawProducts,  setRawProducts]  = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [selectedCat,  setSelectedCat]  = useState('');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  // useTranslatedProducts handles translation reactively
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

  return (
    <>
      <style>{css}</style>
      <div className="prod-page">

        {/* Toolbar: title + language toggle */}
        <div className="prod-toolbar">
          <div>
            <div className="prod-title">
              {isUrdu ? 'تازہ پیداوار' : 'Fresh Produce'}
            </div>
            <div className="prod-sub">
              {isUrdu ? 'پاکستان بھر کے کھیتوں سے سیدھا' : 'Direct from farms across Pakistan'}
            </div>
          </div>
          <div className="prod-toolbar-right">
            <LanguageToggle light translating={translating} />
          </div>
        </div>

        {/* Translating banner */}
        {translating && (
          <div className="prod-translating-banner">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="10 5">
                <animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur=".8s" repeatCount="indefinite"/>
              </circle>
            </svg>
            Urdu mein translate ho raha hai…
          </div>
        )}

        {/* Filters */}
        <div className="prod-filter-row">
          <input className="prod-search"
            placeholder={isUrdu ? 'پروڈکٹ تلاش کریں…' : 'Search products…'}
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="prod-select" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="">{isUrdu ? 'تمام قسمیں' : 'All Categories'}</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="prod-loading">
            {isUrdu ? 'پروڈکٹس لوڈ ہو رہے ہیں…' : 'Loading products…'}
          </div>
        ) : (
          <div className="prod-grid">
            {filtered.length === 0 ? (
              <div className="prod-empty">
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌾</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>
                  {isUrdu ? 'کوئی پروڈکٹ نہیں ملا' : 'No products found'}
                </div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                  {isUrdu ? 'مختلف تلاش یا قسم آزمائیں' : 'Try a different search or category'}
                </div>
              </div>
            ) : filtered.map(p => (
              <div key={p.productId} className="prod-card">
                <div className="prod-card-img">
                  <ProductImages productId={p.productId} />
                </div>
                <div className="prod-card-body">
                  <span className="prod-cat">{p.category?.name}</span>

                  {/* Name — different font for Urdu */}
                  <div className={`prod-name${isUrdu ? ' prod-name-ur' : ''}`}>
                    {translating ? (
                      <div className="prod-skeleton" style={{ height: '20px', width: '70%' }} />
                    ) : p.name}
                  </div>

                  {/* Description */}
                  {p.description && (
                    <div className={`prod-desc${isUrdu ? ' prod-desc-ur' : ''}`}>
                      {translating ? (
                        <div className="prod-skeleton" style={{ height: '14px', width: '90%', marginTop: '4px' }} />
                      ) : p.description}
                    </div>
                  )}

                  <div className="prod-price">
                    Rs. {p.pricePerKg}
                    <span> / {p.unit || 'kg'}</span>
                  </div>
                  <div className="prod-stock">
                    {isUrdu ? `${p.stockKg} کلو دستیاب` : `${p.stockKg} kg available`}
                  </div>
                  <div className="prod-farmer">
                    🌾 {p.farmer?.fullName} — {p.farmer?.city}
                  </div>
                  <button className="prod-btn" onClick={() => handleOrder(p.productId)}>
                    {isUrdu ? 'ابھی آرڈر کریں' : 'Order Now'}
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