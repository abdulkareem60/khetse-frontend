import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

import {
  Package, ShoppingBag, ClipboardList, CheckCircle,
  PlusCircle, Boxes, ShoppingCart, User,
  Leaf, TrendingUp, Camera, Edit,
  ChevronRight, Clock, CheckCircle2, Truck,
  Store, MapPin, Phone, Ruler, Sprout,
  XCircle, Info, Calendar, DollarSign
} from 'lucide-react';

/* ─── Design tokens injected once ──────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --fd-green-950: #052912;
    --fd-green-900: #0A3D1F;
    --fd-green-800: #14532D;
    --fd-green-700: #166534;
    --fd-green-600: #16A34A;
    --fd-green-500: #22C55E;
    --fd-green-400: #4ADE80;
    --fd-green-100: #DCFCE7;
    --fd-green-50:  #F0FDF4;
    --fd-gold:      #D4A017;
    --fd-gold-light:#FEF3C7;
    --fd-surface:   #FFFFFF;
    --fd-surface-2: #F8FAFC;
    --fd-surface-3: #F1F5F9;
    --fd-border:    #E2E8F0;
    --fd-border-2:  #CBD5E1;
    --fd-text-1:    #0F172A;
    --fd-text-2:    #334155;
    --fd-text-3:    #64748B;
    --fd-text-4:    #94A3B8;
    --fd-shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --fd-shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --fd-shadow-lg: 0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
    --fd-r-sm: 8px; --fd-r-md: 12px; --fd-r-lg: 16px; --fd-r-xl: 20px;
    --fd-font: 'Plus Jakarta Sans', -apple-system, sans-serif;
    --fd-mono: 'JetBrains Mono', monospace;
    --fd-px: clamp(16px, 4vw, 32px);
    --fd-py: clamp(16px, 3vw, 28px);
    --fd-gap: clamp(12px, 2vw, 20px);
  }

  .fd-shell {
    font-family: var(--fd-font);
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    min-height: 100vh;
    padding-top: clamp(64px, 9vw, 90px);
  }

  /* ── Page wrapper ── */
  .fd-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--fd-py) var(--fd-px);
  }

  /* ── Loading ── */
  .fd-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    font-size: 15px;
    color: var(--fd-text-4);
    font-family: var(--fd-font);
    gap: 12px;
  }

  .fd-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid var(--fd-border);
    border-top-color: var(--fd-green-600);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Hero banner ── */
  .fd-hero {
    background: linear-gradient(135deg, var(--fd-green-950) 0%, var(--fd-green-900) 45%, var(--fd-green-800) 100%);
    border-radius: var(--fd-r-xl);
    padding: clamp(28px, 5vw, 40px) clamp(24px, 4vw, 44px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: var(--fd-gap);
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 35px -12px rgba(5,41,18,0.30);
  }

  .fd-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(34,197,94,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .fd-hero::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .fd-hero-left {
    position: relative;
    z-index: 1;
  }

  .fd-hero-greeting {
    font-size: clamp(12px, 1.2vw, 13px);
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }

  .fd-hero-name {
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 800;
    color: #F0FDF4;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .fd-hero-meta {
    font-size: clamp(13px, 1.4vw, 14px);
    color: rgba(255,255,255,0.6);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .fd-hero-meta span {
    color: var(--fd-green-400);
    font-weight: 600;
  }

  .fd-hero-right {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .fd-hero-btn-primary {
    padding: clamp(10px, 1.5vw, 14px) clamp(20px, 2.5vw, 28px);
    background: linear-gradient(135deg, var(--fd-green-500), var(--fd-green-600));
    color: var(--fd-green-950);
    border: none;
    border-radius: 100px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 700;
    cursor: pointer;
    font-family: var(--fd-font);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    transition: all 0.25s;
    box-shadow: 0 4px 14px rgba(34,197,94,0.35);
  }

  .fd-hero-btn-primary:hover {
    background: linear-gradient(135deg, #4ADE80, #22C55E);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34,197,94,0.45);
  }

  .fd-hero-btn-secondary {
    padding: clamp(10px, 1.5vw, 14px) clamp(20px, 2.5vw, 26px);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.9);
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 100px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 600;
    cursor: pointer;
    font-family: var(--fd-font);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    transition: all 0.25s;
  }

  .fd-hero-btn-secondary:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.35);
    transform: translateY(-2px);
  }

  /* ── Stat grid ── */
  .fd-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--fd-gap);
    margin-bottom: var(--fd-gap);
  }

  .fd-stat {
    background: var(--fd-surface);
    border: 1px solid var(--fd-border);
    border-radius: var(--fd-r-lg);
    padding: clamp(18px, 2.5vw, 24px);
    position: relative;
    overflow: hidden;
    box-shadow: var(--fd-shadow-sm);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }

  .fd-stat:hover {
    box-shadow: var(--fd-shadow-md);
    transform: translateY(-4px);
    border-color: var(--fd-green-200);
  }

  .fd-stat-stripe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: var(--fd-r-lg) var(--fd-r-lg) 0 0;
  }

  .fd-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .fd-stat-value {
    font-size: clamp(26px, 4vw, 32px);
    font-weight: 800;
    color: var(--fd-text-1);
    font-family: var(--fd-mono);
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 6px;
  }

  .fd-stat-label {
    font-size: clamp(12px, 1.3vw, 13px);
    color: var(--fd-text-3);
    font-weight: 600;
  }

  .fd-stat-sub {
    font-size: 12px;
    color: var(--fd-text-4);
    margin-top: 4px;
  }

  /* ── Grid 2 ── */
  .fd-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--fd-gap);
    margin-bottom: var(--fd-gap);
  }

  /* ── Card ── */
  .fd-card {
    background: var(--fd-surface);
    border: 1px solid var(--fd-border);
    border-radius: var(--fd-r-lg);
    box-shadow: var(--fd-shadow-sm);
    overflow: hidden;
    transition: all 0.3s;
  }

  .fd-card:hover {
    box-shadow: var(--fd-shadow-md);
    transform: translateY(-2px);
  }

  .fd-card-header {
    padding: clamp(16px, 2.2vw, 22px) clamp(18px, 2.5vw, 26px);
    border-bottom: 1px solid var(--fd-surface-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fd-card-title {
    font-size: clamp(15px, 1.6vw, 17px);
    font-weight: 700;
    color: var(--fd-text-1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fd-card-sub {
    font-size: 12px;
    color: var(--fd-text-4);
    margin-top: 4px;
  }

  .fd-card-link {
    font-size: 13px;
    font-weight: 600;
    color: var(--fd-green-600);
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .fd-card-link:hover {
    color: var(--fd-green-700);
    gap: 8px;
  }

  .fd-card-body {
    padding: clamp(14px, 2vw, 22px) clamp(18px, 2.5vw, 26px);
  }

  /* ── Quick actions ── */
  .fd-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
    margin-bottom: var(--fd-gap);
  }

  .fd-action-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: clamp(14px, 2.2vw, 18px) clamp(16px, 2.5vw, 22px);
    background: var(--fd-surface);
    border: 1.5px solid var(--fd-border);
    border-radius: var(--fd-r-lg);
    cursor: pointer;
    text-decoration: none;
    box-shadow: var(--fd-shadow-sm);
    transition: all 0.3s;
  }

  .fd-action-btn:hover {
    border-color: var(--fd-green-400);
    box-shadow: var(--fd-shadow-md);
    transform: translateY(-4px);
  }

  .fd-action-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .fd-action-btn:hover .fd-action-icon {
    transform: scale(1.05);
  }

  .fd-action-label {
    font-size: 14px;
    font-weight: 700;
    color: var(--fd-text-1);
  }

  .fd-action-sub {
    font-size: 12px;
    color: var(--fd-text-4);
    margin-top: 3px;
  }

  .fd-action-arrow {
    margin-left: auto;
    display: flex;
    align-items: center;
    transition: transform 0.25s;
    flex-shrink: 0;
  }

  .fd-action-btn:hover .fd-action-arrow {
    transform: translateX(6px);
  }

  /* ── Orders breakdown ── */
  .fd-breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--fd-surface-3);
  }

  .fd-breakdown-row:last-child {
    border-bottom: none;
  }

  .fd-breakdown-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--fd-text-2);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fd-breakdown-count {
    font-family: var(--fd-mono);
    font-size: 22px;
    font-weight: 800;
    padding: 6px 16px;
    border-radius: 12px;
  }

  /* ── Profile info grid ── */
  .fd-profile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 18px;
  }

  .fd-profile-item {
    background: var(--fd-surface-2);
    border-radius: var(--fd-r-sm);
    padding: 12px 14px;
    border: 1px solid var(--fd-border);
    transition: all 0.2s;
  }

  .fd-profile-item:hover {
    border-color: var(--fd-green-200);
    transform: translateX(2px);
  }

  .fd-profile-label {
    font-size: 10px;
    color: var(--fd-text-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .fd-profile-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--fd-text-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Profile request banner ── */
  .fd-req-banner {
    border-radius: var(--fd-r-lg);
    padding: clamp(14px, 2.2vw, 18px) clamp(16px, 2.5vw, 22px);
    margin-bottom: var(--fd-gap);
    border: 1.5px solid;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .fd-req-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .fd-req-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .fd-req-sub {
    font-size: 12.5px;
    line-height: 1.5;
  }

  .fd-req-admin-note {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 12.5px;
  }

  /* ── Pro tip banner ── */
  .fd-tip {
    background: linear-gradient(135deg, var(--fd-green-950), var(--fd-green-900));
    border-radius: var(--fd-r-lg);
    padding: clamp(24px, 4vw, 32px) clamp(24px, 5vw, 40px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    box-shadow: 0 12px 32px rgba(5,41,18,0.25);
    position: relative;
    overflow: hidden;
  }

  .fd-tip::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .fd-tip-title {
    font-size: clamp(16px, 2.5vw, 20px);
    font-weight: 800;
    color: #F0FDF4;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fd-tip-sub {
    font-size: clamp(13px, 1.5vw, 14px);
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    max-width: 560px;
  }

  .fd-tip-btn {
    padding: 12px 28px;
    border-radius: 100px;
    background: linear-gradient(135deg, var(--fd-gold), #E5B520);
    color: var(--fd-green-950);
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--fd-font);
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.25s;
    box-shadow: 0 4px 14px rgba(212,160,23,0.35);
  }

  .fd-tip-btn:hover {
    background: linear-gradient(135deg, #E5B520, #D4A017);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212,160,23,0.45);
  }

  /* ── Update profile button ── */
  .fd-update-profile-btn {
    display: block;
    padding: 14px 18px;
    background: var(--fd-green-50);
    border: 1.5px dashed var(--fd-green-400);
    border-radius: var(--fd-r-sm);
    text-align: center;
    text-decoration: none;
    transition: all 0.25s;
  }

  .fd-update-profile-btn:hover {
    background: var(--fd-green-100);
    border-color: var(--fd-green-500);
    transform: translateY(-2px);
  }

  .fd-manage-orders-btn {
    display: block;
    width: 100%;
    margin-top: 18px;
    padding: 12px;
    background: var(--fd-surface-2);
    border: 1px solid var(--fd-border);
    border-radius: var(--fd-r-sm);
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--fd-green-600);
    text-decoration: none;
    transition: all 0.25s;
  }

  .fd-manage-orders-btn:hover {
    background: var(--fd-green-50);
    border-color: var(--fd-green-400);
    transform: translateY(-1px);
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .fd-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .fd-profile-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .fd-hero {
      flex-direction: column;
      align-items: flex-start;
    }
    .fd-hero-right {
      width: 100%;
    }
    .fd-hero-btn-primary,
    .fd-hero-btn-secondary {
      flex: 1;
      justify-content: center;
    }
    .fd-tip {
      flex-direction: column;
      text-align: center;
    }
    .fd-tip-btn {
      width: 100%;
      justify-content: center;
    }
    .fd-actions {
      grid-template-columns: 1fr;
    }
    .fd-stats {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .fd-hero-right {
      flex-direction: column;
    }
    .fd-hero-btn-primary,
    .fd-hero-btn-secondary {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [farmerUser, setFarmerUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    Promise.all([
      API.get(`/profile/dashboard/${user.userId}`),
      API.get(`/profile/user/${user.userId}`),
      API.get(`/profile/${user.userId}`),
      API.get(`/profile/requests/${user.userId}`),
    ]).then(([s, u, p, r]) => {
      setStats(s.data);
      setFarmerUser(u.data);
      setProfile(p.data);
      setRequests(r.data);
    }).finally(() => setLoading(false));
  }, [user?.userId]);

  if (loading) return (
    <div className="fd-shell">
      <style>{STYLES}</style>
      <div className="fd-page">
        <div className="fd-loading">
          <div className="fd-spinner"></div>
          <span>Loading your dashboard...</span>
        </div>
      </div>
    </div>
  );

  const latestReq = requests[0];
  const reqStatus = latestReq?.status;

  const reqMeta = {
    pending:  {
      bg: '#FFFBEB',
      border: '#FDE68A',
      color: '#D97706',
      icon: <Clock size={18} />,
      title: 'Profile Update Pending Review',
      sub: 'Your update request has been submitted. Admin will review it shortly.'
    },
    approved: {
      bg: '#F0FDF4',
      border: '#BBF7D0',
      color: '#15803D',
      icon: <CheckCircle2 size={18} />,
      title: 'Profile Update Approved',
      sub: 'Your profile has been updated successfully.'
    },
    rejected: {
      bg: '#FEF2F2',
      border: '#FECACA',
      color: '#DC2626',
      icon: <XCircle size={18} />,
      title: 'Profile Update Rejected',
      sub: 'Your update request was rejected. Please review the reason below.'
    },
  };

  const STAT_CARDS = [
    { Icon: Package, label: 'Total Products', value: stats?.totalProducts ?? 0, sub: `${stats?.activeListings ?? 0} active listings`, accent: '#16A34A', iconBg: '#F0FDF4', iconColor: '#16A34A' },
    { Icon: ShoppingBag, label: 'Active Listings', value: stats?.activeListings ?? 0, sub: 'Currently available for sale', accent: '#2563EB', iconBg: '#EFF6FF', iconColor: '#2563EB' },
    { Icon: ClipboardList, label: 'Total Orders', value: stats?.totalOrders ?? 0, sub: `${stats?.pendingOrders ?? 0} pending fulfillment`, accent: '#D97706', iconBg: '#FFFBEB', iconColor: '#D97706' },
    { Icon: CheckCircle, label: 'Completed Deliveries', value: stats?.deliveredOrders ?? 0, sub: 'Successfully delivered orders', accent: '#0891B2', iconBg: '#ECFEFF', iconColor: '#0891B2' },
  ];

  const QUICK_ACTIONS = [
    { to: '/add-product', icon: <PlusCircle size={20} />, iconBg: '#F0FDF4', iconColor: '#15803D', label: 'Add Product', sub: 'List a new crop' },
    { to: '/my-products', icon: <Boxes size={20} />, iconBg: '#EFF6FF', iconColor: '#1D4ED8', label: 'My Products', sub: 'Manage your listings' },
    { to: '/farmer-orders', icon: <ShoppingCart size={20} />, iconBg: '#FFFBEB', iconColor: '#D97706', label: 'View Orders', sub: 'Track incoming orders' },
    { to: '/farmer-profile', icon: <User size={20} />, iconBg: '#F5F3FF', iconColor: '#7C3AED', label: 'My Profile', sub: 'Update your information' },
  ];

  const ORDER_BREAKDOWN = [
    { label: 'Pending', value: stats?.pendingOrders ?? 0, color: '#D97706', bg: '#FFFBEB', icon: <Clock size={14} /> },
    { label: 'Confirmed', value: stats?.confirmedOrders ?? 0, color: '#2563EB', bg: '#EFF6FF', icon: <CheckCircle2 size={14} /> },
    { label: 'Delivered', value: stats?.deliveredOrders ?? 0, color: '#15803D', bg: '#F0FDF4', icon: <Truck size={14} /> },
  ];

  const PROFILE_FIELDS = [
    { label: 'Full Name', value: farmerUser?.fullName || '—', icon: <User size={12} /> },
    { label: 'City', value: farmerUser?.city || '—', icon: <MapPin size={12} /> },
    { label: 'Phone', value: farmerUser?.phone || '—', icon: <Phone size={12} /> },
    { label: 'Farm Name', value: profile?.farmName || '—', icon: <Store size={12} /> },
    { label: 'Farm Size', value: profile?.farmSize || '—', icon: <Ruler size={12} /> },
    { label: 'Primary Crops', value: profile?.cropsGrown || '—', icon: <Sprout size={12} /> },
  ];

  return (
    <div className="fd-shell">
      <style>{STYLES}</style>
      <div className="fd-page">

        {/* Hero Banner */}
        <div className="fd-hero">
          <div className="fd-hero-left">
            <div className="fd-hero-greeting">Welcome back</div>
            <div className="fd-hero-name">{farmerUser?.fullName || 'Farmer'}</div>
            <div className="fd-hero-meta">
              <Leaf size={14} />
              <span>{profile?.farmName || 'KhetSe Partner'}</span>
              {farmerUser?.city && (
                <>
                  <MapPin size={12} />
                  {farmerUser.city}
                </>
              )}
            </div>
          </div>
          <div className="fd-hero-right">
            <Link to="/add-product" className="fd-hero-btn-primary">
              <PlusCircle size={16} /> Add New Product
            </Link>
            <Link to="/farmer-orders" className="fd-hero-btn-secondary">
              <ShoppingCart size={16} /> View All Orders
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="fd-stats">
          {STAT_CARDS.map((s, i) => (
            <div key={i} className="fd-stat">
              <div className="fd-stat-stripe" style={{ background: s.accent }} />
              <div className="fd-stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
                <s.Icon size={22} strokeWidth={1.5} />
              </div>
              <div className="fd-stat-value">{s.value.toLocaleString()}</div>
              <div className="fd-stat-label">{s.label}</div>
              <div className="fd-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="fd-actions">
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} to={a.to} className="fd-action-btn">
              <div className="fd-action-icon" style={{ background: a.iconBg, color: a.iconColor }}>
                {a.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="fd-action-label">{a.label}</div>
                <div className="fd-action-sub">{a.sub}</div>
              </div>
              <div className="fd-action-arrow">
                <ChevronRight size={18} />
              </div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="fd-grid-2">

          {/* Orders Breakdown Card */}
          <div className="fd-card">
            <div className="fd-card-header">
              <div>
                <div className="fd-card-title">
                  <TrendingUp size={16} /> Order Summary
                </div>
                <div className="fd-card-sub">Track your order status distribution</div>
              </div>
              <Link to="/farmer-orders" className="fd-card-link">
                Details <ChevronRight size={14} />
              </Link>
            </div>
            <div className="fd-card-body">
              {ORDER_BREAKDOWN.map((row, i) => (
                <div key={i} className="fd-breakdown-row">
                  <div className="fd-breakdown-label">
                    {row.icon} {row.label}
                  </div>
                  <div className="fd-breakdown-count" style={{ color: row.color, background: row.bg }}>
                    {row.value}
                  </div>
                </div>
              ))}
              <Link to="/farmer-orders" className="fd-manage-orders-btn">
                Manage All Orders <ChevronRight size={14} style={{ display: 'inline', marginLeft: '6px' }} />
              </Link>
            </div>
          </div>

          {/* Profile Status Card */}
          <div className="fd-card">
            <div className="fd-card-header">
              <div>
                <div className="fd-card-title">
                  <User size={16} /> Profile Overview
                </div>
                <div className="fd-card-sub">Your account information at a glance</div>
              </div>
              <Link to="/farmer-profile" className="fd-card-link">
                Edit Profile <Edit size={14} />
              </Link>
            </div>
            <div className="fd-card-body">
              <div className="fd-profile-grid">
                {PROFILE_FIELDS.map((f, i) => (
                  <div key={i} className="fd-profile-item">
                    <div className="fd-profile-label">{f.icon} {f.label}</div>
                    <div className="fd-profile-value">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Profile Update Request Status */}
              {latestReq && reqMeta[reqStatus] && (
                <div className="fd-req-banner" style={{ background: reqMeta[reqStatus].bg, borderColor: reqMeta[reqStatus].border }}>
                  <div className="fd-req-icon" style={{ color: reqMeta[reqStatus].color }}>
                    {reqMeta[reqStatus].icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fd-req-title" style={{ color: reqMeta[reqStatus].color }}>
                      {reqMeta[reqStatus].title}
                    </div>
                    <div className="fd-req-sub" style={{ color: reqMeta[reqStatus].color, opacity: 0.8 }}>
                      {reqMeta[reqStatus].sub}
                    </div>
                    {latestReq.adminNote && (
                      <div className="fd-req-admin-note" style={{ background: `${reqMeta[reqStatus].border}55`, color: reqMeta[reqStatus].color }}>
                        <Info size={12} style={{ display: 'inline', marginRight: '6px' }} />
                        {latestReq.adminNote}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!latestReq && (
                <Link to="/farmer-profile" className="fd-update-profile-btn">
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--fd-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Edit size={16} /> Complete Your Profile
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--fd-green-600)', marginTop: '4px' }}>
                    Add farm details to attract more buyers
                  </div>
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Pro Tip Banner */}
        <div className="fd-tip">
          <div>
            <div className="fd-tip-title">
              <Camera size={22} /> More Photos = More Sales
            </div>
            <div className="fd-tip-sub">
              Products with 3 or more high-quality photos receive 4x more buyer inquiries
              compared to listings with no images. Showcase your harvest with clear,
              well-lit photos to boost your sales.
            </div>
          </div>
          <Link to="/my-products" className="fd-tip-btn">
            <Edit size={16} /> Update My Listings <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}