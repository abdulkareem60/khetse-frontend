import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import API from '../api/axios';

const MAX_IMAGES = 3;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp'
];

export default function ImageUploader({
  productId,
  onUploadSuccess
}) {

  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [compressing, setCompressing] = useState(false);

  const galleryRef = useRef();
  const cameraRef = useRef();

  // ─────────────────────────────────────────────
  // HANDLE FILES
  // ─────────────────────────────────────────────

  const handleFiles = async (selected) => {

    setMessage(null);

    const incoming = Array.from(selected);

    // TYPE CHECK

    const invalid = incoming.find(
      f => !ALLOWED_TYPES.includes(f.type)
    );

    if (invalid) {

      setMessage({
        type: 'error',
        text: `❌ "${invalid.name}" unsupported file type hai. Sirf JPG, PNG ya WEBP upload karein.`
      });

      return;
    }

    // MAX COUNT

    if (files.length + incoming.length > MAX_IMAGES) {

      setMessage({
        type: 'error',
        text: `❌ Sirf ${MAX_IMAGES} images upload ho sakti hain.`
      });

      return;
    }

    setCompressing(true);

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true
    };

    const compressed = [];
    const newPreviews = [];

    for (const file of incoming) {

      try {

        const comp = await imageCompression(file, options);

        compressed.push(comp);

        newPreviews.push(
          URL.createObjectURL(comp)
        );

      } catch {

        compressed.push(file);

        newPreviews.push(
          URL.createObjectURL(file)
        );
      }
    }

    setCompressing(false);

    setFiles(prev => [
      ...prev,
      ...compressed
    ]);

    setPreviews(prev => [
      ...prev,
      ...newPreviews
    ]);
  };

  // ─────────────────────────────────────────────
  // REMOVE IMAGE
  // ─────────────────────────────────────────────

  const removeImage = (index) => {

    setFiles(prev =>
      prev.filter((_, i) => i !== index)
    );

    setPreviews(prev =>
      prev.filter((_, i) => i !== index)
    );

    setMessage(null);
  };

  // ─────────────────────────────────────────────
  // UPLOAD
  // ─────────────────────────────────────────────

  const handleUpload = async () => {

    if (files.length === 0) {

      setMessage({
        type: 'error',
        text: '❌ Pehle koi image select karein.'
      });

      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage(null);

    const formData = new FormData();

    files.forEach(f => {
      formData.append('files', f);
    });

    try {

      const res = await API.post(
        `/images/upload/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },

          onUploadProgress: (e) => {

            const pct = Math.round(
              (e.loaded * 100) / e.total
            );

            setProgress(pct);
          }
        }
      );

      if (res.data.success) {

        setMessage({
          type: 'success',
          text: `✅ ${files.length} image(s) successfully upload ho gayi!`
        });

        setFiles([]);
        setPreviews([]);
        setProgress(0);

        if (onUploadSuccess) {
          onUploadSuccess(res.data.imageUrls);
        }

      } else {

        setMessage({
          type: 'error',
          text: `❌ ${res.data.message}`
        });
      }

    } catch {

      setMessage({
        type: 'error',
        text: '❌ Upload fail ho gaya. Dobara try karein.'
      });
    }

    setUploading(false);
  };

  const canAddMore = files.length < MAX_IMAGES;

  return (
    <>
      <style>{`

        *{
          box-sizing:border-box;
        }

        .iu-root{
          width:100%;
        }

        .iu-card{

          background:#FFFFFF;

          border:1px solid #ECE7DD;

          border-radius:24px;

          padding:28px;

          box-shadow:0 10px 35px rgba(0,0,0,.05);
        }

        /* HEADER */

        .iu-header{
          text-align:center;
          margin-bottom:28px;
        }

        .iu-icon{

          width:76px;
          height:76px;

          border-radius:24px;

          background:#EDF7EF;

          margin:0 auto 16px;

          display:flex;
          align-items:center;
          justify-content:center;

          font-size:36px;
        }

        .iu-title{
          font-size:28px;
          font-weight:800;
          color:#123524;
          margin-bottom:10px;
        }

        .iu-sub{
          font-size:14px;
          line-height:1.7;
          color:#6B7280;
        }

        /* BUTTONS */

        .iu-actions{

          display:grid;
          grid-template-columns:1fr 1fr;

          gap:16px;

          margin-bottom:28px;
        }

        .iu-upload-btn{

          border:2px dashed #D7E6D8;

          border-radius:22px;

          background:#F8FBF8;

          padding:26px 16px;

          cursor:pointer;

          transition:.25s ease;

          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;

          text-align:center;

          min-height:170px;
        }

        .iu-upload-btn:hover{
          transform:translateY(-3px);
          border-color:#52B788;
          background:#F1FAF3;
        }

        .iu-upload-btn:disabled{
          opacity:.5;
          cursor:not-allowed;
        }

        .iu-upload-icon{
          font-size:42px;
          margin-bottom:14px;
        }

        .iu-upload-title{
          font-size:15px;
          font-weight:800;
          color:#123524;
          margin-bottom:6px;
        }

        .iu-upload-small{
          font-size:12px;
          color:#9CA3AF;
        }

        .iu-camera{
          background:#F4F8FF;
          border-color:#C8DBFF;
        }

        .iu-camera:hover{
          border-color:#4F8EF7;
          background:#EEF5FF;
        }

        /* COMPRESS */

        .iu-compress{

          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;

          padding:14px;

          background:#FFF8E8;

          border:1px solid #FFE4A3;

          border-radius:18px;

          margin-bottom:22px;

          font-size:14px;
          font-weight:700;
          color:#B7791F;
        }

        .iu-spin{

          width:18px;
          height:18px;

          border:2px solid rgba(0,0,0,.15);
          border-top-color:#B7791F;

          border-radius:50%;

          animation:iuSpin .7s linear infinite;
        }

        @keyframes iuSpin{
          to{
            transform:rotate(360deg);
          }
        }

        /* PREVIEWS */

        .iu-preview-wrap{
          margin-bottom:24px;
        }

        .iu-preview-head{

          display:flex;
          justify-content:space-between;
          align-items:center;

          margin-bottom:14px;
        }

        .iu-preview-head h4{
          font-size:15px;
          color:#374151;
        }

        .iu-counter{

          background:#EDF7EF;

          color:#2F855A;

          padding:5px 12px;

          border-radius:999px;

          font-size:12px;
          font-weight:700;
        }

        .iu-grid{

          display:grid;
          grid-template-columns:repeat(3,1fr);

          gap:14px;
        }

        .iu-preview{
          position:relative;
        }

        .iu-preview img{

          width:100%;
          height:120px;

          object-fit:cover;

          border-radius:18px;

          border:2px solid #E6EFE8;
        }

        .iu-remove{

          position:absolute;
          top:-8px;
          right:-8px;

          width:28px;
          height:28px;

          border:none;

          border-radius:50%;

          background:#DC2626;

          color:#fff;

          cursor:pointer;

          font-size:13px;
          font-weight:800;

          transition:.2s ease;
        }

        .iu-remove:hover{
          transform:scale(1.08);
        }

        .iu-number{

          position:absolute;
          bottom:10px;
          left:10px;

          background:rgba(0,0,0,.65);

          color:#fff;

          padding:4px 8px;

          border-radius:999px;

          font-size:11px;
          font-weight:700;
        }

        /* PROGRESS */

        .iu-progress-wrap{
          margin-bottom:22px;
        }

        .iu-progress-top{

          display:flex;
          justify-content:space-between;

          margin-bottom:8px;

          font-size:13px;
          font-weight:700;
          color:#6B7280;
        }

        .iu-progress{

          width:100%;
          height:12px;

          background:#E5E7EB;

          border-radius:999px;

          overflow:hidden;
        }

        .iu-progress-bar{

          height:100%;

          background:#52B788;

          border-radius:999px;

          transition:.3s ease;
        }

        /* MESSAGE */

        .iu-message{

          padding:16px 18px;

          border-radius:18px;

          font-size:14px;
          font-weight:700;

          margin-bottom:22px;
        }

        .iu-success{
          background:#ECFDF5;
          border:1px solid #A7F3D0;
          color:#047857;
        }

        .iu-error{
          background:#FEF2F2;
          border:1px solid #FECACA;
          color:#B91C1C;
        }

        /* UPLOAD BUTTON */

        .iu-submit{

          width:100%;
          height:58px;

          border:none;

          border-radius:18px;

          background:#123524;

          color:#fff;

          font-size:16px;
          font-weight:800;

          cursor:pointer;

          transition:.25s ease;

          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
        }

        .iu-submit:hover{
          background:#18462F;
          transform:translateY(-2px);
        }

        .iu-submit:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        /* FOOTER */

        .iu-footer{

          margin-top:18px;

          text-align:center;

          font-size:12px;
          line-height:1.7;

          color:#A1A1AA;
        }

        .iu-limit{

          margin-top:14px;

          text-align:center;

          font-size:13px;
          color:#6B7280;
          font-weight:700;
        }

        /* RESPONSIVE */

        @media(max-width:768px){

          .iu-card{
            padding:22px;
            border-radius:20px;
          }

          .iu-title{
            font-size:24px;
          }

          .iu-actions{
            grid-template-columns:1fr;
          }

          .iu-grid{
            grid-template-columns:repeat(2,1fr);
          }

          .iu-preview img{
            height:110px;
          }
        }

        @media(max-width:480px){

          .iu-grid{
            grid-template-columns:1fr 1fr;
            gap:10px;
          }

          .iu-preview img{
            height:95px;
          }

          .iu-card{
            padding:18px;
          }

          .iu-title{
            font-size:21px;
          }
        }

      `}</style>

      <div className="iu-root">

        <div className="iu-card">

          {/* HEADER */}

          <div className="iu-header">

            <div className="iu-icon">
              📸
            </div>

            <h2 className="iu-title">
              Upload Product Images
            </h2>

            <p className="iu-sub">
              Apni fresh fasal ki clear images upload karein
              taake buyers ko product achi tarah nazar aaye.
            </p>

          </div>

          {/* BUTTONS */}

          {canAddMore && (

            <div className="iu-actions">

              {/* GALLERY */}

              <button
                onClick={() => galleryRef.current.click()}
                disabled={compressing || uploading}
                className="iu-upload-btn"
              >

                <div className="iu-upload-icon">
                  🖼️
                </div>

                <div className="iu-upload-title">
                  Gallery se Select Karein
                </div>

                <div className="iu-upload-small">
                  JPG, PNG, WEBP
                </div>

              </button>

              {/* CAMERA */}

              <button
                onClick={() => cameraRef.current.click()}
                disabled={compressing || uploading}
                className="iu-upload-btn iu-camera"
              >

                <div className="iu-upload-icon">
                  📷
                </div>

                <div className="iu-upload-title">
                  Camera se Photo Lein
                </div>

                <div className="iu-upload-small">
                  Live Capture
                </div>

              </button>

              {/* HIDDEN INPUTS */}

              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

            </div>
          )}

          {/* COMPRESS */}

          {compressing && (

            <div className="iu-compress">

              <div className="iu-spin"></div>

              Images optimize ho rahi hain...

            </div>
          )}

          {/* PREVIEWS */}

          {previews.length > 0 && (

            <div className="iu-preview-wrap">

              <div className="iu-preview-head">

                <h4>
                  Selected Images
                </h4>

                <div className="iu-counter">
                  {previews.length}/{MAX_IMAGES}
                </div>

              </div>

              <div className="iu-grid">

                {previews.map((src, i) => (

                  <div
                    key={i}
                    className="iu-preview"
                  >

                    <img
                      src={src}
                      alt={`preview-${i}`}
                    />

                    <button
                      onClick={() => removeImage(i)}
                      className="iu-remove"
                    >
                      ✕
                    </button>

                    <div className="iu-number">
                      #{i + 1}
                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

          {/* PROGRESS */}

          {uploading && (

            <div className="iu-progress-wrap">

              <div className="iu-progress-top">

                <span>
                  Uploading...
                </span>

                <span>
                  {progress}%
                </span>

              </div>

              <div className="iu-progress">

                <div
                  className="iu-progress-bar"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

            </div>
          )}

          {/* MESSAGE */}

          {message && (

            <div
              className={`iu-message ${
                message.type === 'success'
                  ? 'iu-success'
                  : 'iu-error'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* SUBMIT */}

          {files.length > 0 && (

            <button
              onClick={handleUpload}
              disabled={uploading || compressing}
              className="iu-submit"
            >

              {uploading ? (
                <>
                  <div className="iu-spin"></div>
                  Upload ho raha hai...
                </>
              ) : (
                <>
                  📤 Upload {files.length} Image(s)
                </>
              )}

            </button>
          )}

          {/* LIMIT */}

          {!canAddMore && !uploading && (

            <div className="iu-limit">
              ✅ Maximum images selected.
              Aur add karne ke liye pehle remove karein.
            </div>
          )}

          {/* FOOTER */}

          <div className="iu-footer">

            Images automatically compress hoti hain
            taake slow internet par bhi fast upload ho.

          </div>

        </div>

      </div>
    </>
  );
}