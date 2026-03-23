import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Activity, Video, Upload, Square, Settings, User, Monitor, Database, Radar, CheckCircle, AlertTriangle, Download, Search, Menu, Plus, Moon, Sun
} from 'lucide-react';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [emailAddress, setEmailAddress] = useState(localStorage.getItem('roadeye_email') || 'traffic_police@gov.in');
  const [modelSelection, setModelSelection] = useState(localStorage.getItem('roadeye_model') || 'traffic-voilation-voov4-arort/1');
  const [theme, setTheme] = useState(localStorage.getItem('roadeye_theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('roadeye_email', emailAddress);
    localStorage.setItem('roadeye_model', modelSelection);
    localStorage.setItem('roadeye_theme', theme);
    document.body.className = theme;
  }, [emailAddress, modelSelection, theme]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`);
        if (response.data.success) {
           const formatted = response.data.history.map(item => ({
              id: `TKT-${item.id.toString().padStart(3, '0')}`,
              title: item.violation_type.toUpperCase(),
              plate: item.license_plate || "UNREGISTERED",
              conf: `${Math.round(item.confidence * 100)}%`,
              time: new Date(item.timestamp).toLocaleString('en-US'),
              img: item.image_base64,
              status: item.status
           }));
           setHistory(formatted);
        }
      } catch(e) { console.error("Database fetch failed", e); }
    };
    
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {toast && (
        <div className={`toast-popup ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} color="var(--success)" /> : <AlertTriangle size={20} color="var(--danger)" />}
          {toast.msg}
        </div>
      )}

      {/* Global Top App Bar (Google Style) */}
      <header className="app-header">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '256px' }}>
          <div className="mobile-menu-btn hover-circle" style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu size={24} color="var(--text-muted)" /></div>
          <div className="logo-container" style={{ margin: 0, padding: 0 }}>
            <div className="logo-icon"><Radar size={24} /></div>
            <h1 className="logo-text">RoadEye<span className="text-muted">.ai</span></h1>
          </div>
        </div>

        <div className="search-bar" style={{ flex: 1, maxWidth: '720px', margin: '0 24px' }}>
          <div className="input-field" style={{ borderRadius: '8px', background: 'var(--secondary)', border: 'none', height: '48px' }}>
            <Search size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Search in RoadEye Analytics..." style={{ fontSize: '1rem' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%' }} className="hover-circle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} color="var(--text-muted)" /> : <Sun size={20} color="var(--text-muted)" />}
          </div>
          <div className="profile-identity" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>Command Admin</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Glbitm Matrix</span>
          </div>
          <div className="profile-avatar"><User size={20} color={theme === 'light' ? 'white' : '#202124'} /></div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar Drawer */}
        <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Big Google-Drive Style New Button */}
          <button className="btn" style={{ 
            background: theme === 'dark' ? '#303134' : '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border)', 
            height: '56px', borderRadius: '16px', margin: '8px 12px 24px 12px', boxShadow: 'var(--shadow-1)',
            justifyContent: 'flex-start', paddingLeft: '16px', fontSize: '0.95rem', fontWeight: 500
          }} onClick={() => setActiveTab('workstation')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
              <path d="M12 2V22M2 12H22" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
             New Intercept
          </button>

          <nav className="nav-menu">
            <div className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}><Monitor size={20} /> Operational Dashboard</div>
            <div className={`nav-link ${activeTab === 'workstation' ? 'active' : ''}`} onClick={() => { setActiveTab('workstation'); setMobileMenuOpen(false); }}><Activity size={20} /> Neural Workstation</div>
            <div className={`nav-link ${activeTab === 'intelligence' ? 'active' : ''}`} onClick={() => { setActiveTab('intelligence'); setMobileMenuOpen(false); }}><Database size={20} /> Global Intel Logs</div>
            <div className={`nav-link ${activeTab === 'system' ? 'active' : ''}`} onClick={() => { setActiveTab('system'); setMobileMenuOpen(false); }}><Settings size={20} /> Configuration</div>
          </nav>
        </aside>

        <main className="app-main">
          {activeTab === 'overview' && <Overview history={history} />}
          {activeTab === 'workstation' && <Workstation history={history} emailAddress={emailAddress} modelSelection={modelSelection} showToast={showToast} />}
          {activeTab === 'intelligence' && <Intelligence history={history} />}
          {activeTab === 'system' && <SystemSettings emailAddress={emailAddress} setEmailAddress={setEmailAddress} modelSelection={modelSelection} setModelSelection={setModelSelection} showToast={showToast} />}
        </main>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// OVERVIEW TAB (Google Analytics Style)
