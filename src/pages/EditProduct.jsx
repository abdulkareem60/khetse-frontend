import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EditProduct() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerKg: '',
    stockKg: '',
    unit: 'kg',
    categoryId: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${productId}`);
      const p = res.data;
      setForm({
        name: p.name || '',
        description: p.description || '',
        pricePerKg: p.pricePerKg || '',
        stockKg: p.stockKg || '',
        unit: p.unit || 'kg',
        categoryId: p.category?.categoryId || ''
      });
    } catch {
      setError('Failed to load product details.');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/all');
      setCategories(res.data);
    } catch { }
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await API.put(`/products/update/${productId}`, {
        ...form,
        farmerId: user.userId,
        categoryId: parseInt(form.categoryId),
        pricePerKg: parseFloat(form.pricePerKg),
        stockKg: parseFloat(form.stockKg)
      });
      if (res.data.includes('successfully')) {
        setMessage('Product updated successfully! Redirecting...');
        setTimeout(() => navigate('/my-products'), 1500);
      } else {
        setError(res.data);
      }
    } catch {
      setError('Failed to update product.');
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;

  return (
    <div className="form-card" style={{ maxWidth: '560px' }}>
      <h2>Edit Product</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Fresh Tomatoes"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your product..."
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Price per kg (Rs.)</label>
          <input
            name="pricePerKg"
            type="number"
            value={form.pricePerKg}
            onChange={handleChange}
            required
            placeholder="80"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Stock Available (kg)</label>
          <input
            name="stockKg"
            type="number"
            value={form.stockKg}
            onChange={handleChange}
            required
            placeholder="500"
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-green" type="submit" style={{ flex: 1 }}>
            Save Changes
          </button>
          <button
            className="btn btn-outline"
            type="button"
            style={{ flex: 1 }}
            onClick={() => navigate('/my-products')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}