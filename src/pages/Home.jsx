import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  Users,
  Leaf,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  UserPlus,
  Package,
  Award,
  BarChart3,
  DollarSign,
  Sprout,
  Sun,
  Droplets,
  Store,
  ArrowUpRight,
  Quote
} from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────────── */
const stats = [
  { value: '2,400+', label: 'Registered Farmers', icon: Users },
  { value: '18,000+', label: 'Orders Delivered', icon: Truck },
  { value: '0', label: 'Middlemen Involved', icon: Shield },
  { value: '100%', label: 'Direct from Farm', icon: Leaf },
];

const featuredProducts = [
  {
    name: 'Fresh Tomatoes',
    price: 'Rs. 45',
    unit: '/kg',
    farmer: 'Anwar Farms',
    location: 'Multan',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=500&fit=crop',
    badge: "Today's Harvest",
  },
  {
    name: 'Organic Basmati',
    price: 'Rs. 220',
    unit: '/kg',
    farmer: 'Tariq Estate',
    location: 'Gujranwala',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&h=500&fit=crop',
    badge: 'Premium Quality',
  },
  {
    name: 'Farm Fresh Milk',
    price: 'Rs. 140',
    unit: '/L',
    farmer: 'Hussain Dairy',
    location: 'Lahore',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=500&fit=crop',
    badge: 'Direct from Farm',
  },
];