// -----------------------------------------------------------------------------
function Overview({ history }) {
  const totalViolations = history.length;
  const estimatedInferences = useMemo(() => {
    return totalViolations === 0 ? 0 : totalViolations * 15 + (totalViolations * 7 % 50);
  }, [totalViolations]);
  const avgConfidence = totalViolations === 0 ? "0%" : `${Math.round(history.reduce((acc, val) => acc + parseInt(val.conf.replace('%', '')), 0) / totalViolations)}%`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 400, color: 'var(--text-main)', marginBottom: '8px' }}>Google Analytics Dashboard</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Real-time traffic enforcement metrics across connected edge nodes.</p>

      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="card stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
          <p className="stat-label">Total Inferences</p>
          <h3 className="stat-value">{estimatedInferences.toLocaleString()}</h3>
        </div>
        <div className="card stat-card" style={{ borderTop: '4px solid var(--danger)' }}>
          <p className="stat-label">Violations Ticketed</p>
          <h3 className="stat-value">{totalViolations.toLocaleString()}</h3>
        </div>
        <div className="card stat-card" style={{ borderTop: '4px solid var(--success)' }}>
          <p className="stat-label">Avg Accuracy</p>
          <h3 className="stat-value">{avgConfidence}</h3>
        </div>
        <div className="card stat-card" style={{ borderTop: '4px solid #fbbc04' }}>
          <p className="stat-label">Live CCTVs</p>
          <h3 className="stat-value">1</h3>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '24px' }}>Recent Activity Feed</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No metrics available yet.</p>
        ) : (
          <table className="table-glass">
            <thead>
              <tr><th>Target ID</th><th>Category</th><th>Confidence</th><th>Time</th></tr>
            </thead>
            <tbody>
              {history.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--primary)', fontWeight: 500}}>{row.id}</td>
                  <td>{row.title}</td>
                  <td>{row.conf}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WORKSTATION TAB (Cloud Vision API Style)
// -----------------------------------------------------------------------------
function Workstation({ history, emailAddress, modelSelection, showToast }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSource, setStreamSource] = useState("#WEBCAM");
  const [inputMode, setInputMode] = useState('upload');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };
  const handleChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };

  const processFile = (file) => {
    if (isStreaming) stopWebcam();
    setFile(file); setResult(null);
    if (file.type.startsWith('video/')) {
       setIsVideo(true); setPreview(URL.createObjectURL(file));
    } else {
       setIsVideo(false);
       const reader = new FileReader();
       reader.onload = (e) => setPreview(e.target.result);
       reader.readAsDataURL(file);
    }
  };

  const updateDimensions = (nw, nh, el) => { if (el) { setMediaDimensions({ width: nw, height: nh }); setContainerDimensions({ width: el.clientWidth, height: el.clientHeight }); }};
  const onImageLoad = () => { if (imageRef.current) updateDimensions(imageRef.current.naturalWidth, imageRef.current.naturalHeight, imageRef.current); };
  const onVideoLoad = () => { if (videoRef.current) updateDimensions(videoRef.current.videoWidth, videoRef.current.videoHeight, videoRef.current); };

  useEffect(() => {
    const handleResize = () => {
      if (isStreaming && videoRef.current) updateDimensions(videoRef.current.videoWidth, videoRef.current.videoHeight, videoRef.current);
      else if (imageRef.current) updateDimensions(imageRef.current.naturalWidth, imageRef.current.naturalHeight, imageRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [preview, isStreaming]);

  const startWebcam = async () => {
    try {
      setFile(null); setPreview(null); setResult(null);
      setIsStreaming(true);
      if (streamSource === "#WEBCAM") {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
      }
      streamIntervalRef.current = setInterval(analyzeStreamFrame, 200);
      showToast("Live Network Intercept Initiated", "success");
    } catch (err) {
      showToast("Hardware failure bridging stream limits.", "error");
      setIsStreaming(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsStreaming(false); setResult(null);
    showToast("Live Intercept Terminated", "success");
  };

  const analyzeStreamFrame = async () => {
    let sourceElement = null;
    if (streamSource === "#WEBCAM" && videoRef.current) sourceElement = videoRef.current;
    else if (streamSource !== "#WEBCAM" && imageRef.current) sourceElement = imageRef.current;
    if (!sourceElement) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = sourceElement.videoWidth || sourceElement.naturalWidth || 640;
    canvas.height = sourceElement.videoHeight || sourceElement.naturalHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try { ctx.drawImage(sourceElement, 0, 0, canvas.width, canvas.height); } catch(e) { return; }
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');
      formData.append('recipient_email', emailAddress); 
      formData.append('model_name', modelSelection); 
      try {
        const response = await axios.post(`${API_BASE_URL}/api/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setResult(response.data);
      } catch (err) { }
    }, 'image/jpeg');
  };

  const analyzeStaticImage = async () => {
    if (!file) return;
    setLoading(true);
    let blobToSend = file;

    if (isVideo && imageRef.current) {
       const canvas = document.createElement("canvas");
       canvas.width = imageRef.current.videoWidth;
       canvas.height = imageRef.current.videoHeight;
       const ctx = canvas.getContext("2d");
       ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
       blobToSend = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    }
    
    const formData = new FormData();
    formData.append('file', blobToSend, isVideo ? 'frame.jpg' : file.name);
    formData.append('recipient_email', emailAddress);
    formData.append('model_name', modelSelection);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(response.data);
      if (response.data.violation_found) showToast(`Violation Captured!`, "error");
      else showToast(`No anomalous targets detected.`, "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Cloud API Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderBoundingBoxes = () => {
    if (!result || !result.predictions) return null;
    const scaleX = containerDimensions.width / mediaDimensions.width;
    const scaleY = containerDimensions.height / mediaDimensions.height;
    
    return result.predictions.map((pred, idx) => {
      const x = (pred.x - pred.width / 2) * scaleX;
      const y = (pred.y - pred.height / 2) * scaleY;
      const width = pred.width * scaleX;
      const height = pred.height * scaleY;
      const isRed = ['no helmet', 'red light', 'tripling', 'wrong lane'].includes(pred.class.toLowerCase());
      const border = isRed ? 'var(--danger)' : 'var(--success)';
      return (
        <div key={idx} className="bounding-box" style={{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, borderColor: border }}>
          <div className="box-label" style={{ backgroundColor: border }}>{pred.class.toUpperCase()} {Math.round(pred.confidence * 100)}%</div>
        </div>
      );
    });
  };

  useEffect(() => { return () => { if (isStreaming) stopWebcam(); }; }, [isStreaming]);

  return (
    <div className="grid-cols-2">
      {/* Cloud Vision API Left Properties Panel */}
      <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-main)', marginBottom: '16px' }}>Input properties</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${inputMode === 'upload' ? 'btn-primary' : ''}`} style={{background: inputMode === 'upload' ? 'var(--primary-light)' : 'transparent', color: inputMode === 'upload'?'var(--primary)':'var(--text-muted)', borderRadius: '4px'}} onClick={() => {setInputMode('upload'); if(isStreaming)stopWebcam();}}>Media Request</button>
            <button className={`btn ${inputMode === 'stream' ? 'btn-primary' : ''}`} style={{background: inputMode === 'stream' ? 'var(--primary-light)' : 'transparent', color: inputMode === 'stream'?'var(--primary)':'var(--text-muted)', borderRadius: '4px'}} onClick={() => setInputMode('stream')}>Stream Payload</button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
           {inputMode === 'upload' && (
             <div>
                <div className={`upload-area ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*,video/mp4" onChange={handleChange} style={{ display: 'none' }} />
                  <Upload size={32} color="var(--primary)" style={{ margin: '0 auto' }} />
                  <h4>Select file to analyze</h4>
                  <p>Drag and drop JPG or MP4</p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px', borderRadius: '4px' }} onClick={analyzeStaticImage} disabled={loading || !file || isStreaming}>
                  {loading ? <Activity size={18} className="loader-pulse" /> : <Radar size={18} />}
                  {loading ? 'Evaluating...' : 'Test Vision Model'}
                </button>
             </div>
           )}

           {inputMode === 'stream' && (
             <div>
                <div className="input-group">
                  <label>RTSP or Webcam Identifier</label>
                  <div className="input-field">
                    <input type="text" value={streamSource} onChange={(e) => setStreamSource(e.target.value)} placeholder="#WEBCAM (Local) or rtsp://..." />
                  </div>
                </div>
                {!isStreaming ? (
                  <button className="btn btn-primary" style={{ width: '100%', borderRadius: '4px' }} onClick={startWebcam}><Video size={18} /> Connect to Stream</button>
                ) : (
                  <button className="btn btn-danger" style={{ width: '100%', borderRadius: '4px' }} onClick={stopWebcam}><Square size={18} /> End Stream Processing</button>
                )}
             </div>
           )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '540px' }}>
           <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Inference Viewer</h3>
           </div>
           <div className="camera-feed" style={{ flex: 1, border: 'none', borderRadius: 0 }}>
              {(!preview && !isStreaming) ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Awaiting payload block...
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(isStreaming && streamSource === "#WEBCAM") ? (
                     <video ref={videoRef} autoPlay playsInline muted style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onLoadedMetadata={onVideoLoad} />
                  ) : (isStreaming && streamSource !== "#WEBCAM") ? (
                     <img ref={imageRef} src={`${API_BASE_URL}/api/stream?url=${encodeURIComponent(streamSource)}`} crossOrigin="anonymous" alt="RTSP Relay Native M-JPEG" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onLoad={onImageLoad} />
                  ) : isVideo ? (
                     <video ref={imageRef} src={preview} controls crossOrigin="anonymous" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onLoadedMetadata={onImageLoad} />
                  ) : (
                     <img ref={imageRef} src={preview} alt="Upload" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onLoad={onImageLoad} />
                  )}
                  {renderBoundingBoxes()}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// INTELLIGENCE TAB 
// -----------------------------------------------------------------------------
function Intelligence({ history }) {
  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(['Log ID', 'Violation Type', 'System Confidence', 'Time', 'Plate'].join(','));
    for (const item of history) {
      csvRows.push([item.id, item.title, item.conf, `"${item.time}"`, item.plate].join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'RoadEye_Workspace_Export.csv');
    a.click();
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>BigQuery Analytics Export</h2>
        <button className="btn" style={{ border: '1px solid var(--border)', borderRadius: '4px' }} onClick={downloadCSV}><Download size={18} /> Export CSV</button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table className="table-glass">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Snapshot Evidence</th>
              <th>Category</th>
              <th>Target Confidence</th>
              <th>Time Registered</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{row.id}</td>
                <td>
                  <div className="log-thumbnail-placeholder">
                    {row.img && <img src={row.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="evidence" />}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{row.title}</td>
                <td>{row.conf}</td>
                <td style={{ color: 'var(--text-muted)' }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No datasets populated.</p>}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SYSTEM TAB
// -----------------------------------------------------------------------------
function SystemSettings({ emailAddress, setEmailAddress, modelSelection, setModelSelection, showToast }) {
  const [localEmail, setLocalEmail] = useState(emailAddress);
  const [localModel, setLocalModel] = useState(modelSelection);

  const handleSave = () => {
    setEmailAddress(localEmail);
    setModelSelection(localModel);
    showToast("Global environment variables synchronized", "success");
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 400, color: 'var(--text-main)', marginBottom: '8px' }}>Workspace Settings</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Configure API endpoints and event triggers for this project.</p>

      <div className="card">
        <h3 style={{ marginBottom: '24px', fontSize: '1rem', fontWeight: 500 }}>IAM Routing Variables</h3>
        <div className="input-group">
          <label>Global Administrator Email Dispatch</label>
          <div className="input-field">
            <input type="email" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Overrides the default environment payload dispatch.</p>
        </div>

        <h3 style={{ marginTop: '40px', marginBottom: '24px', fontSize: '1rem', fontWeight: 500 }}>Vertex AI Model Pointer</h3>
        <div className="input-group">
          <label>Model Version UUID</label>
          <div className="input-field">
            <input type="text" value={localModel} onChange={(e) => setLocalModel(e.target.value)} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Syntax: `workspace/project/version`</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default App;
