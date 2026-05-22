import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PlaceOrder() {

  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    API.get(`/products/${productId}`)
      .then(res => setProduct(res.data));

  }, [productId]);

  const total =
    product
      ? (product.pricePerKg * quantity).toFixed(2)
      : 0;

  const handleOrder = async e => {

    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {

      const res = await API.post('/orders/place', {
        buyerId: user.userId,
        productId: parseInt(productId),
        quantityKg: parseFloat(quantity),
        paymentMethod
      });

      if (res.data.includes('successfully')) {

        setMessage('Order placed successfully! Redirecting...');

        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);

      } else {
        setError(res.data);
      }

    } catch {

      setError('Failed to place order.');

    }

    setLoading(false);
  };

  if (!product) {
    return (
      <div className="po-loading-screen">
        <div className="po-spinner"></div>
        <p>Loading product...</p>

        <style>{`

          .po-loading-screen{
            min-height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:16px;
            background:#F5F3EE;
            font-family:sans-serif;
          }

          .po-spinner{
            width:42px;
            height:42px;
            border:4px solid #ddd;
            border-top-color:#52B788;
            border-radius:50%;
            animation:spin .8s linear infinite;
          }

          @keyframes spin{
            to{
              transform:rotate(360deg);
            }
          }

        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap');

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          overflow-x:hidden;
        }

        .po-root{
          min-height:100vh;
          background:#F5F3EE;
          font-family:'Nunito Sans',sans-serif;
          padding:120px 20px 60px;
        }

        .po-container{
          max-width:1180px;
          margin:auto;

          display:grid;
          grid-template-columns:1.05fr .95fr;
          gap:34px;
        }

        /* LEFT */

        .po-left{
          background:#fff;
          border-radius:24px;
          overflow:hidden;
          border:1px solid #ECE7DD;
          box-shadow:0 10px 30px rgba(0,0,0,0.04);
        }

        .po-image{
          position:relative;
          height:340px;
          overflow:hidden;
        }

        .po-image img{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .po-image::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(
            to top,
            rgba(0,0,0,.4),
            rgba(0,0,0,.05)
          );
        }

        .po-badge{
          position:absolute;
          top:18px;
          left:18px;
          z-index:2;

          background:#123524;
          color:#D8F3DC;

          padding:7px 15px;
          border-radius:999px;

          font-size:11px;
          font-weight:700;
          letter-spacing:.5px;
        }

        .po-content{
          padding:28px;
        }

        .po-title{
          font-family:'Playfair Display',serif;
          font-size:38px;
          line-height:1.1;
          color:#111827;
          margin-bottom:10px;
        }

        .po-desc{
          color:#6B7280;
          line-height:1.8;
          margin-bottom:24px;
          font-size:15px;
        }

        .po-meta{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
          margin-bottom:26px;
        }

        .po-meta-card{
          background:#F8F7F3;
          border:1px solid #ECE7DD;
          border-radius:18px;
          padding:18px;
        }

        .po-meta-label{
          font-size:11px;
          font-weight:700;
          letter-spacing:1px;
          color:#9CA3AF;
          margin-bottom:8px;
        }

        .po-price{
          font-size:30px;
          font-family:'Playfair Display',serif;
          color:#123524;
        }

        .po-stock{
          font-size:16px;
          font-weight:700;
          color:#047857;
        }

        .po-farmer{
          display:flex;
          align-items:center;
          gap:14px;

          padding:18px;
          border-radius:18px;

          background:#F8F7F3;
          border:1px solid #ECE7DD;
        }

        .po-avatar{
          width:50px;
          height:50px;
          border-radius:50%;
          background:#123524;
          color:#fff;

          display:flex;
          align-items:center;
          justify-content:center;

          font-size:16px;
          font-weight:700;
        }

        .po-farmer-name{
          font-size:15px;
          font-weight:700;
          color:#111827;
        }

        .po-farmer-city{
          font-size:13px;
          color:#6B7280;
        }

        /* RIGHT */

        .po-right{
          background:#fff;
          border-radius:24px;
          padding:34px;
          border:1px solid #ECE7DD;
          box-shadow:0 10px 30px rgba(0,0,0,0.04);

          height:fit-content;
          position:sticky;
          top:100px;
        }

        .po-form-badge{
          display:inline-block;
          margin-bottom:12px;

          color:#52B788;
          font-size:11px;
          font-weight:700;
          letter-spacing:3px;
        }

        .po-right h2{
          font-family:'Playfair Display',serif;
          font-size:38px;
          margin-bottom:10px;
          color:#111827;
        }

        .po-right-sub{
          color:#6B7280;
          margin-bottom:30px;
          line-height:1.7;
        }

        .po-alert{
          padding:14px 16px;
          border-radius:14px;
          margin-bottom:20px;
          font-size:14px;
          font-weight:600;
        }

        .po-success{
          background:#ECFDF5;
          color:#047857;
          border-left:4px solid #10B981;
        }

        .po-error{
          background:#FEF2F2;
          color:#DC2626;
          border-left:4px solid #DC2626;
        }

        .po-group{
          margin-bottom:22px;
        }

        .po-group label{
          display:block;
          margin-bottom:10px;

          font-size:13px;
          font-weight:700;
          color:#374151;
        }

        .po-group input,
        .po-group select{
          width:100%;
          height:54px;

          border-radius:16px;
          border:1.5px solid #E5E7EB;

          padding:0 16px;

          font-size:14px;
          outline:none;
          background:#fff;
        }

        .po-group input:focus,
        .po-group select:focus{
          border-color:#52B788;
          box-shadow:0 0 0 4px rgba(82,183,136,.12);
        }

        /* BANK BOX */

        .po-bank-box{
          background:#F8F7F3;
          border:1px solid #DDE7DD;
          border-left:4px solid #52B788;
          border-radius:18px;
          padding:20px;
          margin-bottom:24px;
        }

        .po-bank-box h4{
          font-size:16px;
          color:#123524;
          margin-bottom:16px;
          font-weight:700;
        }

        .po-bank-row{
          display:flex;
          justify-content:space-between;
          gap:20px;
          padding:10px 0;
          border-bottom:1px solid #E5E7EB;
        }

        .po-bank-row:last-of-type{
          border-bottom:none;
        }

        .po-bank-row span{
          color:#6B7280;
          font-size:14px;
        }

        .po-bank-row strong{
          color:#111827;
          font-size:14px;
        }

        .po-bank-note{
          margin-top:16px;
          font-size:13px;
          line-height:1.6;
          color:#6B7280;
        }

        /* SUMMARY */

        .po-summary{
          background:#F8F7F3;
          border:1px solid #ECE7DD;
          border-radius:18px;

          padding:22px;
          margin-bottom:24px;
        }

        .po-summary-row{
          display:flex;
          justify-content:space-between;
          margin-bottom:12px;
        }

        .po-summary-row:last-child{
          margin-bottom:0;
          padding-top:14px;
          border-top:1px solid #E5E7EB;
        }

        .po-summary-label{
          color:#6B7280;
          font-size:14px;
        }

        .po-summary-value{
          font-weight:700;
          color:#111827;
        }

        .po-total{
          font-size:26px;
          color:#123524;
          font-family:'Playfair Display',serif;
        }

        .po-btn{
          width:100%;
          height:58px;

          border:none;
          border-radius:16px;

          background:#123524;
          color:#fff;

          font-size:15px;
          font-weight:700;

          cursor:pointer;
          transition:.25s ease;
        }

        .po-btn:hover{
          background:#18462F;
          transform:translateY(-2px);
        }

        .po-btn:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        /* RESPONSIVE */

        @media(max-width:1000px){

          .po-container{
            grid-template-columns:1fr;
          }

          .po-right{
            position:static;
          }
        }

        @media(max-width:768px){

          .po-root{
            padding:100px 16px 40px;
          }

          .po-content,
          .po-right{
            padding:22px;
          }

          .po-title{
            font-size:30px;
          }

          .po-right h2{
            font-size:30px;
          }

          .po-image{
            height:240px;
          }

          .po-meta{
            grid-template-columns:1fr;
          }

          .po-bank-row{
            flex-direction:column;
            gap:6px;
          }
        }

      `}</style>

      <div className="po-root">

        <div className="po-container">

          {/* LEFT */}

          <div className="po-left">

            <div className="po-image">

              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format"
                alt={product.name}
              />

              <div className="po-badge">
                Fresh Produce
              </div>

            </div>

            <div className="po-content">

              <h1 className="po-title">
                {product.name}
              </h1>

              <p className="po-desc">
                {product.description ||
                  'Fresh farm produce directly sourced from local Pakistani farmers.'}
              </p>

              <div className="po-meta">

                <div className="po-meta-card">

                  <div className="po-meta-label">
                    PRICE
                  </div>

                  <div className="po-price">
                    Rs. {product.pricePerKg}
                    <span style={{
                      fontSize:'14px',
                      color:'#6B7280',
                      marginLeft:'4px'
                    }}>
                      / kg
                    </span>
                  </div>

                </div>

                <div className="po-meta-card">

                  <div className="po-meta-label">
                    AVAILABLE STOCK
                  </div>

                  <div className="po-stock">
                    {product.stockKg} KG Available
                  </div>

                </div>

              </div>

              <div className="po-farmer">

                <div className="po-avatar">

                  {product.farmer?.fullName
                    ?.split(' ')
                    .map(w => w[0])
                    .slice(0,2)
                    .join('')
                    .toUpperCase()
                  }

                </div>

                <div>

                  <div className="po-farmer-name">
                    {product.farmer?.fullName}
                  </div>

                  <div className="po-farmer-city">
                    {product.farmer?.city}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="po-right">

            <div className="po-form-badge">
              PLACE ORDER
            </div>

            <h2>Complete Purchase</h2>

            <p className="po-right-sub">
              Confirm quantity and payment method
              to place your order directly from
              the farmer.
            </p>

            {message && (
              <div className="po-alert po-success">
                {message}
              </div>
            )}

            {error && (
              <div className="po-alert po-error">
                {error}
              </div>
            )}

            <form onSubmit={handleOrder}>

              {/* QUANTITY */}

              <div className="po-group">

                <label>
                  Quantity (KG)
                </label>

                <input
                  type="number"
                  min="1"
                  max={product.stockKg}
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  required
                />

              </div>

              {/* PAYMENT */}

              <div className="po-group">

                <label>
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >

                  <option value="cod">
                    Cash on Delivery
                  </option>

                  <option value="easypaisa">
                    Easypaisa
                  </option>

                  <option value="jazzcash">
                    JazzCash
                  </option>

                  <option value="bank">
                    Bank Transfer
                  </option>

                </select>

              </div>

              {/* BANK DETAILS */}

              {paymentMethod === 'bank' && (
                <div className="po-bank-box">

                  <h4>
                    Bank Transfer Details
                  </h4>

                  <div className="po-bank-row">
                    <span>Bank Name</span>
                    <strong>Bank ALFalah</strong>
                  </div>

                  <div className="po-bank-row">
                    <span>Account Title</span>
                    <strong>KhetSe Pvt Ltd</strong>
                  </div>

                  <div className="po-bank-row">
                    <span>Account Number</span>
                    <strong>45576798099</strong>
                  </div>

                  <div className="po-bank-row">
                    <span>IBAN</span>
                    <strong>PK36HABB0045576798099</strong>
                  </div>

                  <p className="po-bank-note">
                    After payment, please keep the transaction screenshot or receipt for verification.
                  </p>

                </div>
              )}

              {/* SUMMARY */}

              <div className="po-summary">

                <div className="po-summary-row">

                  <span className="po-summary-label">
                    Product
                  </span>

                  <span className="po-summary-value">
                    {product.name}
                  </span>

                </div>

                <div className="po-summary-row">

                  <span className="po-summary-label">
                    Quantity
                  </span>

                  <span className="po-summary-value">
                    {quantity} KG
                  </span>

                </div>

                <div className="po-summary-row">

                  <span className="po-summary-label">
                    Total
                  </span>

                  <span className="po-total">
                    Rs. {total}
                  </span>

                </div>

              </div>

              <button
                className="po-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Placing Order...'
                  : 'Confirm Order'}
              </button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}