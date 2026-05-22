import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProductImages from '../components/ProductImages';
import {
  Package, Plus, Edit2, Trash2, TrendingUp,
  Sprout, ChevronRight, AlertCircle, CheckCircle2,
  Grid3x3, List, Layers, Weight, IndianRupee,
  Store, BarChart3, Leaf
} from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .mp-shell {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    min-height: 100vh;
  }

  .mp-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 100px 32px 60px;
  }

  @media (max-width: 768px) {
    .mp-container {
      padding: 90px 20px 40px;
    }
  }

  @media (max-width: 480px) {
    .mp-container {
      padding: 80px 16px 32px;
    }
  }

  /* Header Section */
  .mp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 24px;
  }

  .mp-title-section h1 {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mp-subtitle {
    font-size: 14px;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mp-add-btn {
    background: linear-gradient(135deg, #16A34A 0%, #15803D 100%);
    color: white;
    padding: 12px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    text-decoration: none;
  }

  .mp-add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
  }

  /* Alert Messages */
  .mp-alert {
    padding: 14px 20px;
    border-radius: 14px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
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

  .mp-alert-success {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    color: #15803D;
  }

  .mp-alert-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #DC2626;
  }

  /* Loading Spinner */
  .mp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 12px;
  }

  .mp-spinner {
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
  .mp-empty-state {
    background: white;
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    border: 1px solid #E2E8F0;
  }

  .mp-empty-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  .mp-empty-title {
    font-size: 24px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 12px;
  }

  .mp-empty-subtitle {
    font-size: 14px;
    color: #64748B;
    margin-bottom: 28px;
  }

  .mp-empty-btn {
    background: #16A34A;
    color: white;
    padding: 12px 32px;
    border-radius: 40px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    text-decoration: none;
  }

  .mp-empty-btn:hover {
    background: #15803D;
    transform: translateY(-2px);
  }

  /* Products Grid */
  .mp-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
    margin-bottom: 48px;
  }

  @media (max-width: 768px) {
    .mp-products-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
  }

  .mp-product-card {
    background: white;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mp-product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);
    border-color: #BBF7D0;
  }

  .mp-product-images {
    padding: 16px 16px 0 16px;
  }

  .mp-category-badge {
    padding: 0 20px;
    margin-bottom: 12px;
  }

  .mp-category-tag {
    background: rgba(34, 197, 94, 0.1);
    color: #166534;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .mp-product-content {
    padding: 0 20px 20px 20px;
  }

  .mp-product-title {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 8px;
  }

  .mp-product-desc {
    font-size: 13px;
    color: #64748B;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .mp-price-stock {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-top: 1px solid #F1F5F9;
    border-bottom: 1px solid #F1F5F9;
    margin-bottom: 16px;
  }

  .mp-price-box,
  .mp-stock-box {
    flex: 1;
  }

  .mp-price-label,
  .mp-stock-label {
    font-size: 11px;
    color: #94A3B8;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mp-price-value {
    font-size: 24px;
    font-weight: 700;
    color: #16A34A;
    font-family: 'JetBrains Mono', monospace;
  }

  .mp-stock-value {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    font-family: 'JetBrains Mono', monospace;
  }

  .mp-product-actions {
    display: flex;
    gap: 12px;
  }

  .mp-edit-btn,
  .mp-delete-btn {
    flex: 1;
    padding: 10px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .mp-edit-btn {
    background: #F1F5F9;
    color: #334155;
    border: none;
  }

  .mp-edit-btn:hover {
    background: #E2E8F0;
    transform: translateY(-1px);
  }

  .mp-delete-btn {
    background: transparent;
    color: #DC2626;
    border: 1.5px solid #FEE2E2;
  }

  .mp-delete-btn:hover {
    background: #FEF2F2;
    border-color: #FCA5A5;
    transform: translateY(-1px);
  }

  /* Stats Summary */
  .mp-stats-summary {
    margin-top: 48px;
    padding: 28px 32px;
    background: white;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }

  .mp-stats-group {
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .mp-stats-group {
      gap: 24px;
    }
  }

  .mp-stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mp-stat-icon {
    width: 48px;
    height: 48px;
    background: #F0FDF4;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #16A34A;
  }

  .mp-stat-info p:first-child {
    font-size: 11px;
    color: #94A3B8;
    margin-bottom: 4px;
  }

  .mp-stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }

  .mp-add-more-btn {
    background: #F1F5F9;
    color: #334155;
    padding: 10px 24px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    text-decoration: none;
  }

  .mp-add-more-btn:hover {
    background: #E2E8F0;
    transform: translateY(-1px);
  }
