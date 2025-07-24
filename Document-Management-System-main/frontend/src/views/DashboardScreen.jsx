import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../api';

export default function DashboardScreen({ currentUser, setCurrentUser }) {
  const [view, setView] = useState('documents');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnBar, setShowAnnBar] = useState(true);

  useEffect(() => {
    async function loadAnns() {
      try {
        const token = localStorage.getItem('jwt_token');
        const anns = await fetchAnnouncements(token);
        setAnnouncements(anns);
      } catch {}
    }
    loadAnns();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome, {currentUser.username}!</p>
      </header>

      <main className="main-content" style={{flex:1,padding:'36px',background:'#f8fafc',minHeight:'calc(100vh - 80px)'}}>
        {showAnnBar && announcements.length > 0 && (
          <div style={{background:'#e0e7ff',color:'#23272f',padding:'14px 24px',borderRadius:'8px',marginBottom:'18px',boxShadow:'0 2px 8px rgba(99,102,241,0.08)',position:'relative'}}>
            <b>Announcement:</b> {announcements[0].message}
            <span style={{float:'right',color:'#888',fontSize:'0.98rem'}}>{new Date(announcements[0].createdAt).toLocaleString()}</span>
            <button onClick={()=>setShowAnnBar(false)} style={{position:'absolute',top:6,right:10,background:'none',border:'none',fontSize:'1.2rem',color:'#6366f1',cursor:'pointer'}}>&times;</button>
          </div>
        )}
        <h2>Document Management</h2>
        <p>Here you can manage your documents and announcements.</p>
        <button onClick={() => setView('documents')}>View Documents</button>
        <button onClick={() => setView('announcements')}>View Announcements</button>

        {view === 'documents' && (
          <div>
            <h3>Your Documents</h3>
            <p>You have no documents yet. Add some!</p>
            <button>Add New Document</button>
          </div>
        )}

        {view === 'announcements' && (
          <div>
            <h3>Announcements</h3>
            <p>No announcements yet. Check back later!</p>
            <button>Add New Announcement</button>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Document Management System. All rights reserved.</p>
      </footer>
    </div>
  );
} 