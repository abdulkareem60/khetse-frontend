import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  ShoppingBag, Package, Calendar, IndianRupee,
  Clock, CheckCircle, Truck, XCircle, PackageOpen,
  AlertCircle, Search, Filter, ArrowUpDown, ChevronDown
} from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .mo-shell {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .mo-container {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 24px 60px;
  }

  /* Mobile First Responsive */
  @media (max-width: 768px) {
    .mo-container {
      padding: 90px 16px 40px;
    }
  }

  @media (max-width: 640px) {
    .mo-container {
      padding: 85px 12px 32px;
    }
  }

  @media (max-width: 480px) {
    .mo-container {
      padding: 80px 12px 24px;
    }
  }

  /* Header */
  .mo-header {
    margin-bottom: 32px;
  }

  @media (max-width: 640px) {
    .mo-header {
      margin-bottom: 24px;
    }
  }

  .mo-title {
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

  @media (max-width: 480px) {
    .mo-title {
      gap: 8px;
    }
  }

  .mo-subtitle {
    font-size: 13px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .mo-subtitle {
      font-size: 12px;
    }
  }

  /* Filters Section - Mobile Optimized */
  .mo-filters {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .mo-filters {
      padding: 12px;
      margin-bottom: 20px;
    }
  }

  .mo-filter-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  @media (max-width: 640px) {
    .mo-filter-group {
      gap: 6px;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 480px) {
    .mo-filter-group {
      gap: 8px;
    }
  }

  .mo-filter-btn {
    padding: 8px 14px;
    border-radius: 40px;
    font-size: 12px;
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
    .mo-filter-btn {
      padding: 6px 12px;
      font-size: 11px;
      gap: 4px;
    }
  }

  @media (max-width: 480px) {
    .mo-filter-btn {
      padding: 6px 10px;
      font-size: 10px;
    }
  }

  .mo-filter-btn:hover {
    border-color: #16A34A;
    color: #16A34A;
  }

  .mo-filter-btn-active {
    background: #16A34A;
    border-color: #16A34A;
    color: white;
  }

  .mo-filter-btn-active:hover {
    background: #15803D;
    color: white;
  }

  /* Search Box - Mobile Optimized */
  .mo-search-wrapper {
    width: 100%;
    margin-top: 8px;
  }

  .mo-search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #F8FAFC;
    border-radius: 40px;
    border: 1px solid #E2E8F0;
    width: 100%;
  }

  @media (max-width: 640px) {
    .mo-search-box {
      padding: 8px 12px;
    }
  }

  .mo-search-input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-width: 0;
    width: 100%;
  }

  .mo-search-input::placeholder {
    color: #94A3B8;
  }

  /* Loading State */
  .mo-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 12px;
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .mo-spinner {
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
  .mo-empty-state {
    background: white;
    border-radius: 20px;
    padding: 40px 20px;
    text-align: center;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .mo-empty-state {
      padding: 32px 20px;
      border-radius: 16px;
    }
  }

  .mo-empty-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  @media (max-width: 640px) {
    .mo-empty-icon {
      width: 70px;
      height: 70px;
    }
  }

  .mo-empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 8px;
  }

  @media (max-width: 640px) {
    .mo-empty-title {
      font-size: 18px;
    }
  }

  .mo-empty-subtitle {
    font-size: 13px;
    color: #64748B;
  }

  /* Orders Grid */
  .mo-orders-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  @media (max-width: 640px) {
    .mo-orders-grid {
      gap: 16px;
    }
  }

  /* Order Card - Fully Responsive */
  .mo-order-card {
    background: white;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 640px) {
    .mo-order-card {
      border-radius: 16px;
    }
  }

  .mo-order-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.1);
  }

  /* Order Header */
  .mo-order-header {
    background: #F8FAFC;
    padding: 16px 20px;
    border-bottom: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .mo-order-header {
      padding: 14px 16px;
    }
  }

  .mo-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    .mo-header-top {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .mo-order-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .mo-order-info {
      gap: 8px;
    }
  }

  @media (max-width: 480px) {
    .mo-order-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }

  .mo-order-id {
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

  @media (max-width: 640px) {
    .mo-order-id {
      font-size: 12px;
      padding: 3px 8px;
    }
  }

  .mo-order-date {
    font-size: 12px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media (max-width: 640px) {
    .mo-order-date {
      font-size: 11px;
    }
  }

  .mo-order-total {
    display: flex;
    align-items: baseline;
    gap: 4px;
    background: white;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
  }

  .mo-total-label {
    font-size: 11px;
    color: #64748B;
  }

  .mo-total-amount {
    font-size: 16px;
    font-weight: 700;
    color: #16A34A;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  @media (max-width: 640px) {
    .mo-total-amount {
      font-size: 14px;
    }
  }

  /* Status Badge */
  .mo-badge {
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
    .mo-badge {
      align-self: flex-start;
    }
  }

  .mo-badge-pending {
    background: #FFFBEB;
    color: #D97706;
    border: 1px solid #FDE68A;
  }

  .mo-badge-confirmed {
    background: #EFF6FF;
    color: #2563EB;
    border: 1px solid #BFDBFE;
  }

  .mo-badge-processing {
    background: #FEF3C7;
    color: #D97706;
    border: 1px solid #FDE68A;
  }

  .mo-badge-shipped {
    background: #F0FDF4;
    color: #16A34A;
    border: 1px solid #BBF7D0;
  }

  .mo-badge-delivered {
    background: #F0FDF4;
    color: #15803D;
    border: 1px solid #BBF7D0;
  }

  .mo-badge-cancelled {
    background: #FEF2F2;
    color: #DC2626;
    border: 1px solid #FECACA;
  }

  /* Order Body */
  .mo-order-body {
    padding: 20px;
  }

  @media (max-width: 640px) {
    .mo-order-body {
      padding: 16px;
    }
  }

  /* Items List */
  .mo-items-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  @media (max-width: 640px) {
    .mo-items-list {
      gap: 10px;
    }
  }

  /* Order Item - Fully Responsive */
  .mo-order-item {
    background: #F8FAFC;
    border-radius: 14px;
    padding: 14px;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .mo-order-item {
      padding: 12px;
      border-radius: 12px;
    }
  }

  .mo-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .mo-item-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .mo-item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 640px) {
    .mo-item-info {
      width: 100%;
    }
  }

  .mo-item-icon {
    width: 36px;
    height: 36px;
    background: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #16A34A;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .mo-item-icon {
      width: 32px;
      height: 32px;
    }
  }

  .mo-item-details {
    flex: 1;
    min-width: 0;
  }

  .mo-item-name {
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  @media (max-width: 640px) {
    .mo-item-name {
      font-size: 13px;
    }
  }

  .mo-item-meta {
    font-size: 11px;
    color: #64748B;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .mo-item-price {
    text-align: right;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .mo-item-price {
      text-align: left;
      width: 100%;
      padding-left: 48px;
    }
  }

  .mo-item-amount {
    font-size: 15px;
    font-weight: 700;
    color: #16A34A;
    font-family: 'JetBrains Mono', monospace;
  }

  .mo-item-quantity {
    font-size: 11px;
    color: #64748B;
  }

  /* Order Footer */
  .mo-order-footer {
    padding-top: 16px;
    border-top: 1px solid #E2E8F0;
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 640px) {
    .mo-order-footer {
      justify-content: stretch;
    }
  }

  .mo-track-btn {
    padding: 10px 20px;
    background: #F1F5F9;
    color: #334155;
    border: none;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  @media (max-width: 640px) {
    .mo-track-btn {
      flex: 1;
      justify-content: center;
      padding: 10px 16px;
    }
  }

  .mo-track-btn:hover {
    background: #E2E8F0;
    transform: translateY(-1px);
  }

  /* Summary Stats - Responsive */
  .mo-summary-stats {
    margin-top: 24px;
    padding: 16px;
    background: white;
    border-radius: 16px;
    border: 1px solid #E2E8F0;
  }

  @media (max-width: 640px) {
    .mo-summary-stats {
      margin-top: 20px;
      padding: 12px;
    }
  }

  .mo-summary-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  @media (max-width: 640px) {
    .mo-summary-content {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
  }

  .mo-summary-text {
    font-size: 12px;
    color: #64748B;
  }

  .mo-summary-stats-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .mo-summary-stats-group {
      justify-content: space-between;
      gap: 8px;
    }
  }

  .mo-stat-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    padding: 4px 10px;
    background: #F8FAFC;
    border-radius: 20px;
  }
`;

const statusIcons = {
  pending: <Clock size={12} />,
  confirmed: <CheckCircle size={12} />,
  processing: <PackageOpen size={12} />,
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

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    API.get(`/orders/buyer/${user.userId}`)
      .then(res => {
        const data = res.data;
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      })
      .catch(err => {
        console.error(err);
        setOrders([]);
        setFilteredOrders([]);
      })
      .finally(() => setLoading(false));
  }, [user.userId]);

  useEffect(() => {
    let filtered = orders;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchTerm) ||
        order.items?.some(item =>
          item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  }, [activeFilter, searchTerm, orders]);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'mo-badge-pending';
      case 'confirmed': return 'mo-badge-confirmed';
      case 'processing': return 'mo-badge-processing';
      case 'shipped': return 'mo-badge-shipped';
      case 'delivered': return 'mo-badge-delivered';
      case 'cancelled': return 'mo-badge-cancelled';
      default: return 'mo-badge-pending';
    }
  };

  const filters = [
    { value: 'all', label: 'All', icon: <ShoppingBag size={12} /> },
    { value: 'pending', label: 'Pending', icon: <Clock size={12} /> },
    { value: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={12} /> },
    { value: 'shipped', label: 'Shipped', icon: <Truck size={12} /> },
    { value: 'delivered', label: 'Delivered', icon: <Package size={12} /> },
    { value: 'cancelled', label: 'Cancelled', icon: <XCircle size={12} /> }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mo-shell">
          <div className="mo-loading">
            <div className="mo-spinner"></div>
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
      <div className="mo-shell">
        <style>{STYLES}</style>
        <div className="mo-container">
          {/* Header */}
          <div className="mo-header">
            <h1 className="mo-title">
              <ShoppingBag size={28} strokeWidth={1.5} />
              My Orders
            </h1>
            <div className="mo-subtitle">
              <Package size={12} />
              Track and manage your orders from KhetSe
            </div>
          </div>

          {/* Filters */}
          <div className="mo-filters">
            <div className="mo-filter-group">
              {filters.map(filter => (
                <button
                  key={filter.value}
                  className={`mo-filter-btn ${activeFilter === filter.value ? 'mo-filter-btn-active' : ''}`}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="mo-search-wrapper">
              <div className="mo-search-box">
                <Search size={14} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search by order ID or product..."
                  className="mo-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="mo-empty-state">
              <div className="mo-empty-icon">
                <ShoppingBag size={40} strokeWidth={1.5} color="#16A34A" />
              </div>
              <h3 className="mo-empty-title">No orders found</h3>
              <p className="mo-empty-subtitle">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping!"
                  : "No orders match your filters. Try adjusting them."}
              </p>
            </div>
          ) : (
            <>
              <div className="mo-orders-grid">
                {filteredOrders.map(order => (
                  <div key={order.orderId} className="mo-order-card">
                    {/* Order Header */}
                    <div className="mo-order-header">
                      <div className="mo-header-top">
                        <div className="mo-order-info">
                          <div className="mo-order-id">
                            <Package size={12} />
                            #{order.orderId}
                          </div>
                          <div className="mo-order-date">
                            <Calendar size={11} />
                            {new Date(order.createdAt).toLocaleDateString('en-PK', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="mo-order-total">
                            <span className="mo-total-label">Total:</span>
                            <span className="mo-total-amount">
                              <IndianRupee size={11} />
                              {order.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className={`mo-badge ${getStatusBadgeClass(order.status)}`}>
                          {statusIcons[order.status]}
                          {statusLabels[order.status] || order.status}
                        </div>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="mo-order-body">
                      <div className="mo-items-list">
                        {order.items?.map(item => (
                          <div key={item.itemId} className="mo-order-item">
                            <div className="mo-item-content">
                              <div className="mo-item-info">
                                <div className="mo-item-icon">
                                  <PackageOpen size={16} />
                                </div>
                                <div className="mo-item-details">
                                  <div className="mo-item-name">
                                    {item.product?.name || 'Product'}
                                  </div>
                                  <div className="mo-item-meta">
                                    <span>{item.quantityKg} kg</span>
                                    <span>@ Rs. {item.priceAtTime?.toLocaleString()}/kg</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mo-item-price">
                                <div className="mo-item-amount">
                                  Rs. {((item.quantityKg || 0) * (item.priceAtTime || 0)).toLocaleString()}
                                </div>
                                <div className="mo-item-quantity">
                                  {item.quantityKg} kg × Rs. {item.priceAtTime?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="mo-order-footer">
                        <button
                          className="mo-track-btn"
                          onClick={() => window.location.href = `/order-tracking/${order.orderId}`}
                        >
                          <Truck size={12} />
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mo-summary-stats">
                <div className="mo-summary-content">
                  <div className="mo-summary-text">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </div>
                  <div className="mo-summary-stats-group">
                    <div className="mo-stat-chip">
                      <Clock size={10} color="#D97706" />
                      <span>Pending: {orders.filter(o => o.status === 'pending').length}</span>
                    </div>
                    <div className="mo-stat-chip">
                      <Truck size={10} color="#16A34A" />
                      <span>Shipped: {orders.filter(o => o.status === 'shipped').length}</span>
                    </div>
                    <div className="mo-stat-chip">
                      <CheckCircle size={10} color="#15803D" />
                      <span>Delivered: {orders.filter(o => o.status === 'delivered').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}