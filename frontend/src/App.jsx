import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, Video, Upload, Play, Square, Settings, User, Monitor, ChevronDown, Mail, Search,
  Radar, Database, Bell, ShieldCheck, Camera, CheckCircle
} from 'lucide-react';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('workstation');
  const [history, setHistory] = useState([]);
  const [emailAddress, setEmailAddress] = useState('traffic_police@gov.in');
  const [modelSelection, setModelSelection] = useState('sahilkhatri/traffic-viol-det/1');

  // Fetch real history from SQLite database
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`);
        if (response.data.success) {
           const formatted = response.data.history.map(item => ({
              id: `TKT-${item.id.toString().padStart(3, '0')}`,
              title: item.violation_type.toUpperCase(),
              plate: item.license_plate,
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
  }, [activeTab]);

  return (
    <>
      <header className="navbar">
        <div className="logo-container">
          <div className="logo-icon">
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>RoadEye.ai</h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>Traffic Intelligence</p>
          </div>
        </div>

        <nav className="nav-menu">
          <div className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Monitor size={16} /> Overview</div>
          <div className={`nav-link ${activeTab === 'workstation' ? 'active' : ''}`} onClick={() => setActiveTab('workstation')}><Radar size={16} /> Workstation</div>
          <div className={`nav-link ${activeTab === 'intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('intelligence')}><Activity size={16} /> Intelligence</div>
          <div className={`nav-link ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}><Settings size={16} /> System</div>
        </nav>

        <div className="profile-section">
          <div className="profile-info">
            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Admin Console</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span> Online
            </p>
          </div>
          <div className="profile-avatar">
            <User size={20} color="white" />
          </div>
        </div>
      </header>

      <div className="app-body">
        {activeTab === 'overview' && <Overview history={history} />}
        {activeTab === 'workstation' && <Workstation history={history} setHistory={setHistory} emailAddress={emailAddress} setEmailAddress={setEmailAddress} modelSelection={modelSelection} setModelSelection={setModelSelection} />}
        {activeTab === 'intelligence' && <Intelligence history={history} />}
        {activeTab === 'system' && <SystemSettings emailAddress={emailAddress} setEmailAddress={setEmailAddress} modelSelection={modelSelection} setModelSelection={setModelSelection} />}
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// OVERVIEW TAB
// -----------------------------------------------------------------------------
function Overview({ history }) {
  const reds = history.filter(h => h.title.includes('HELMET') || h.title.includes('LIGHT') || h.title.includes('TRIPLING') || h.title.includes('LANE'));
  return (
    <div style={{ gridColumn: '1 / -1', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="detection-header" style={{ marginBottom: '32px' }}>
        <h2><Monitor size={20} /> System Overview</h2>
        <p>High-level metrics and system status across all intelligent edge nodes.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="upload-icon" style={{ margin: 0 }}><Activity size={24} /></div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>Total Inferences</p>
            <h3 style={{ fontSize: '1.8rem' }}>{history.length * 42}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="upload-icon" style={{ margin: 0, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><ShieldCheck size={24} /></div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>Violations Caught</p>
            <h3 style={{ fontSize: '1.8rem' }}>{history.length}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="upload-icon" style={{ margin: 0 }}><Camera size={24} /></div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>Active Nodes</p>
            <h3 style={{ fontSize: '1.8rem' }}>1</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="upload-icon" style={{ margin: 0, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>System Status</p>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--success)' }}>Optimal</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WORKSTATION TAB (Original Main View)
// -----------------------------------------------------------------------------
function Workstation({ history, setHistory, emailAddress, setEmailAddress, modelSelection, setModelSelection }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSource, setStreamSource] = useState("#WEBCAM");
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  
  const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (isStreaming) stopWebcam();
    setFile(file);
    setResult(null);
    if (file.type.startsWith('video/')) {
       setIsVideo(true);
       setPreview(URL.createObjectURL(file));
    } else {
       setIsVideo(false);
       const reader = new FileReader();
       reader.onload = (e) => setPreview(e.target.result);
       reader.readAsDataURL(file);
    }
  };

  const updateDimensions = (naturalWidth, naturalHeight, element) => {
    if (element) {
      setMediaDimensions({ width: naturalWidth, height: naturalHeight });
      setContainerDimensions({ width: element.clientWidth, height: element.clientHeight });
    }
  };

  const onImageLoad = () => {
    if (imageRef.current) updateDimensions(imageRef.current.naturalWidth, imageRef.current.naturalHeight, imageRef.current);
  };

  const onVideoLoad = () => {
    if (videoRef.current) updateDimensions(videoRef.current.videoWidth, videoRef.current.videoHeight, videoRef.current);
  };

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
      setFile(null); setPreview(null); setResult(null); // Clear static image
      setIsStreaming(true);
      
      if (streamSource === "#WEBCAM") {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
      }
      // If NOT webcam, it's an RTSP link which UI automatically hands to the <img> tag proxy.
      
      streamIntervalRef.current = setInterval(analyzeStreamFrame, 2500);
    } catch (err) {
      alert("Could not initialize stream: " + err.message);
      setIsStreaming(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsStreaming(false);
    setResult(null);
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
    
    try {
        ctx.drawImage(sourceElement, 0, 0, canvas.width, canvas.height);
    } catch(e) { return; } // Cross-origin taint or stream loading wait state
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');
      formData.append('recipient_email', emailAddress); 
      formData.append('model_name', modelSelection); 
      
      try {
        const response = await axios.post(`${API_BASE_URL}/api/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setResult(response.data);
        handleViolationLogging(response.data, canvas.toDataURL("image/jpeg"));
      } catch (err) { }
    }, 'image/jpeg');
  };

  const analyzeStaticImage = async () => {
    if (!file) return;
    setLoading(true);
    let blobToSend = file;

    if (isVideo && imageRef.current) {
       // Extract current frame of the local video player
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
      // For video, we pass the extracted imageSrc dynamically
      const imageSrc = isVideo ? URL.createObjectURL(blobToSend) : preview;
      handleViolationLogging(response.data, imageSrc);
    } catch (err) {
      alert(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleViolationLogging = (data, imageSrc) => {
    if (data.violation_found) {
      setHistory(prev => [{
        id: `TKT-${Math.floor(Math.random() * 10000)}`,
        title: data.violation_type.toUpperCase(),
        plate: "UNKNOWN",
        conf: `${Math.round(data.predictions[0]?.confidence * 100 || 0)}%`,
        time: new Date().toLocaleTimeString('en-US'),
        img: imageSrc,
        status: "Processed"
      }, ...prev]);
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
      const border = isRed ? '#ef4444' : '#10b981';
      return (
        <div key={idx} className="bounding-box" style={{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, borderColor: border }}>
          <div className="box-label" style={{ backgroundColor: border }}>{pred.class} {Math.round(pred.confidence * 100)}%</div>
        </div>
      );
    });
  };

  // Ensure webcam stops if unmounted
  useEffect(() => {
    return () => {
      if (isStreaming) stopWebcam();
    };
  }, [isStreaming]);

  return (
    <>
      <div className="control-panel">
        <div className="detection-header" style={{ marginBottom: '-8px' }}>
          <h2><Radar size={20} /> Detection Control</h2>
          <p>Configure your input source and model parameters for traffic violation inference.</p>
        </div>

        <div className="card">
          <div className="input-group">
            <label>Notification Settings</label>
            <div className="input-field">
              <Mail size={16} color="var(--text-light)" style={{ marginRight: '8px' }} />
              <input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="Alert email..." />
            </div>
          </div>

          <div className="input-group">
            <label>Model Selection</label>
            <div className="input-field">
              <input type="text" value={modelSelection} onChange={(e) => setModelSelection(e.target.value)} placeholder="username/project/1" />
              <ChevronDown size={16} color="var(--text-light)" />
            </div>
          </div>

          <div className="tabs">
            <div className="tab active">Media Processor</div>
          </div>

          <div className={`upload-area ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*,video/mp4" onChange={handleChange} style={{ display: 'none' }} />
            <div className="upload-icon"><Upload size={20} /></div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Drag & Drop or Click to Upload</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Simulate single frame traffic conditions</p>
          </div>

          <button className="btn btn-primary" onClick={analyzeStaticImage} disabled={loading || !file || isStreaming}>
            {loading ? <Activity size={16} className="loader-pulse" /> : <Search size={16} />}
            {loading ? 'Processing...' : (isVideo ? 'Analyze Video Frame' : 'Run Static Inference')}
          </button>
        </div>

        <div className="card">
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Live Stream Configuration</label>
            <div className="input-field">
              <input type="text" value={streamSource} onChange={(e) => setStreamSource(e.target.value)} placeholder="#WEBCAM or rtsp://..." />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '8px' }}>Use #WEBCAM for local camera, or drop an RTSP/HTTP URL for remote IP cameras.</p>
          </div>
          <div className="stream-controls">
            {!isStreaming ? (
              <button className="btn btn-success" onClick={startWebcam}><Play size={16} /> Start</button>
            ) : (
              <button className="btn btn-danger" onClick={stopWebcam} style={{ background: 'var(--danger)', color: 'white' }}><Square size={16} /> Stop</button>
            )}
          </div>
        </div>
      </div>

      <div className="feed-panel">
        <div className={`camera-feed ${(!preview && !isStreaming) ? 'camera-feed-inactive' : ''}`}>
          {(!preview && !isStreaming) ? (
            <>
              <div className="feed-icon"><Video size={28} /></div>
              <h3>Feed Inactive</h3>
              <p style={{ fontSize: '0.85rem' }}>Initiate live stream or upload media</p>
            </>
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
          {isStreaming && (
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 999 }}>
              <span className="loader-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>Live AI Analysis</span>
            </div>
          )}
        </div>

        <div className="card logs-card" style={{ overflowY: 'auto' }}>
          <div className="logs-header">
            <h3 style={{ fontSize: '1.1rem' }}>Inference Logs</h3>
            <div className="logs-badge">{history.length} Events</div>
          </div>
          <div className="logs-list">
            {history.map((log, idx) => (
              <div className="log-item" key={idx}>
                <div className="log-thumbnail-placeholder">
                  {log.img ? <img src={log.img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Video size={24} color="var(--text-light)" />}
                </div>
                <div className="log-info">
                  <div className="log-title-row"><h4 className="log-title">{log.title}</h4><span className="log-time">{log.time}</span></div>
                  <div className="log-meta">
                    <div className="plate-badge">{log.plate}</div><div className="feed-label">Camera Station 1</div>
                  </div>
                  <div className="log-status">
                    <span className={`status-processed ${log.title.includes('HELMET') ? 'text-danger' : ''}`} style={{ color: log.title.includes('HELMET') || log.title.includes('LIGHT') ? 'var(--danger)' : 'var(--success)' }}>{log.status}</span>
                    <span className="status-confidence">Confidence: {log.conf}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// INTELLIGENCE TAB
// -----------------------------------------------------------------------------
function Intelligence({ history }) {
  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(['Log ID', 'Violation Type', 'System Confidence', 'Time', 'Plate']);
    for (const item of history) {
      csvRows.push([item.id, item.title, item.conf, `"${item.time}"`, item.plate].join(','));
    }
    const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'traffic_violations_export.csv');
    a.click();
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1', maxWidth: '100%', overflowY: 'auto' }}>
      <div className="detection-header" style={{ marginBottom: '24px', background: 'var(--bg-card)', color: 'var(--text-dark)', boxShadow: 'none', borderBottom: '1px solid var(--border-color)', padding: '0 0 24px 0', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--text-dark)' }}><Database size={20} color="var(--primary)" /> Complete Intelligence Database</h2>
          <p style={{ color: 'var(--text-gray)' }}>Historical log of all traffic violations cataloged by the system.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={downloadCSV}>Export CSV Report</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '16px', color: 'var(--text-light)' }}>Log ID</th>
            <th style={{ padding: '16px', color: 'var(--text-light)' }}>Image Evidence</th>
            <th style={{ padding: '16px', color: 'var(--text-light)' }}>Violation Type</th>
            <th style={{ padding: '16px', color: 'var(--text-light)' }}>System Confidence</th>
            <th style={{ padding: '16px', color: 'var(--text-light)' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600 }}>{row.id}</td>
              <td style={{ padding: '16px' }}>
                <div style={{ width: 60, height: 40, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  {row.img && <img src={row.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="evidence" />}
                </div>
              </td>
              <td style={{ padding: '16px', color: row.title.includes('HELMET') ? 'var(--danger)' : 'var(--text-dark)', fontWeight: 600 }}>{row.title}</td>
              <td style={{ padding: '16px' }}>{row.conf}</td>
              <td style={{ padding: '16px', color: 'var(--text-gray)' }}>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SYSTEM TAB
// -----------------------------------------------------------------------------
function SystemSettings({ emailAddress, setEmailAddress, modelSelection, setModelSelection }) {
  return (
    <div style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="card">
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} /> Application Settings</h2>
        
        <div className="input-group">
          <label>Global Administrator Email</label>
          <div className="input-field">
            <Mail size={16} color="var(--text-light)" style={{ marginRight: '8px' }} />
            <input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '8px' }}>This email permanently receives ticket dispatches.</p>
        </div>

        <div className="input-group" style={{ marginTop: '24px' }}>
          <label>Root Roboflow Instance</label>
          <div className="input-field">
            <Activity size={16} color="var(--text-light)" style={{ marginRight: '8px' }} />
            <input type="text" value={modelSelection} onChange={(e) => setModelSelection(e.target.value)} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '8px' }}>Format: username/project/version</p>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '32px' }} onClick={() => alert("Settings saved locally to state.")}>Save System Configuration</button>
      </div>
    </div>
  );
}

export default App;
