import { useState, useEffect } from 'react';
import DocumentModal from './DocumentModal';
import { fetchDocuments } from '../api';

export default function DocumentsView({ currentUser }) {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [modalDoc, setModalDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadDocs() {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const docs = await fetchDocuments(token);
      setDocuments(docs);
    } catch (err) {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  const filtered = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleModalClose(reload) {
    setModalDoc(null);
    if (reload) loadDocs();
  }

  function getFileIcon(fileType) {
    const icons = {
      pdf: 'fas fa-file-pdf',
      doc: 'fas fa-file-word',
      docx: 'fas fa-file-word',
      txt: 'fas fa-file-alt',
      jpg: 'fas fa-file-image',
      png: 'fas fa-file-image',
      default: 'fas fa-file'
    };
    return icons[fileType] || icons.default;
  }

  return (
    <div id="documentsView" className="view active">
      <div className="view-header">
        <h2>Documents</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          <i className="fas fa-search"></i>
        </div>
      </div>
      {loading ? <div>Loading documents...</div> : (
      <div className="documents-grid">
        {filtered.length === 0 ? (
          <div style={{padding:'32px',textAlign:'center',color:'#888',width:'100%'}}>No documents found. Upload your first file!</div>
        ) : filtered.map(doc => (
          <div className="document-card" key={doc._id}>
            <div className="document-icon"><i className={getFileIcon(doc.fileType)}></i></div>
            <div className="document-title" title={doc.title}>{doc.title}</div>
            <div className="document-meta">Type: {doc.fileType?.toUpperCase()}</div>
            <div className="document-meta">Size: {(doc.fileSize/1024).toFixed(1)} KB</div>
            <div className="document-meta">Uploaded: {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : ''}</div>
            <div className="document-meta">
              <span className={`access-badge access-${doc.accessLevel}`}>{doc.accessLevel}</span>
            </div>
            <button className="btn btn-primary btn-view-doc" onClick={() => setModalDoc(doc)} style={{marginTop:'10px'}}>View</button>
          </div>
        ))}
      </div>
      )}
      {modalDoc && <DocumentModal doc={modalDoc} currentUser={currentUser} onClose={handleModalClose} showFileButton={true} />}
    </div>
  );
}