`;

export default function MyProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
    // eslint-disable-next-line
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await API.get(`/products/farmer/${user.userId}`);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/delete/${productId}`);
      setMessage('Product deleted successfully!');
      setError('');
      fetchMyProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const totalStock = products.reduce((sum, p) => sum + (p.stockKg || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.pricePerKg || 0) * (p.stockKg || 0)), 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mp-shell">
          <div className="mp-loading">
            <div className="mp-spinner"></div>
            <span style={{ color: '#64748B' }}>Loading your products...</span>
          </div>
        </div>
        <style>{STYLES}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mp-shell">
        <style>{STYLES}</style>
        <div className="mp-container">
          {/* Header */}
          <div className="mp-header">
            <div className="mp-title-section">
              <h1>
                <Package size={32} strokeWidth={1.5} />
                My Products
              </h1>
              <div className="mp-subtitle">
                <Store size={14} />
                Manage your farm products listed on KhetSe
              </div>
            </div>
            <Link to="/add-product" className="mp-add-btn">
              <Plus size={16} /> Add Product
            </Link>
          </div>

          {/* Messages */}
          {message && (
            <div className="mp-alert mp-alert-success">
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          {error && (
            <div className="mp-alert mp-alert-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Products Grid or Empty State */}
          {products.length === 0 ? (
            <div className="mp-empty-state">
              <div className="mp-empty-icon">
                <Sprout size={48} strokeWidth={1.5} color="#16A34A" />
              </div>
              <h3 className="mp-empty-title">No products yet</h3>
              <p className="mp-empty-subtitle">
                Start by adding your first product to KhetSe marketplace
              </p>
              <Link to="/add-product" className="mp-empty-btn">
                <Plus size={16} /> Add Your First Product
              </Link>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="mp-products-grid">
                {products.map(product => (
                  <div key={product.productId} className="mp-product-card">
                    {/* Product Images */}
                    <div className="mp-product-images">
                      <ProductImages
                        productId={product.productId}
                        editable={true}
                        onDelete={() => fetchMyProducts()}
                      />
                    </div>

                    {/* Category Badge */}
                    {product.category && (
                      <div className="mp-category-badge">
                        <span className="mp-category-tag">
                          <Layers size={10} />
                          {product.category.name}
                        </span>
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="mp-product-content">
                      <h3 className="mp-product-title">{product.name}</h3>

                      {product.description && (
                        <p className="mp-product-desc">
                          {product.description.length > 100
                            ? product.description.substring(0, 100) + '...'
                            : product.description}
                        </p>
                      )}

                      {/* Price & Stock */}
                      <div className="mp-price-stock">
                        <div className="mp-price-box">
                          <div className="mp-price-label">
                            <IndianRupee size={10} /> Price per kg
                          </div>
                          <div className="mp-price-value">
                            Rs. {product.pricePerKg?.toLocaleString()}
                          </div>
                        </div>
                        <div className="mp-stock-box">
                          <div className="mp-stock-label">
                            <Weight size={10} /> Available stock
                          </div>
                          <div className="mp-stock-value">
                            {product.stockKg?.toLocaleString()} kg
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mp-product-actions">
                        <button
                          onClick={() => navigate(`/edit-product/${product.productId}`)}
                          className="mp-edit-btn"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="mp-delete-btn"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <div className="mp-stats-summary">
                <div className="mp-stats-group">
                  <div className="mp-stat-item">
                    <div className="mp-stat-icon">
                      <BarChart3 size={22} />
                    </div>
                    <div className="mp-stat-info">
                      <p>Total Products</p>
                      <div className="mp-stat-number">{products.length}</div>
                    </div>
                  </div>

                  <div className="mp-stat-item">
                    <div className="mp-stat-icon">
                      <Weight size={22} />
                    </div>
                    <div className="mp-stat-info">
                      <p>Total Stock</p>
                      <div className="mp-stat-number">{totalStock.toLocaleString()} kg</div>
                    </div>
                  </div>

                  <div className="mp-stat-item">
                    <div className="mp-stat-icon">
                      <IndianRupee size={22} />
                    </div>
                    <div className="mp-stat-info">
                      <p>Total Value</p>
                      <div className="mp-stat-number">Rs. {totalValue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <Link to="/add-product" className="mp-add-more-btn">
                  <Plus size={14} /> Add Another Product
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}