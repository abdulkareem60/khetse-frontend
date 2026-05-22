import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function ProductImages({ productId, editable = false, onDelete }) {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive]   = useState(0);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    API.get(`/images/product/${productId}`)
      .then(res => {
        setImages(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleDelete = async (imageId) => {
    if (!window.confirm('Ye tasveer hata dein?')) return;
    try {
      await API.delete(`/images/delete/${imageId}`);
      const updated = images.filter(img => img.imageId !== imageId);
      setImages(updated);
      setActive(0);
      if (onDelete) onDelete(imageId);
    } catch {
      alert('Delete fail ho gaya.');
    }
  };

  if (loading) return (
    <div style={{
      height: '180px', background: '#F5F2EB',
      borderRadius: '12px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: '#888780', fontSize: '13px',
    }}>
      Loading…
    </div>
  );

  if (images.length === 0) return (
    <div style={{
      height: '180px', background: '#F5F2EB',
      borderRadius: '12px', display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#B4B2A9', gap: '8px',
    }}>
      <span style={{ fontSize: '32px' }}>📷</span>
      <span style={{ fontSize: '13px' }}>Koi tasveer nahi</span>
    </div>
  );

  return (
    <div>
      {/* Main image */}
      <div style={{ position: 'relative' }}>
        <img
          src={images[active]?.imageUrl}
          alt="product"
          style={{
            width: '100%', height: '200px',
            objectFit: 'cover', borderRadius: '12px',
            display: 'block',
          }}
          onError={e => {
            e.target.style.display = 'none';
          }}
        />
        {editable && (
          <button
            onClick={() => handleDelete(images[active].imageId)}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#E24B4A', color: '#fff',
              border: 'none', borderRadius: '8px',
              padding: '4px 10px', fontSize: '12px',
              cursor: 'pointer', fontWeight: '600',
            }}
          >
            🗑️ Hatao
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {images.map((img, i) => (
            <button
              key={img.imageId}
              onClick={() => setActive(i)}
              style={{
                flex: 1, padding: 0, border: 'none',
                borderRadius: '8px', overflow: 'hidden',
                cursor: 'pointer',
                outline: active === i ? '2px solid #639922' : '2px solid transparent',
                transition: 'outline 0.15s',
              }}
            >
              <img
                src={img.imageUrl}
                alt={`thumb-${i}`}
                style={{ width: '100%', height: '56px', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}