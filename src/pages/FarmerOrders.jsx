import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  ShoppingCart, Package, User, MapPin, Phone, Mail,
  Clock, CheckCircle, Truck, XCircle, IndianRupee,
  Calendar, Filter, Eye, TrendingUp, PackageCheck,
  AlertCircle, ChevronDown, Star
} from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .fo-shell {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .fo-container {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 24px 60px;
  }

  @media (max-width: 768px) {
    .fo-container {
      padding: 90px 16px 40px;
    }
  }

  @media (max-width: 640px) {
    .fo-container {
      padding: 85px 12px 32px;
    }
  }

  @media (max-width: 480px) {
    .fo-container {
      padding: 80px 12px 24px;
    }
  }

  /* Header */
  .fo-header {
    margin-bottom: 32px;
  }

  @media (max-width: 640px) {
    .fo-header {
      margin-bottom: 24px;
    }
  }

  .fo-title {
    font-size: clamp(24px, 6vw, 36px);
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .fo-subtitle {
    font-size: 13px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .fo-subtitle {
      font-size: 12px;
    }
  }

  /* Stats Cards */
  .fo-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  @media (max-width: 640px) {
    .fo-stats-grid {
      gap: 12px;
      margin-bottom: 24px;
    }
  }

  @media (max-width: 480px) {
    .fo-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .fo-stat-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid #E2E8F0;
    transition: all 0.2s;
  }

  @media (max-width: 640px) {
    .fo-stat-card {
      padding: 12px;
    }
  }

  .fo-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.1);
  }

  .fo-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .fo-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .fo-stat-icon {
      width: 36px;
      height: 36px;
    }
  }

  .fo-stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #0F172A;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
    margin-bottom: 4px;
  }

  @media (max-width: 640px) {
    .fo-stat-value {
      font-size: 24px;
    }
  }

  .fo-stat-label {
    font-size: 12px;
    color: #64748B;
  }

  /* Filter Tabs - Mobile Optimized */
  .fo-filters-wrapper {
    margin-bottom: 28px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .fo-filters {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    min-width: min-content;
    padding-bottom: 4px;
  }

  @media (max-width: 640px) {
    .fo-filters {
      gap: 6px;
    }
  }

  .fo-filter-btn {
    padding: 8px 16px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 1.5px solid #E2E8F0;
    background: white;
    color: #64748B;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .fo-filter-btn {
      padding: 6px 12px;
      font-size: 11px;
    }
  }

  .fo-filter-btn:hover {
    border-color: #16A34A;
    color: #16A34A;
  }

  .fo-filter-btn-active {
    background: #16A34A;
    border-color: #16A34A;
    color: white;
  }

  .fo-filter-btn-active:hover {
    background: #15803D;
    color: white;
  }

  /* Loading State */
  .fo-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 12px;
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .fo-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #E2E8F0;
    border-top-color: #16A34A;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .fo-empty-state {
    background: white;
    border-radius: 20px;
    padding: 40px 20px;
    text-align: center;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .fo-empty-state {
      padding: 32px 20px;
      border-radius: 16px;
    }
  }

  .fo-empty-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .fo-empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 8px;
  }

  .fo-empty-subtitle {
    font-size: 13px;
    color: #64748B;
  }

  /* Orders Grid */
  .fo-orders-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 640px) {
    .fo-orders-grid {
      gap: 16px;
    }
  }

  /* Order Card */
  .fo-order-card {
    background: white;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 640px) {
    .fo-order-card {
      border-radius: 16px;
    }
  }

  .fo-order-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.1);
  }

  /* Order Header */
  .fo-order-header {
    background: #F8FAFC;
    padding: 16px 20px;
    border-bottom: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .fo-order-header {
      padding: 14px 16px;
    }
  }

  .fo-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .fo-header-top {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .fo-order-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .fo-order-info {
      gap: 8px;
    }
  }

  @media (max-width: 480px) {
    .fo-order-info {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .fo-order-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #16A34A;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #F0FDF4;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .fo-order-date {
    font-size: 12px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Status Badges */
  .fo-badge {
    padding: 5px 12px;
    border-radius: 30px;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    .fo-badge {
      align-self: flex-start;
    }
  }

  .fo-badge-pending {
    background: #FFFBEB;
    color: #D97706;
    border: 1px solid #FDE68A;
  }

  .fo-badge-confirmed {
    background: #EFF6FF;
    color: #2563EB;
    border: 1px solid #BFDBFE;
  }

  .fo-badge-processing {
    background: #FEF3C7;
    color: #D97706;
    border: 1px solid #FDE68A;
  }

  .fo-badge-shipped {
    background: #F0FDF4;
    color: #16A34A;
    border: 1px solid #BBF7D0;
  }

  .fo-badge-delivered {
    background: #F0FDF4;
    color: #15803D;
    border: 1px solid #BBF7D0;
  }

  .fo-badge-cancelled {
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FECACA;
  }

  /* Order Body */
  .fo-order-body {
    padding: 20px;
  }

  @media (max-width: 640px) {
    .fo-order-body {
      padding: 16px;
    }
  }

  /* Buyer Info Card */
  .fo-buyer-card {
    background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .fo-buyer-card {
      padding: 12px;
      margin-bottom: 16px;
    }
  }

  .fo-buyer-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .fo-buyer-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  @media (max-width: 640px) {
    .fo-buyer-info {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }

  .fo-buyer-field {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #334155;
  }

  /* Items Section */
  .fo-items-section {
    margin-bottom: 20px;
  }

  .fo-items-title {
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .fo-items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .fo-order-item {
    background: #F0FDF4;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid #DCFCE7;
  }

  @media (max-width: 640px) {
    .fo-order-item {
      padding: 10px;
    }
  }

  .fo-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .fo-item-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .fo-item-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #166534;
  }

  .fo-item-details {
    font-size: 13px;
    color: #334155;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .fo-item-total {
    font-weight: 700;
    color: #16A34A;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Order Footer */
  .fo-order-footer {
    padding-top: 16px;
    border-top: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .fo-order-footer {
      flex-direction: column;
    }
  }

  .fo-total-info {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }

  .fo-total-label {
    font-size: 13px;
    color: #64748B;
  }

  .fo-total-amount {
    font-size: 20px;
    font-weight: 800;
    color: #16A34A;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 640px) {
    .fo-total-amount {
      font-size: 18px;
    }
  }

  /* Action Buttons */
  .fo-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .fo-actions {
      width: 100%;
    }
  }

  .fo-btn-primary {
    padding: 10px 20px;
    background: #16A34A;
    color: white;
    border: none;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  @media (max-width: 640px) {
    .fo-btn-primary {
      flex: 1;
      justify-content: center;
      padding: 10px 16px;
    }
  }

  .fo-btn-primary:hover {
    background: #15803D;
    transform: translateY(-1px);
  }

  .fo-btn-danger {
    padding: 10px 20px;
    background: transparent;
    color: #DC2626;
    border: 1.5px solid #FECACA;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  @media (max-width: 640px) {
    .fo-btn-danger {
      flex: 1;
      justify-content: center;
      padding: 10px 16px;
    }
  }

  .fo-btn-danger:hover {
    background: #FEF2F2;
    border-color: #FCA5A5;
    transform: translateY(-1px);
  }

  .fo-btn-secondary {
    padding: 10px 20px;
    background: #F1F5F9;
    color: #334155;
    border: none;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  @media (max-width: 640px) {
    .fo-btn-secondary {
      width: 100%;
      justify-content: center;
    }
  }

  .fo-btn-secondary:hover {
    background: #E2E8F0;
    transform: translateY(-1px);
  }

  .fo-completed-message {
    text-align: center;
    font-size: 13px;
    color: #64748B;
    padding: 12px;
    background: #F8FAFC;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const statusIcons = {
  pending: <Clock size={12} />,
  confirmed: <CheckCircle size={12} />,
  processing: <Package size={12} />,
  shipped: <Truck size={12} />,
  delivered: <CheckCircle size={12} />,
  cancelled: <XCircle size={12} />
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function FarmerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get(`/orders/farmer/${user.userId}`)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.userId]);

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'fo-badge-pending';
      case 'confirmed': return 'fo-badge-confirmed';
      case 'processing': return 'fo-badge-processing';
      case 'shipped': return 'fo-badge-shipped';
      case 'delivered': return 'fo-badge-delivered';
      case 'cancelled': return 'fo-badge-cancelled';
      default: return 'fo-badge-pending';
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/status/${orderId}`, { status: newStatus });
      setOrders(prev =>
        prev.map(o =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch {
      alert('Failed to update order status.');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const filters = [
    { value: 'all', label: 'All Orders', icon: <ShoppingCart size={12} /> },
    { value: 'pending', label: 'Pending', icon: <Clock size={12} /> },
    { value: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={12} /> },
    { value: 'delivered', label: 'Delivered', icon: <Truck size={12} /> },
    { value: 'cancelled', label: 'Cancelled', icon: <XCircle size={12} /> }
  ];

  // Stats calculations
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="fo-shell">
          <div className="fo-loading">
            <div className="fo-spinner"></div>
            <span style={{ color: '#64748B' }}>Loading your orders...</span>
          </div>
        </div>
        <style>{STYLES}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fo-shell">
        <style>{STYLES}</style>
        <div className="fo-container">
          {/* Header */}
          <div className="fo-header">
            <h1 className="fo-title">
              <ShoppingCart size={28} strokeWidth={1.5} />
              Incoming Orders
            </h1>
            <div className="fo-subtitle">
              <Package size={12} />
              Manage and track orders from your customers
            </div>
          </div>

          {/* Stats Cards */}
          <div className="fo-stats-grid">
            <div className="fo-stat-card">
              <div className="fo-stat-header">
                <div className="fo-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="fo-stat-value">{stats.total}</div>
              <div className="fo-stat-label">Total Orders</div>
            </div>

            <div className="fo-stat-card">
              <div className="fo-stat-header">
                <div className="fo-stat-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <Clock size={20} />
                </div>
              </div>
              <div className="fo-stat-value">{stats.pending}</div>
              <div className="fo-stat-label">Pending</div>
            </div>

            <div className="fo-stat-card">
              <div className="fo-stat-header">
                <div className="fo-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="fo-stat-value">{stats.confirmed}</div>
              <div className="fo-stat-label">Confirmed</div>
            </div>

            <div className="fo-stat-card">
              <div className="fo-stat-header">
                <div className="fo-stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="fo-stat-value">Rs. {stats.totalRevenue.toLocaleString()}</div>
              <div className="fo-stat-label">Total Revenue</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="fo-filters-wrapper">
            <div className="fo-filters">
              {filters.map(f => (
                <button
                  key={f.value}
                  className={`fo-filter-btn ${filter === f.value ? 'fo-filter-btn-active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.icon}
                  {f.label}
                  <span style={{
                    marginLeft: '4px',
                    opacity: 0.8,
                    fontSize: '10px'
                  }}>
                    ({getStatusCount(f.value)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filtered.length === 0 ? (
            <div className="fo-empty-state">
              <div className="fo-empty-icon">
                <ShoppingCart size={40} strokeWidth={1.5} color="#16A34A" />
              </div>
              <h3 className="fo-empty-title">No {filter === 'all' ? '' : filter} orders</h3>
              <p className="fo-empty-subtitle">
                {filter === 'all'
                  ? "You haven't received any orders yet"
                  : `No orders with status "${filter}"`}
              </p>
            </div>
          ) : (
            <div className="fo-orders-grid">
              {filtered.map(order => (
                <div key={order.orderId} className="fo-order-card">
                  {/* Order Header */}
                  <div className="fo-order-header">
                    <div className="fo-header-top">
                      <div className="fo-order-info">
                        <div className="fo-order-id">
                          <Package size={12} />
                          #{order.orderId}
                        </div>
                        <div className="fo-order-date">
                          <Calendar size={11} />
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className={`fo-badge ${getStatusBadgeClass(order.status)}`}>
                        {statusIcons[order.status]}
                        {statusLabels[order.status] || order.status}
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="fo-order-body">
                    {/* Buyer Information */}
                    <div className="fo-buyer-card">
                      <div className="fo-buyer-title">
                        <User size={12} /> Buyer Information
                      </div>
                      <div className="fo-buyer-info">
                        <div className="fo-buyer-field">
                          <User size={14} color="#64748B" />
                          <span>{order.buyer?.fullName || 'N/A'}</span>
                        </div>
                        <div className="fo-buyer-field">
                          <MapPin size={14} color="#64748B" />
                          <span>{order.buyer?.city || 'N/A'}</span>
                        </div>
                        <div className="fo-buyer-field">
                          <Phone size={14} color="#64748B" />
                          <span>{order.buyer?.phone || 'N/A'}</span>
                        </div>
                        <div className="fo-buyer-field">
                          <Mail size={14} color="#64748B" />
                          <span>{order.buyer?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="fo-items-section">
                      <div className="fo-items-title">
                        <Package size={12} /> Order Items
                      </div>
                      <div className="fo-items-list">
                        {order.items
                          ?.filter(item => item.product?.farmer?.userId === user.userId)
                          .map(item => (
                            <div key={item.itemId} className="fo-order-item">
                              <div className="fo-item-content">
                                <div className="fo-item-name">
                                  <Star size={14} color="#16A34A" />
                                  {item.product?.name}
                                </div>
                                <div className="fo-item-details">
                                  <span>{item.quantityKg} kg</span>
                                  <span>× Rs. {item.priceAtTime?.toLocaleString()}/kg</span>
                                </div>
                                <div className="fo-item-total">
                                  = Rs. {((item.quantityKg || 0) * (item.priceAtTime || 0)).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="fo-order-footer">
                      <div className="fo-total-info">
                        <span className="fo-total-label">Order Total:</span>
                        <span className="fo-total-amount">
                          <IndianRupee size={14} />
                          {order.totalAmount?.toLocaleString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      {order.status === 'pending' && (
                        <div className="fo-actions">
                          <button
                            className="fo-btn-primary"
                            onClick={() => handleStatusUpdate(order.orderId, 'confirmed')}
                          >
                            <CheckCircle size={14} /> Confirm Order
                          </button>
                          <button
                            className="fo-btn-danger"
                            onClick={() => handleStatusUpdate(order.orderId, 'cancelled')}
                          >
                            <XCircle size={14} /> Cancel Order
                          </button>
                        </div>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          className="fo-btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => handleStatusUpdate(order.orderId, 'delivered')}
                        >
                          <Truck size={14} /> Mark as Delivered
                        </button>
                      )}

                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <div className="fo-completed-message">
                          {order.status === 'delivered' ? (
                            <>
                              <CheckCircle size={14} color="#16A34A" />
                              Order completed successfully
                            </>
                          ) : (
                            <>
                              <XCircle size={14} color="#DC2626" />
                              Order cancelled
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}