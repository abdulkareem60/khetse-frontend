import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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

  try {
    const res = await API.post('/auth/login', form);

    const response = res.data;

    if (response.includes('Login successful')) {

      const roleMatch = response.match(/Role: (\w+)/);
      const idMatch = response.match(/ID: (\d+)/);

      const role = roleMatch
        ? roleMatch[1].toLowerCase()
        : '';

      const userId = idMatch
        ? parseInt(idMatch[1])
        : null;

      login({
        userId,
        role,
        email: form.email,
      });

      if (role === 'farmer') {
        navigate('/farmer-dashboard');

      } else if (role === 'admin') {
        navigate('/admin');

      } else {
        navigate('/products');
      }

    } else {
      setError(response);
    }

  } catch (err) {

    setError(
      err.response?.data ||
      'Something went wrong. Is the backend running?'
    );

  } finally {
    setLoading(false);
  }
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

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow-x: hidden;
          font-family: 'Nunito Sans', sans-serif;
          background: #ffffff;
        }

        .login-left {
          position: relative;
          overflow: hidden;
          background: #081c15;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 50px;
        }

        .login-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1400&auto=format');
          background-size: cover;
          background-position: center;
          opacity: 0.15;
        }

        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(5,20,10,0.95),
            rgba(8,40,20,0.92)
          );
        }

        .login-left-content {
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

        .login-left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 62px);
          line-height: 1.08;
          color: #ffffff;
          margin-bottom: 24px;
        }

        .login-left-content h2 em {
          color: #52b788;
          font-style: italic;
        }

        .login-left-content p {
          color: rgba(255,255,255,0.7);
          line-height: 1.9;
          font-size: 16px;
        }

        .login-stat-row {
          margin-top: 70px;
          display: flex;
          gap: 52px;
          flex-wrap: wrap;
        }

        .login-stat p:first-child {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }

        .login-stat p:last-child {
          color: rgba(255,255,255,0.55);
          font-size: 13px;
        }

        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 40px;
          overflow-y: auto;
          background: #fff;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 430px;
        }

        .badge {
          font-size: 11px;
          letter-spacing: 3px;
          color: #52b788;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .login-form-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #111827;
          margin-bottom: 12px;
        }

        .login-form-header p {
          color: #6b7280;
          margin-bottom: 32px;
        }

        .login-error {
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          color: #dc2626;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .login-field {
          margin-bottom: 22px;
        }

        .login-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #374151;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-wrap input {
          width: 100%;
          height: 54px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 14px;
          outline: none;
        }

        .login-input-wrap input:focus {
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

        .login-submit {
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

        .login-submit:hover {
          background: #18462f;
        }

        .login-footer {
          text-align: center;
          margin-top: 26px;
          color: #6b7280;
        }

        .login-footer a {
          color: #123524;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 992px) {
          .login-root {
            grid-template-columns: 1fr;
          }

          .login-left {
            display: none;
          }

          .login-right {
            min-height: 100vh;
            padding: 120px 22px 40px;
            align-items: flex-start;
          }

          .login-form-wrap {
            max-width: 100%;
          }
        }

        @media (max-width: 576px) {
          .login-right {
            padding: 110px 18px 30px;
          }

          .login-form-header h1 {
            font-size: 30px;
          }
        }
      `}</style>

      <div className="login-root">

        <div className="login-left">
          <div className="login-left-bg"></div>
          <div className="login-left-overlay"></div>

          <div className="login-left-content">
            <div className="divider"></div>

            <h2>
              Honest trade,
              <br />
              <em>straight from</em>
              <br />
              the field.
            </h2>

            <p>
              Pakistan's first direct farm marketplace connecting
              growers and buyers without middlemen.
            </p>

            <div className="login-stat-row">
              <div className="login-stat">
                <p>2,400+</p>
                <p>Farmers</p>
              </div>

              <div className="login-stat">
                <p>18,000+</p>
                <p>Orders</p>
              </div>

              <div className="login-stat">
                <p>0%</p>
                <p>Commission</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">

          <div className="login-form-wrap">

            <div className="login-form-header">
              <div className="badge">WELCOME BACK</div>

              <h1>Sign in to KhetSe</h1>

              <p>Enter your credentials to access your account.</p>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="login-field">
                <label>Email Address</label>

                <div className="login-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Password</label>

                <div className="login-input-wrap has-toggle">

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

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

            </form>

            <div className="login-footer">
              Don't have an account?{' '}
              <Link to="/register">
                Create one
              </Link>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}