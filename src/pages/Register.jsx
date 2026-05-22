import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    city: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await API.post('/auth/register', form);

      if (res.data.includes('successfully')) {
        setMessage('Registered successfully! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.data);
      }
    } catch {
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow-x: hidden;
          font-family: 'Nunito Sans', sans-serif;
          background: #ffffff;
        }

        /* LEFT SIDE */

        .register-left {
          position: relative;
          overflow: hidden;
          background: #081c15;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 50px;
        }

        .register-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1400&auto=format');
          background-size: cover;
          background-position: center;
          opacity: 0.15;
        }

        .register-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(5,20,10,0.95),
            rgba(8,40,20,0.92)
          );
        }

        .register-left-content {
          position: relative;
          z-index: 2;
          max-width: 500px;
          width: 100%;
        }

        .divider {
          width: 52px;
          height: 4px;
          background: #52b788;
          border-radius: 20px;
          margin-bottom: 28px;
        }

        .register-left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 62px);
          line-height: 1.08;
          color: #ffffff;
          margin-bottom: 24px;
        }

        .register-left-content h2 em {
          color: #52b788;
          font-style: italic;
        }

        .register-left-content p {
          color: rgba(255,255,255,0.7);
          line-height: 1.9;
          font-size: 16px;
        }

        .register-stat-row {
          margin-top: 70px;
          display: flex;
          gap: 52px;
          flex-wrap: wrap;
        }

        .register-stat p:first-child {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }

        .register-stat p:last-child {
          color: rgba(255,255,255,0.55);
          font-size: 13px;
        }

        /* RIGHT SIDE */

        .register-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 40px;
          overflow-y: auto;
          background: #fff;
        }

        .register-form-wrap {
          width: 100%;
          max-width: 480px;
        }

        .badge {
          font-size: 11px;
          letter-spacing: 3px;
          color: #52b788;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .register-form-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #111827;
          margin-bottom: 12px;
        }

        .register-form-header p {
          color: #6b7280;
          margin-bottom: 32px;
        }

        .alert {
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 22px;
        }

        .alert-success {
          background: #ecfdf5;
          border-left: 4px solid #10b981;
          color: #047857;
        }

        .alert-error {
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          color: #dc2626;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #374151;
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap input,
        .input-wrap select {
          width: 100%;
          height: 54px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 14px;
          outline: none;
          background: #fff;
        }

        .input-wrap input:focus,
        .input-wrap select:focus {
          border-color: #52b788;
          box-shadow: 0 0 0 4px rgba(82,183,136,0.12);
        }

        .has-toggle input {
          padding-right: 52px;
        }

        .toggle-pw {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .register-submit {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 999px;
          background: #123524;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
        }

        .register-submit:hover {
          background: #18462f;
        }

        .register-footer {
          text-align: center;
          margin-top: 26px;
          color: #6b7280;
        }

        .register-footer a {
          color: #123524;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 992px) {

          .register-root {
            grid-template-columns: 1fr;
          }

          .register-left {
            display: none;
          }

          .register-right {
            min-height: 100vh;
            padding: 120px 22px 40px;
            align-items: flex-start;
          }

          .register-form-wrap {
            max-width: 100%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-width {
            grid-column: span 1;
          }
        }

        @media (max-width: 576px) {

          .register-right {
            padding: 110px 18px 30px;
          }

          .register-form-header h1 {
            font-size: 30px;
          }
        }
      `}</style>

      <div className="register-root">

        {/* LEFT SIDE */}

        <div className="register-left">

          <div className="register-left-bg"></div>

          <div className="register-left-overlay"></div>

          <div className="register-left-content">

            <div className="divider"></div>

            <h2>
              Grow your business,
              <br />
              <em>connect directly</em>
              <br />
              with buyers.
            </h2>

            <p>
              Join Pakistan’s modern agriculture marketplace and
              sell fresh produce directly without middlemen.
            </p>

            <div className="register-stat-row">

              <div className="register-stat">
                <p>2,400+</p>
                <p>Farmers</p>
              </div>

              <div className="register-stat">
                <p>18,000+</p>
                <p>Orders</p>
              </div>

              <div className="register-stat">
                <p>24/7</p>
                <p>Marketplace</p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="register-right">

          <div className="register-form-wrap">

            <div className="register-form-header">

              <div className="badge">CREATE ACCOUNT</div>

              <h1>Join KhetSe</h1>

              <p>
                Create your account and start trading directly
                from the farm.
              </p>

            </div>

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>Full Name</label>

                  <div className="input-wrap">
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Ahmed Khan"
                      required
                    />
                  </div>

                </div>

                <div className="form-group full-width">

                  <label>Email Address</label>

                  <div className="input-wrap">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ahmed@example.com"
                      required
                    />
                  </div>

                </div>

                <div className="form-group full-width">

                  <label>Password</label>

                  <div className="input-wrap has-toggle">

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />

                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      👁️
                    </button>

                  </div>

                </div>

                <div className="form-group">

                  <label>Phone</label>

                  <div className="input-wrap">
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="03001234567"
                    />
                  </div>

                </div>

                <div className="form-group">

                  <label>City</label>

                  <div className="input-wrap">
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Multan"
                    />
                  </div>

                </div>

                <div className="form-group full-width">

                  <label>I am a</label>

                  <div className="input-wrap">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="farmer">Farmer</option>
                    </select>
                  </div>

                </div>

              </div>

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

            </form>

            <div className="register-footer">
              Already have an account?{' '}
              <Link to="/login">
                Login
              </Link>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}