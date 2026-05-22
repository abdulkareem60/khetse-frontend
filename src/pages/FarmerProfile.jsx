import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  User, Mail, Phone, MapPin, Building2, Ruler,
  Sprout, FileText, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Edit2, History, Upload,
  ArrowLeft, Home, Star, TrendingUp, Award, Shield,
  Package, ShoppingBag, Leaf, Truck, ChevronRight
} from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .fp-shell {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .fp-container {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 24px 60px;
  }

  @media (max-width: 768px) {
    .fp-container {
      padding: 90px 16px 40px;
    }
  }

  @media (max-width: 640px) {
    .fp-container {
      padding: 85px 12px 32px;
    }
  }

  /* Breadcrumb */
  .fp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .fp-breadcrumb-link {
    color: #64748B;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .fp-breadcrumb-link:hover {
    color: #16A34A;
  }

  .fp-breadcrumb-separator {
    color: #CBD5E1;
    font-size: 12px;
  }

  .fp-breadcrumb-current {
    font-size: 13px;
    color: #16A34A;
    font-weight: 600;
  }

  /* Hero Card */
  .fp-hero-card {
    background: linear-gradient(135deg, #052912 0%, #0A3D1F 50%, #14532D 100%);
    border-radius: 24px;
    padding: 36px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 35px -12px rgba(5,41,18,0.3);
  }

  @media (max-width: 768px) {
    .fp-hero-card {
      padding: 28px;
    }
  }

  @media (max-width: 640px) {
    .fp-hero-card {
      padding: 24px;
    }
  }

  .fp-hero-card::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .fp-hero-card::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .fp-hero-content {
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .fp-hero-content {
      gap: 24px;
    }
  }

  @media (max-width: 640px) {
    .fp-hero-content {
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }
  }

  .fp-avatar {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 3px solid rgba(74,222,128,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    font-weight: 800;
    color: #F0FDF4;
    flex-shrink: 0;
    overflow: hidden;
    transition: all 0.3s;
  }

  @media (max-width: 640px) {
    .fp-avatar {
      width: 90px;
      height: 90px;
      font-size: 34px;
    }
  }

  .fp-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fp-hero-info {
    flex: 1;
  }

  .fp-hero-name {
    font-size: 32px;
    font-weight: 800;
    color: #F0FDF4;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  @media (max-width: 768px) {
    .fp-hero-name {
      font-size: 28px;
    }
  }

  @media (max-width: 640px) {
    .fp-hero-name {
      font-size: 24px;
    }
  }

  .fp-hero-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  @media (max-width: 640px) {
    .fp-hero-meta {
      justify-content: center;
      gap: 16px;
    }
  }

  .fp-hero-farm {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #4ADE80;
  }

  .fp-hero-city {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(240,253,244,0.75);
  }

  .fp-hero-email {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(240,253,244,0.6);
  }

  .fp-pending-badge {
    background: rgba(250,199,117,0.12);
    border: 1px solid rgba(250,199,117,0.35);
    border-radius: 16px;
    padding: 14px 20px;
    backdrop-filter: blur(8px);
  }

  .fp-pending-title {
    font-size: 13px;
    color: #FAC775;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fp-pending-sub {
    font-size: 11px;
    color: rgba(250,199,117,0.7);
    margin-top: 4px;
  }

  /* Tabs */
  .fp-tabs {
    display: flex;
    gap: 8px;
    background: white;
    border-radius: 20px;
    padding: 8px;
    margin-bottom: 28px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  @media (max-width: 640px) {
    .fp-tabs {
      flex-direction: column;
      gap: 6px;
    }
  }

  .fp-tab-btn {
    flex: 1;
    padding: 12px 20px;
    border-radius: 14px;
    border: none;
    background: transparent;
    color: #64748B;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  @media (max-width: 640px) {
    .fp-tab-btn {
      justify-content: center;
      padding: 10px 16px;
    }
  }

  .fp-tab-btn-active {
    background: #16A34A;
    color: white;
    box-shadow: 0 4px 12px rgba(22,163,74,0.25);
  }

  .fp-tab-btn-active:hover {
    background: #15803D;
    transform: translateY(-1px);
  }

  .fp-tab-btn:not(.fp-tab-btn-active):hover {
    background: #F1F5F9;
    color: #0F172A;
  }

  /* Content Cards */
  .fp-content-card {
    background: white;
    border-radius: 24px;
    padding: 36px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    transition: box-shadow 0.3s;
  }

  @media (max-width: 768px) {
    .fp-content-card {
      padding: 28px;
    }
  }

  @media (max-width: 640px) {
    .fp-content-card {
      padding: 20px;
    }
  }

  .fp-content-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  .fp-section-title {
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.01em;
  }

  @media (max-width: 640px) {
    .fp-section-title {
      font-size: 18px;
      margin-bottom: 20px;
    }
  }

  /* Info Grid */
  .fp-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 640px) {
    .fp-info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .fp-info-item {
    background: #F8FAFC;
    border-radius: 16px;
    padding: 18px;
    border: 1px solid #E2E8F0;
    transition: all 0.25s;
  }

  .fp-info-item:hover {
    transform: translateY(-2px);
    border-color: #BBF7D0;
    box-shadow: 0 6px 14px rgba(0,0,0,0.06);
  }

  .fp-info-label {
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fp-info-value {
    font-size: 16px;
    font-weight: 600;
    color: #0F172A;
    line-height: 1.4;
  }

  /* Form Styles */
  .fp-form-section {
    background: #F8FAFC;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 28px;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .fp-form-section {
      padding: 18px;
    }
  }

  .fp-form-section-title {
    font-size: 15px;
    font-weight: 800;
    color: #16A34A;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .fp-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  @media (max-width: 640px) {
    .fp-form-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .fp-field {
    margin-bottom: 0;
  }

  .fp-field-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 8px;
  }

  .fp-field-input,
  .fp-field-textarea,
  .fp-field-select {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #E2E8F0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s;
    background: white;
    color: #0F172A;
  }

  .fp-field-input:focus,
  .fp-field-textarea:focus,
  .fp-field-select:focus {
    outline: none;
    border-color: #16A34A;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
  }

  .fp-field-input:hover,
  .fp-field-textarea:hover,
  .fp-field-select:hover {
    border-color: #CBD5E1;
  }

  .fp-field-textarea {
    resize: vertical;
    min-height: 100px;
  }

  /* Buttons */
  .fp-btn-primary {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #16A34A 0%, #15803D 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34,197,94,0.3);
  }

  .fp-btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .fp-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .fp-btn-secondary {
    width: 100%;
    padding: 14px;
    background: #F1F5F9;
    color: #334155;
    border: 1.5px solid #E2E8F0;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .fp-btn-secondary:hover {
    background: #E2E8F0;
    transform: translateY(-1px);
  }

  /* Alert Messages */
  .fp-alert {
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 13px;
    font-weight: 500;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fp-alert-success {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    color: #15803D;
  }

  .fp-alert-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #DC2626;
  }

  .fp-alert-warning {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    color: #D97706;
  }

  /* Request Cards */
  .fp-request-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 20px;
    border: 1.5px solid #E2E8F0;
    transition: all 0.3s;
  }

  @media (max-width: 640px) {
    .fp-request-card {
      padding: 18px;
    }
  }

  .fp-request-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px -12px rgba(0,0,0,0.12);
    border-color: #BBF7D0;
  }

  .fp-request-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }

  .fp-request-id {
    font-size: 15px;
    font-weight: 800;
    color: #0F172A;
    font-family: 'JetBrains Mono', monospace;
  }

  .fp-request-date {
    font-size: 11px;
    color: #94A3B8;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fp-status-badge {
    padding: 6px 14px;
    border-radius: 40px;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .fp-status-pending {
    background: #FFFBEB;
    color: #D97706;
    border: 1px solid #FDE68A;
  }

  .fp-status-approved {
    background: #F0FDF4;
    color: #15803D;
    border: 1px solid #BBF7D0;
  }

  .fp-status-rejected {
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FECACA;
  }

  .fp-request-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .fp-request-grid {
      grid-template-columns: 1fr;
    }
  }

  .fp-request-field {
    background: #F8FAFC;
    border-radius: 12px;
    padding: 12px;
  }

  .fp-request-field-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .fp-request-field-value {
    font-size: 13px;
    font-weight: 600;
    color: #0F172A;
  }

  .fp-admin-note {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  /* Empty State */
  .fp-empty-state {
    text-align: center;
    padding: 60px 20px;
  }

  .fp-empty-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  .fp-empty-title {
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 10px;
  }

  .fp-empty-subtitle {
    font-size: 14px;
    color: #64748B;
    margin-bottom: 28px;
  }

  /* Loading State */
  .fp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 14px;
    flex-direction: column;
  }

  .fp-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid #E2E8F0;
    border-top-color: #16A34A;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function FarmerProfile() {
  const { user } = useAuth();

  const [farmerUser, setFarmerUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({
    requestedName: '', requestedPhone: '', requestedCity: '',
    requestedFarmName: '', requestedFarmAddress: '',
    requestedFarmSize: '', requestedCropsGrown: '', requestedBio: '',
  });

  useEffect(() => {
    if (!user?.userId) return;
    Promise.all([
      API.get(`/profile/user/${user.userId}`),
      API.get(`/profile/${user.userId}`),
      API.get(`/profile/requests/${user.userId}`),
    ]).then(([u, p, r]) => {
      setFarmerUser(u.data);
      setProfile(p.data);
      setRequests(r.data);
      setForm({
        requestedName: u.data.fullName || '',
        requestedPhone: u.data.phone || '',
        requestedCity: u.data.city || '',
        requestedFarmName: p.data.farmName || '',
        requestedFarmAddress: p.data.farmAddress || '',
        requestedFarmSize: p.data.farmSize || '',
        requestedCropsGrown: p.data.cropsGrown || '',
        requestedBio: p.data.bio || '',
      });
    }).finally(() => setLoading(false));
  }, [user?.userId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const hasPendingRequest = requests.some(r => r.status === 'pending');

  const handleSubmit = async e => {
    e.preventDefault();
    if (hasPendingRequest) {
      setMessage({ type: 'error', text: 'You already have a pending update request. Please wait for admin review.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await API.post(`/profile/update-request/${user.userId}`, form);
      if (res.data.status === 'success') {
        setMessage({ type: 'success', text: res.data.message });
        const r = await API.get(`/profile/requests/${user.userId}`);
        setRequests(r.data);
        setActiveTab('history');
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again.' });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="fp-shell">
          <div className="fp-loading">
            <div className="fp-spinner"></div>
            <span style={{ color: '#64748B', fontSize: '14px' }}>Loading your profile...</span>
          </div>
        </div>
        <style>{STYLES}</style>
      </>
    );
  }

  const initials = farmerUser?.fullName
    ? farmerUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'F';

  const statusConfig = {
    pending: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', icon: <Clock size={12} />, label: 'Pending Review' },
    approved: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', icon: <CheckCircle size={12} />, label: 'Approved' },
    rejected: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', icon: <XCircle size={12} />, label: 'Rejected' },
  };

  const tabs = [
    { key: 'profile', label: 'My Profile', icon: <User size={16} /> },
    { key: 'request', label: 'Request Update', icon: <Edit2 size={16} /> },
    { key: 'history', label: `History (${requests.length})`, icon: <History size={16} /> },
  ];

  return (
    <>
      <Navbar />
      <div className="fp-shell">
        <style>{STYLES}</style>
        <div className="fp-container">
          {/* Breadcrumb */}
          <div className="fp-breadcrumb">
            <Link to="/farmer-dashboard" className="fp-breadcrumb-link">
              <Home size={14} /> Dashboard
            </Link>
            <span className="fp-breadcrumb-separator">/</span>
            <span className="fp-breadcrumb-current">Profile</span>
          </div>

          {/* Hero Card */}
          <div className="fp-hero-card">
            <div className="fp-hero-content">
              <div className="fp-avatar">
                {profile?.profileImageUrl
                  ? <img src={profile.profileImageUrl} alt="Profile" />
                  : initials}
              </div>
              <div className="fp-hero-info">
                <h1 className="fp-hero-name">{farmerUser?.fullName}</h1>
                <div className="fp-hero-meta">
                  <div className="fp-hero-farm">
                    <Sprout size={14} /> {profile?.farmName || 'KhetSe Farmer'}
                  </div>
                  {farmerUser?.city && (
                    <div className="fp-hero-city">
                      <MapPin size={12} /> {farmerUser.city}
                    </div>
                  )}
                </div>
                <div className="fp-hero-email">
                  <Mail size={12} /> {farmerUser?.email}
                </div>
              </div>
              {hasPendingRequest && (
                <div className="fp-pending-badge">
                  <div className="fp-pending-title">
                    <Clock size={14} /> Update Pending
                  </div>
                  <div className="fp-pending-sub">Your request is under admin review</div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="fp-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`fp-tab-btn ${activeTab === tab.key ? 'fp-tab-btn-active' : ''}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Profile */}
          {activeTab === 'profile' && (
            <div className="fp-content-card">
              <h2 className="fp-section-title">
                <User size={22} /> Current Profile Information
              </h2>
              <div className="fp-info-grid">
                <div className="fp-info-item">
                  <div className="fp-info-label"><User size={12} /> Full Name</div>
                  <div className="fp-info-value">{farmerUser?.fullName || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><Mail size={12} /> Email Address</div>
                  <div className="fp-info-value">{farmerUser?.email || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><Phone size={12} /> Phone Number</div>
                  <div className="fp-info-value">{farmerUser?.phone || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><MapPin size={12} /> City</div>
                  <div className="fp-info-value">{farmerUser?.city || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><Building2 size={12} /> Farm Name</div>
                  <div className="fp-info-value">{profile?.farmName || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><Ruler size={12} /> Farm Size</div>
                  <div className="fp-info-value">{profile?.farmSize || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><MapPin size={12} /> Farm Address</div>
                  <div className="fp-info-value">{profile?.farmAddress || '—'}</div>
                </div>
                <div className="fp-info-item">
                  <div className="fp-info-label"><Sprout size={12} /> Crops Grown</div>
                  <div className="fp-info-value">{profile?.cropsGrown || '—'}</div>
                </div>
              </div>
              {profile?.bio && (
                <div className="fp-info-item" style={{ marginBottom: 0 }}>
                  <div className="fp-info-label"><FileText size={12} /> Bio</div>
                  <div className="fp-info-value" style={{ lineHeight: 1.6 }}>{profile.bio}</div>
                </div>
              )}
              <button onClick={() => setActiveTab('request')} className="fp-btn-primary" style={{ marginTop: '28px' }}>
                <Edit2 size={18} /> Request Profile Update
              </button>
            </div>
          )}

          {/* Tab: Request Update */}
          {activeTab === 'request' && (
            <div className="fp-content-card">
              <h2 className="fp-section-title">
                <Edit2 size={22} /> Request Profile Update
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px', lineHeight: 1.5 }}>
                Profile changes are reviewed by admin before going live. Only fill the fields you want to update.
              </p>

              {hasPendingRequest && (
                <div className="fp-alert fp-alert-warning">
                  <Clock size={18} />
                  <div>
                    <strong>Pending Request Exists</strong><br />
                    You already have a pending profile update request. Please wait for admin approval before submitting a new one.
                  </div>
                </div>
              )}

              {message && (
                <div className={`fp-alert ${message.type === 'success' ? 'fp-alert-success' : 'fp-alert-error'}`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="fp-form-section">
                  <div className="fp-form-section-title">
                    <User size={14} /> Personal Information
                  </div>
                  <div className="fp-form-grid">
                    <div className="fp-field">
                      <label className="fp-field-label">Full Name</label>
                      <input
                        type="text"
                        name="requestedName"
                        className="fp-field-input"
                        value={form.requestedName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field-label">Phone Number</label>
                      <input
                        type="tel"
                        name="requestedPhone"
                        className="fp-field-input"
                        value={form.requestedPhone}
                        onChange={handleChange}
                        placeholder="03001234567"
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field-label">City</label>
                      <input
                        type="text"
                        name="requestedCity"
                        className="fp-field-input"
                        value={form.requestedCity}
                        onChange={handleChange}
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                </div>

                {/* Farm Details */}
                <div className="fp-form-section">
                  <div className="fp-form-section-title">
                    <Sprout size={14} /> Farm Details
                  </div>
                  <div className="fp-form-grid">
                    <div className="fp-field">
                      <label className="fp-field-label">Farm Name</label>
                      <input
                        type="text"
                        name="requestedFarmName"
                        className="fp-field-input"
                        value={form.requestedFarmName}
                        onChange={handleChange}
                        placeholder="Enter your farm name"
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field-label">Farm Size</label>
                      <input
                        type="text"
                        name="requestedFarmSize"
                        className="fp-field-input"
                        value={form.requestedFarmSize}
                        onChange={handleChange}
                        placeholder="e.g., 50 Acres"
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field-label">Crops Grown</label>
                      <input
                        type="text"
                        name="requestedCropsGrown"
                        className="fp-field-input"
                        value={form.requestedCropsGrown}
                        onChange={handleChange}
                        placeholder="e.g., Wheat, Rice, Tomatoes"
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field-label">Farm Address</label>
                      <input
                        type="text"
                        name="requestedFarmAddress"
                        className="fp-field-input"
                        value={form.requestedFarmAddress}
                        onChange={handleChange}
                        placeholder="Enter farm location address"
                      />
                    </div>
                  </div>
                  <div className="fp-field" style={{ marginTop: '20px' }}>
                    <label className="fp-field-label">Bio / About</label>
                    <textarea
                      name="requestedBio"
                      className="fp-field-textarea"
                      value={form.requestedBio}
                      onChange={handleChange}
                      placeholder="Tell buyers about your farming experience, practices, and specialties..."
                      rows={4}
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting || hasPendingRequest} className="fp-btn-primary">
                  {submitting ? <Clock size={18} /> : <Upload size={18} />}
                  {submitting ? 'Submitting...' : hasPendingRequest ? 'Request Already Pending' : 'Submit Update Request'}
                </button>
              </form>
            </div>
          )}

          {/* Tab: History */}
          {activeTab === 'history' && (
            <div>
              {requests.length === 0 ? (
                <div className="fp-content-card">
                  <div className="fp-empty-state">
                    <div className="fp-empty-icon">
                      <History size={44} strokeWidth={1.5} color="#16A34A" />
                    </div>
                    <h3 className="fp-empty-title">No Requests Yet</h3>
                    <p className="fp-empty-subtitle">
                      You haven't submitted any profile update requests.
                    </p>
                    <button onClick={() => setActiveTab('request')} className="fp-btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                      Submit Your First Request →
                    </button>
                  </div>
                </div>
              ) : (
                requests.map(req => {
                  const sc = statusConfig[req.status] || statusConfig.pending;
                  return (
                    <div key={req.requestId} className="fp-request-card" style={{ borderColor: sc.border }}>
                      <div className="fp-request-header">
                        <div>
                          <div className="fp-request-id">Request #{req.requestId}</div>
                          <div className="fp-request-date">
                            <Calendar size={10} />
                            {new Date(req.submittedAt).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className={`fp-status-badge fp-status-${req.status}`}>
                          {sc.icon} {sc.label}
                        </div>
                      </div>

                      <div className="fp-request-grid">
                        {req.requestedName && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Full Name</div>
                            <div className="fp-request-field-value">{req.requestedName}</div>
                          </div>
                        )}
                        {req.requestedPhone && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Phone</div>
                            <div className="fp-request-field-value">{req.requestedPhone}</div>
                          </div>
                        )}
                        {req.requestedCity && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">City</div>
                            <div className="fp-request-field-value">{req.requestedCity}</div>
                          </div>
                        )}
                        {req.requestedFarmName && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Farm Name</div>
                            <div className="fp-request-field-value">{req.requestedFarmName}</div>
                          </div>
                        )}
                        {req.requestedFarmSize && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Farm Size</div>
                            <div className="fp-request-field-value">{req.requestedFarmSize}</div>
                          </div>
                        )}
                        {req.requestedCropsGrown && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Crops Grown</div>
                            <div className="fp-request-field-value">{req.requestedCropsGrown}</div>
                          </div>
                        )}
                        {req.requestedFarmAddress && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Farm Address</div>
                            <div className="fp-request-field-value">{req.requestedFarmAddress}</div>
                          </div>
                        )}
                        {req.requestedBio && (
                          <div className="fp-request-field">
                            <div className="fp-request-field-label">Bio</div>
                            <div className="fp-request-field-value">{req.requestedBio}</div>
                          </div>
                        )}
                      </div>

                      {req.adminNote && (
                        <div className="fp-admin-note" style={{ background: sc.bg, borderColor: sc.border }}>
                          <strong>Admin Note:</strong> {req.adminNote}
                        </div>
                      )}

                      {req.reviewedAt && (
                        <div style={{ marginTop: '14px', fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={10} />
                          Reviewed on: {new Date(req.reviewedAt).toLocaleDateString('en-US', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}