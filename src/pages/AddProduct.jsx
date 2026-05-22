import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const MAX_IMAGES = 3;

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerKg: '',
    stockKg: '',
    unit: 'kg',
    categoryId: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [imageError, setImageError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState('');

  const galleryRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    API.get('/categories/all').then((res) => setCategories(res.data));
  }, []);

  // IMAGE HANDLING

  const handleFiles = async (selected) => {
    setImageError('');

    const incoming = Array.from(selected);

    const invalid = incoming.find(
      (f) => !ALLOWED_TYPES.includes(f.type)
    );

    if (invalid) {
      setImageError(
        `"${invalid.name}" supported nahi hai. Sirf JPG, PNG ya WEBP use karein.`
      );
      return;
    }

    if (imageFiles.length + incoming.length > MAX_IMAGES) {
      setImageError(
        `Sirf ${MAX_IMAGES} tasveerein upload ho sakti hain.`
      );
      return;
    }

    setCompressing(true);

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressed = [];
    const previews = [];

    for (const file of incoming) {
      try {
        const comp = await imageCompression(file, options);
        compressed.push(comp);
        previews.push(URL.createObjectURL(comp));
      } catch {
        compressed.push(file);
        previews.push(URL.createObjectURL(file));
      }
    }

    setCompressing(false);

    setImageFiles((prev) => [...prev, ...compressed]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // FORM CHANGE

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (imageFiles.length === 0) {
      setImageError(
        'Kam az kam ek tasveer upload karna zaroori hai.'
      );
      return;
    }

    setSubmitting(true);

    try {
      setCurrentStep('saving');

      const res = await API.post('/products/add', {
        ...form,
        farmerId: user.userId,
        categoryId: parseInt(form.categoryId),
        pricePerKg: parseFloat(form.pricePerKg),
        stockKg: parseFloat(form.stockKg),
      });

      if (!res.data.includes('successfully')) {
        setError(res.data);
        setSubmitting(false);
        return;
      }

      const idMatch = res.data.match(/ID: (\d+)/);

      const productId = idMatch
        ? parseInt(idMatch[1])
        : null;

      if (!productId) {
        setError('Product ID nahi mili.');
        setSubmitting(false);
        return;
      }

      setCurrentStep('uploading');

      const formData = new FormData();

      imageFiles.forEach((f) =>
        formData.append('files', f)
      );

      await API.post(
        `/images/upload/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },

          onUploadProgress: (e) => {
            const pct = Math.round(
              (e.loaded * 100) / e.total
            );

            setUploadProgress(pct);
          },
        }
      );

      setCurrentStep('done');

      setTimeout(() => {
        navigate('/my-products');
      }, 1500);

    } catch {
      setError('Kuch masla hua. Dobara try karein.');
      setSubmitting(false);
      setCurrentStep('');
    }
  };

  const canAddMore = imageFiles.length < MAX_IMAGES;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F3ED',
        paddingTop: 'clamp(72px, 9vw, 90px)',
        paddingBottom: '60px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >

        {/* HEADER */}

        <div style={{ marginBottom: '30px' }}>
          <h1
            style={{
              fontSize: '34px',
              fontWeight: '800',
              color: '#173404',
              marginBottom: '10px',
              fontFamily: 'Georgia, serif',
            }}
          >
            Add New Product
          </h1>

          <p
            style={{
              color: '#7A766D',
              fontSize: '15px',
            }}
          >
            Apni fasal ki details aur tasveer upload karein
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* PRODUCT DETAILS */}

          <div style={cardStyle}>
            <h2 style={headingStyle}>
              Product Details
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Product Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Fresh Tomatoes"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Apne product ke baare mein likhein..."
                style={textareaStyle}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Category
              </label>

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">
                  Category select karein
                </option>

                {categories.map((c) => (
                  <option
                    key={c.categoryId}
                    value={c.categoryId}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
              }}
            >
              <div>
                <label style={labelStyle}>
                  Price (Rs.)
                </label>

                <input
                  name="pricePerKg"
                  type="number"
                  value={form.pricePerKg}
                  onChange={handleChange}
                  required
                  placeholder="80"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Stock
                </label>

                <input
                  name="stockKg"
                  type="number"
                  value={form.stockKg}
                  onChange={handleChange}
                  required
                  placeholder="500"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Unit
                </label>

                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="kg">kg</option>
                  <option value="litre">Litre</option>
                  <option value="dozen">Dozen</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
            </div>
          </div>

          {/* IMAGE SECTION */}

          <div
            style={{
              ...cardStyle,
              border: imageError
                ? '1.5px solid #E8B6B6'
                : '1px solid #E8E0D3',
            }}
          >
            <h2 style={headingStyle}>
              Product Photos
            </h2>

            <p
              style={{
                color: '#7A766D',
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              Maximum {MAX_IMAGES} photos upload karein
            </p>

            {canAddMore && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(320px,100%),  1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >

                {/* GALLERY */}

                <button
                  type="button"
                  onClick={() =>
                    galleryRef.current.click()
                  }
                  style={uploadCardStyle}
                >
                  <div style={iconBox}>
                    <img
                      src="/images/gallery.png"
                      alt=""
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  <span style={uploadTitle}>
                    Gallery
                  </span>

                  <span style={uploadSub}>
                    Photos select karein
                  </span>
                </button>

                {/* CAMERA */}

                <button
                  type="button"
                  onClick={() =>
                    cameraRef.current.click()
                  }
                  style={uploadCardStyle}
                >
                  <div style={iconBox}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                      alt=""
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  <span style={uploadTitle}>
                    Camera
                  </span>

                  <span style={uploadSub}>
                    Live photo lein
                  </span>
                </button>
              </div>
            )}

            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) =>
                handleFiles(e.target.files)
              }
            />

            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) =>
                handleFiles(e.target.files)
              }
            />

            {compressing && (
              <div style={successStyle}>
                Compressing images...
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, 1fr)',
                  gap: '12px',
                }}
              >
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        border:
                          '1.5px solid #DDD6C8',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(i)
                      }
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#D64545',
                        border:
                          '1px solid #E5DFD3',
                        cursor: 'pointer',
                        fontWeight: '700',
                        boxShadow:
                          '0 2px 8px rgba(0,0,0,0.08)',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imageError && (
              <div style={errorStyle}>
                {imageError}
              </div>
            )}
          </div>

          {/* PUBLISH */}

          <div style={cardStyle}>
            <h2 style={headingStyle}>
              Publish Product
            </h2>

            {submitting &&
              currentStep === 'uploading' && (
                <div
                  style={{ marginBottom: '18px' }}
                >
                  <div
                    style={{
                      background: '#E8E3D7',
                      borderRadius: '999px',
                      height: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: '#639922',
                        borderRadius: '999px',
                        transition: '0.3s',
                      }}
                    />
                  </div>
                </div>
              )}

            {submitting && (
              <div style={successStyle}>
                {currentStep === 'saving' &&
                  'Saving product...'}

                {currentStep === 'uploading' &&
                  'Uploading photos...'}

                {currentStep === 'done' &&
                  'Product published successfully!'}
              </div>
            )}

            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '16px',
                background: submitting
                  ? '#7EA35A'
                  : '#27500A',
                color: '#fff',
                border: 'none',
                borderRadius: '18px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: submitting
                  ? 'not-allowed'
                  : 'pointer',
                transition: '0.2s',
                marginTop: '12px',
                boxShadow:
                  '0 10px 30px rgba(39,80,10,0.18)',
              }}
            >
              {submitting
                ? 'Publishing...'
                : 'Publish Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// STYLES

const cardStyle = {
  background: '#fff',
  borderRadius: '24px',
  padding: '28px',
  marginBottom: '22px',
  border: '1px solid #E8E0D3',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#173404',
  marginBottom: '22px',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#444441',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid #D8D2C5',
  borderRadius: '16px',
  fontSize: '15px',
  outline: 'none',
  background: '#FCFBF8',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid #D8D2C5',
  borderRadius: '16px',
  fontSize: '15px',
  outline: 'none',
  background: '#FCFBF8',
  resize: 'vertical',
  fontFamily: 'sans-serif',
  boxSizing: 'border-box',
};

const uploadCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  background: '#FAF8F4',
  border: '2px dashed #D7CFBF',
  borderRadius: '22px',
  padding: '28px 16px',
  cursor: 'pointer',
  transition: '0.2s',
};

const iconBox = {
  width: '62px',
  height: '62px',
  borderRadius: '18px',
  background: '#EEF6E5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const uploadTitle = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#173404',
};

const uploadSub = {
  fontSize: '12px',
  color: '#7D7B74',
};

const successStyle = {
  marginTop: '14px',
  padding: '13px 15px',
  background: '#EEF6E5',
  borderRadius: '14px',
  border: '1px solid #D7E8C2',
  color: '#27500A',
  fontSize: '14px',
};

const errorStyle = {
  marginTop: '14px',
  padding: '13px 15px',
  background: '#FCEBEB',
  borderRadius: '14px',
  border: '1px solid #F3CACA',
  color: '#8F2323',
  fontSize: '14px',
};