const categories = [
  { name: 'Vegetables', count: '240+ listings', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=380&fit=crop', icon: Leaf },
  { name: 'Fruits', count: '180+ listings', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&h=380&fit=crop', icon: Sprout },
  { name: 'Grains', count: '210+ listings', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=380&fit=crop', icon: Sun },
  { name: 'Dairy', count: '95+ listings', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=380&fit=crop', icon: Droplets },
  { name: 'Spices', count: '120+ listings', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=380&fit=crop', icon: Award },
  { name: 'Pulses', count: '85+ listings', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500&h=380&fit=crop', icon: Package },
];

const testimonials = [
  {
    name: 'Muhammad Anwar',
    role: 'Wheat Farmer, Multan',
    quote: 'Pehlay aarhti hum se seedha rate batata tha. Ab hum khud rate rakhte hain. Pichle season mein 30% zyada kamaya.',
    gain: '+30% income',
    initials: 'MA',
  },
  {
    name: 'Saba Tariq',
    role: 'Restaurant Owner, Karachi',
    quote: 'Fresh vegetables directly from farms at half the market price. My restaurant saves Rs. 40,000 every month.',
    gain: 'Rs. 40K saved/mo',
    initials: 'ST',
  },
  {
    name: 'Ghulam Hussain',
    role: 'Vegetable Farmer, Lahore',
    quote: 'KhetSe par account banaya, teen din mein pehla order aaya. Ab har hafte orders aate hain.',
    gain: 'Weekly orders',
    initials: 'GH',
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────────── */
export default function Home() {
  const { user } = useAuth();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const visibleCount = 3;
  const maxIndex = categories.length - visibleCount;
  const scrollCarousel = (dir) => setCarouselIndex(prev => Math.max(0, Math.min(prev + dir, maxIndex)));

  const forest = '#1A3A1A';
  const forestDark = '#0D220D';
  const mint = '#52B788';
  const mintLight = '#B7E4C7';
  const cream = '#FAFAF7';
  const offWhite = '#F4F2ED';
  const border = '#E5E2DA';
  const text = '#1C1C1A';
  const muted = '#5A5A56';
  const faint = '#8A8A86';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Nunito+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .kp { font-family: 'Nunito Sans', sans-serif; background: ${cream}; color: ${text}; }
        .kp h1, .kp h2, .kp h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
        .kp a { text-decoration: none; }

        .kp .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${mint}; color: #1A1A1A;
          padding: 14px 32px; border-radius: 40px;
          font-family: 'Nunito Sans', sans-serif; font-size: 15px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.2s ease;
        }
        .kp .btn-primary:hover { background: #3da36f; transform: translateY(-2px); gap: 12px; }

        .kp .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          padding: 14px 32px; border-radius: 40px;
          font-family: 'Nunito Sans', sans-serif; font-size: 15px; font-weight: 600;
          border: 1.5px solid rgba(255,255,255,0.3); color: #FFFFFF;
          cursor: pointer; transition: all 0.2s ease;
        }
        .kp .btn-secondary:hover { border-color: ${mint}; background: rgba(82,183,136,0.15); transform: translateY(-2px); gap: 12px; }

        .kp .product-card {
          background: #FFFFFF; border-radius: 20px;
          border: 1px solid ${border}; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: block; color: ${text};
        }
        .kp .product-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }

        .kp .category-card {
          flex: 0 0 calc(33.333% - 12px); border-radius: 20px; overflow: hidden;
          position: relative; height: 280px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: block;
        }
        .kp .category-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.16); }
        .kp .category-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .kp .category-card:hover img { transform: scale(1.08); }

        .kp .nav-button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid ${border}; background: #FFFFFF;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .kp .nav-button:hover { border-color: ${mint}; background: #f0faf5; transform: scale(1.05); }
        .kp .nav-button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .kp .hero-grid { grid-template-columns: 1fr 300px !important; gap: 40px !important; }
          .kp .stats-grid { gap: 24px !important; }
          .kp .featured-grid { gap: 24px !important; }
          .kp .testimonials-grid { gap: 24px !important; }
        }

        @media (max-width: 900px) {
          .kp .footer-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
        }

        @media (max-width: 768px) {
          .kp .category-card { flex: 0 0 calc(50% - 10px); height: 220px; }
          .kp .product-card .product-image { height: 180px; }
          .kp .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; text-align: center; }
          .kp .hero-left { text-align: center; }
          .kp .hero-badge { justify-content: center; }
          .kp .hero-desc { margin-left: auto; margin-right: auto; }
          .kp .hero-buttons { justify-content: center; }
          .kp .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0 !important; }
          .kp .stats-item { border-right: none !important; border-bottom: 1px solid ${border}; }
          .kp .stats-item:last-child { border-bottom: none; }
          .kp .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .kp .testimonials-grid { grid-template-columns: 1fr !important; max-width: 500px; margin-left: auto; margin-right: auto; }
          .kp .why-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .kp .works-grid { flex-direction: column !important; max-width: 500px; margin-left: auto; margin-right: auto; }
          .kp .section-padding { padding: 64px 24px !important; }
          .kp .container-padding { padding: 0 24px !important; }
        }

        @media (max-width: 640px) {
          .kp .category-card { flex: 0 0 100%; height: 200px; }
          .kp .featured-grid { grid-template-columns: 1fr !important; max-width: 400px; margin-left: auto; margin-right: auto; }
          .kp .stats-grid { grid-template-columns: 1fr !important; }
          .kp .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
          .kp .footer-logo { justify-content: center; }
          .kp .footer-desc { margin-left: auto; margin-right: auto; }
          .kp .hero-buttons { flex-direction: column; align-items: center; }
          .kp .hero-buttons a { width: fit-content; }
          .kp .cta-buttons { flex-direction: column; align-items: center; }
        }

        @media (max-width: 480px) {
          .kp .product-card .product-image { height: 200px; }
          .kp .category-card { height: 180px; }
          .kp .card-padding { padding: 24px !important; }
        }
      `}</style>

      <div className="kp">

        {/* ══ MODERN HERO SECTION ════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          background: forestDark,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }} className="section-padding">
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2073&auto=format")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, #0A1A0A 0%, #0A1A0A 40%, rgba(10,26,10,0.6) 100%)',
          }} />

          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '64px',
            alignItems: 'center',
            width: '100%',
          }} className="hero-grid">
            <div style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'none' : 'translateY(24px)',
              transition: 'all 0.9s ease 0.1s',
            }} className="hero-left">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(82,183,136,0.12)',
                border: '1px solid rgba(82,183,136,0.3)',
                padding: '8px 20px',
                borderRadius: '100px',
                marginBottom: '32px',
                backdropFilter: 'blur(4px)',
              }} className="hero-badge">
                <Leaf size={14} color={mint} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: mintLight, letterSpacing: '0.5px' }}>Pakistan's Direct Farm Marketplace</span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: '700',
                color: '#FFFFFF',
                lineHeight: '1.08',
                letterSpacing: '-0.02em',
                marginBottom: '28px',
              }}>
                From the farm,<br />
                <span style={{ color: mint, fontStyle: 'italic' }}>straight to you.</span>
              </h1>

              <p style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.7',
                marginBottom: '42px',
                maxWidth: '460px',
              }} className="hero-desc">
                No middlemen. No inflated prices. Buy directly from Pakistan's farmers at honest prices.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-buttons">
                <Link to="/products" className="btn-primary">
                  Browse Products <ArrowRight size={18} />
                </Link>
                {!user && <Link to="/login" className="btn-secondary">Login to Sell</Link>}
              </div>
            </div>

            <div style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'none' : 'translateY(24px)',
              transition: 'all 0.9s ease 0.3s',
            }}>
              <div style={{
                background: 'rgba(10,26,10,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(82,183,136,0.3)',
                borderRadius: '24px',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <TrendingUp size={16} color={mint} />
                  <p style={{ fontSize: '11px', fontWeight: '800', color: mintLight, letterSpacing: '2px', textTransform: 'uppercase' }}>Live on marketplace</p>
                </div>

                {[
                  { name: 'Fresh Tomatoes', farm: 'Anwar Farms, Multan', price: 'Rs. 45/kg' },
                  { name: 'Organic Basmati', farm: 'Tariq Estate, Gujranwala', price: 'Rs. 220/kg' },
                  { name: 'Kinnow (Mandarin)', farm: 'Punjab Citrus, Sargodha', price: 'Rs. 120/kg' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: i < 2 ? '1px solid rgba(82,183,136,0.12)' : 'none',
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{item.farm}</p>
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: mint,
                      background: 'rgba(82,183,136,0.12)',
                      padding: '5px 14px',
                      borderRadius: '100px',
                    }}>{item.price}</span>
                  </div>
                ))}

                <div style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(82,183,136,0.12)',
                  display: 'flex',
                  gap: '32px',
                  flexWrap: 'wrap',
                }}>
                  {[
                    { n: '2,400+', l: 'Farmers', icon: Users },
                    { n: '18K+', l: 'Orders', icon: ShoppingBag },
                    { n: '10%', l: 'Commission', icon: DollarSign }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <s.icon size={20} color={mint} />
                      <div>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>{s.n}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS SECTION ════════════════════════════════════════════════ */}
        <section style={{ background: '#FFFFFF', borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '32px' }} className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '44px 20px',
                textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${border}` : 'none',
              }} className="stats-item">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <s.icon size={32} color={mint} strokeWidth={1.5} />
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: '700', color: forest, lineHeight: 1, marginBottom: '8px' }}>{s.value}</p>
                <p style={{ fontSize: '14px', color: muted, fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURED PRODUCTS ════════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: cream }} className="section-padding">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="container-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Leaf size={14} color={mint} />
                  <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', color: mint }}>Fresh picks</span>
                </div>
                <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', color: text, lineHeight: '1.2', letterSpacing: '-0.02em' }}>Direct from the harvest</h2>
                <p style={{ fontSize: '16px', color: muted, marginTop: '12px', maxWidth: '400px', lineHeight: '1.65' }}>Priced by the farmers who grew them — no markup, no middlemen.</p>
              </div>

              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#FAC775', color: '#173404',
                border: 'none', borderRadius: '100px',
                padding: '14px 32px', fontSize: '15px',
                fontWeight: '700', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(250,199,117,0.35)',
              }}>
                Browse Fresh Produce <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }} className="featured-grid">
              {featuredProducts.map((p, i) => (
                <Link key={i} to="/products" className="product-card">
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative', background: '#E8EDE8' }} className="product-image">
                    <img className="pimg" src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: forest,
                      color: mintLight,
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.3px',
                      padding: '6px 16px',
                      borderRadius: '100px',
                    }}>{p.badge}</span>
                  </div>
                  <div style={{ padding: '24px' }} className="card-padding">
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: text, marginBottom: '6px' }}>{p.name}</h3>
                    <p style={{ fontSize: '13px', color: faint, marginBottom: '20px' }}>{p.farmer} · {p.location}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${border}` }}>
                      <div>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: forest }}>{p.price}</span>
                        <span style={{ fontSize: '14px', color: faint, marginLeft: '2px' }}>{p.unit}</span>
                      </div>
                      <ArrowRight size={20} color={mint} strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CATEGORIES CAROUSEL ══════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: '#FFFFFF' }} className="section-padding">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="container-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Store size={14} color={mint} />
                  <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', color: mint }}>Explore</span>
                </div>
                <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', color: text, lineHeight: '1.2', letterSpacing: '-0.02em' }}>Shop by category</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="nav-button" onClick={() => scrollCarousel(-1)} disabled={carouselIndex === 0}>
                  <ChevronLeft size={20} />
                </button>
                <button className="nav-button" onClick={() => scrollCarousel(1)} disabled={carouselIndex >= maxIndex}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'flex',
                gap: '20px',
                transform: `translateX(calc(-${carouselIndex} * (33.333% + 8px)))`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {categories.map((cat, i) => (
                  <Link key={i} to={`/products?category=${cat.name.toLowerCase()}`} className="category-card">
                    <img src={cat.image} alt={cat.name} />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(8,24,8,0.95) 20%, rgba(8,24,8,0.2) 100%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px' }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>{cat.name}</p>
                      <p style={{ fontSize: '13px', color: mintLight, fontWeight: '600' }}>{cat.count}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button key={i} onClick={() => setCarouselIndex(i)} style={{
                  width: i === carouselIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === carouselIndex ? mint : border,
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: offWhite }} className="section-padding">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="container-padding">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                <BarChart3 size={14} color={mint} />
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', color: mint }}>Simple process</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', color: text, lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '12px' }}>How KhetSe works</h2>
              <p style={{ fontSize: '16px', color: muted }}>Three steps. Better for everyone.</p>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }} className="works-grid">
              {[
                { num: '01', icon: Sprout, title: 'Farmers list their harvest', desc: 'Farmers register and list fresh produce at prices they set themselves — fair for their work.' },
                { num: '02', icon: ShoppingBag, title: 'Buyers browse & order', desc: 'Restaurants, families, and businesses browse real inventory and order directly from farmers.' },
                { num: '03', icon: Truck, title: 'Delivered to your door', desc: 'No middlemen, no hidden cuts. Your order goes straight from the farmer to your doorstep.' },
              ].map((step, i) => (
                <div key={i} className="stcard" style={{
                  background: '#FFFFFF', border: `1px solid ${border}`,
                  borderRadius: '20px', padding: '40px 32px', flex: '1',
                  transition: 'transform 0.25s',
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: forest,
                    color: mintLight,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '28px',
                  }}>{step.num}</div>
                  <div style={{ marginBottom: '20px' }}>
                    <step.icon size={36} color={mint} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: text, marginBottom: '12px', lineHeight: '1.35' }}>{step.title}</h3>
                  <p style={{ fontSize: '15px', color: muted, lineHeight: '1.7' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY KHETSE ════════════════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: '#0A1A0A' }} className="section-padding">
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }} className="why-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp size={14} color={mint} />
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', color: mint }}>The problem we solve</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', color: '#FFFFFF', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '20px' }}>
                Farmers earn more.<br />You pay less.
              </h2>
              <p style={{ fontSize: '16px', color: '#B8C7B8', lineHeight: '1.7', marginBottom: '40px' }}>
                Pakistan's traditional supply chain has 3–4 middlemen between the farm and your table. We remove all of them.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: Shield, label: '0 middlemen between farmer and buyer' },
                  { icon: TrendingUp, label: 'Farmers earn 117% more than traditional' },
                  { icon: DollarSign, label: 'Buyers save up to 46% on produce' },
                  { icon: CheckCircle, label: '10% commission — always' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(82,183,136,0.1)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <item.icon size={22} color={mint} />
                    </div>
                    <p style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: '500' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#FEF5F5', border: '1px solid #F5C6C6', borderRadius: '20px', padding: '32px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: '#C0392B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>Traditional Supply Chain</p>
                {[
                  { label: 'Farmer earns', price: 'Rs. 30/kg' },
                  { label: 'Broker Cut', price: '+Rs. 45' },
                  { label: 'Mandi + Wholesaler cut', price: '+Rs. 45' },
                  { label: 'You pay', price: 'Rs. 120/kg' }
                ].map((item, i, arr) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #F5DEDE' : 'none',
                  }}>
                    <span style={{ fontSize: '14px', color: i === arr.length - 1 ? '#B03A3A' : '#5A5A56', fontWeight: i === arr.length - 1 ? '700' : '400' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', color: '#C0392B', fontWeight: '700' }}>{item.price}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#EDF5ED', border: `1px solid ${mint}`, borderRadius: '20px', padding: '32px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: '#1A5A2A', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>KhetSe Direct System</p>
                {[
                  { label: 'Farmer sets price', price: 'Rs. 65/kg' },
                  { label: 'Platform commission', price: '10%' },
                  { label: 'You pay farmer directly', price: 'Rs. 72/kg' }
                ].map((item, i, arr) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #C5E0C5' : 'none',
                  }}>
                    <span style={{ fontSize: '14px', color: i === arr.length - 1 ? '#1A5A2A' : '#5A5A56', fontWeight: i === arr.length - 1 ? '700' : '400' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', color: '#1A5A2A', fontWeight: '700' }}>{item.price}</span>
                  </div>
                ))}
                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(82,183,136,0.15)', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: '#1A5A2A' }}>📈 Farmers earn 117% more · You save 46%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: offWhite }} className="section-padding">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="container-padding">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                <Star size={14} color={mint} />
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', color: mint }}>Testimonials</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', color: text, lineHeight: '1.2', letterSpacing: '-0.02em' }}>Real stories, real people</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '32px' }} className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="tcard" style={{
                  background: '#FFFFFF', border: `1px solid ${border}`,
                  borderRadius: '20px', padding: '36px',
                  transition: 'transform 0.25s',
                }}>
                  <Quote size={32} color={mint} opacity={0.3} style={{ marginBottom: '20px' }} />
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#F4C542" color="#F4C542" />)}
                  </div>
                  <p style={{ fontSize: '15px', color: '#4A4A46', lineHeight: '1.75', marginBottom: '28px', fontStyle: 'italic' }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: `1px solid ${border}`, flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: forest,
                        color: mintLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                      }}>{t.initials}</div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '800', color: text }}>{t.name}</p>
                        <p style={{ fontSize: '12px', color: faint }}>{t.role}</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: forest,
                      background: '#EDF5ED',
                      padding: '6px 14px',
                      borderRadius: '100px',
                      whiteSpace: 'nowrap',
                    }}>{t.gain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA SECTION ══════════════════════════════════════════════════ */}
        <section style={{ padding: '96px 32px', background: forest }} className="section-padding">
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }} className="container-padding">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: '1.2',
              marginBottom: '20px',
            }}>
              {user ? 'Welcome back!' : 'Ready to be part of the change?'}
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', marginBottom: '42px' }}>
              {user
                ? 'Continue supporting local farmers and getting the freshest produce.'
                : 'Join thousands of farmers and buyers already trading directly — no middlemen, just fair deals.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }} className="cta-buttons">
              {user ? (
                <>
                  <Link to="/products" className="btn-primary" style={{ background: '#FFFFFF', color: forest }}>
                    Browse Marketplace <ArrowRight size={18} />
                  </Link>
                  {user.role === 'farmer' && (
                    <Link to="/my-products" className="btn-secondary">
                      Manage Products
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-primary">
                    Login to Your Account
                  </Link>
                  <Link to="/products" className="btn-secondary">
                    <ShoppingBag size={18} /> Shop as Guest
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════ */}
        <footer style={{ background: '#0A150A', padding: '64px 32px 48px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="container-padding">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }} className="footer-grid">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }} className="footer-logo">
                  <Leaf size={28} color={mint} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#FFFFFF' }}>
                    Khet<span style={{ color: mint }}>Se</span>
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', maxWidth: '250px' }} className="footer-desc">
                  Bridging Pakistan's farmers and buyers directly.
                </p>
              </div>
              {[
                { title: 'Farmers', links: [['Sell on KhetSe', '/register'], ['Pricing', '/pricing'], ['Seller Guide', '/guide']] },
                { title: 'Buyers', links: [['Browse Products', '/products'], ['Categories', '/categories'], ['FAQ', '/faq']] },
                { title: 'Company', links: [['About Us', '/about'], ['Contact', '/contact'], ['Privacy', '/privacy']] },
              ].map((col, i) => (
                <div key={i}>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>{col.title}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {col.links.map(([label, to], j) => (
                      <li key={j}>
                        <Link to={to} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.color = mint}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                        >{label} <ArrowUpRight size={12} /></Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>© 2025 KhetSe · All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}