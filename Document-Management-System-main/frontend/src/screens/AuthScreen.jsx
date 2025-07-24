import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

export default function AuthScreen({ setCurrentUser }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await apiLogin(username, password);
      localStorage.setItem('jwt_token', token);
      setCurrentUser(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  }

  async function handleSignup() {
    if (!username || !password) {
      setError('Please enter a username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiRegister(username, password);
      await handleLogin();
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="screen active login-container dashboard-bg" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div className="auth-glass-card" style={{boxShadow:'0 8px 32px rgba(44,62,80,0.10)',borderRadius:'22px',padding:'48px 36px',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)',minWidth:'340px',maxWidth:'370px',width:'100%',position:'relative'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:32}}>
          <div style={{background:'linear-gradient(135deg,#6366f1 60%,#60a5fa 100%)',borderRadius:'50%',padding:18,marginBottom:16,boxShadow:'0 2px 12px rgba(99,102,241,0.13)'}}>
            <i className="fas fa-lock" style={{fontSize:'2.5rem',color:'#fff'}}></i>
          </div>
          <h1 style={{fontSize:'2.2rem',fontWeight:'bold',color:'#2c3e50',marginBottom:'6px',letterSpacing:'1px'}}>Sign {mode==='login'?'In':'Up'}</h1>
          <p style={{fontSize:'1.1rem',color:'#64748b',marginBottom:'0'}}>Access your SecureDoc account</p>
        </div>
        <div className="form-group" style={{marginBottom:18}}>
          <label htmlFor="username" style={{fontWeight:'bold',fontSize:'1.05rem',color:'#2c3e50'}}>Username</label>
          <input id="username" autoFocus placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && (mode==='login'?handleLogin():handleSignup())} style={{width:'100%',padding:'12px',borderRadius:'9px',border:'1.5px solid #cbd5e1',marginTop:6,fontSize:'1.05rem',background:'rgba(248,250,252,0.95)',transition:'border 0.2s'}} />
        </div>
        <div className="form-group" style={{marginBottom:18}}>
          <label htmlFor="password" style={{fontWeight:'bold',fontSize:'1.05rem',color:'#2c3e50'}}>Password</label>
          <div style={{display:'flex',alignItems:'center',position:'relative'}}>
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && (mode==='login'?handleLogin():handleSignup())} style={{width:'100%',padding:'12px',borderRadius:'9px',border:'1.5px solid #cbd5e1',marginTop:6,fontSize:'1.05rem',background:'rgba(248,250,252,0.95)',transition:'border 0.2s'}} />
            <button type="button" onClick={()=>setShowPassword(v=>!v)} style={{position:'absolute',right:10,top:14,background:'none',border:'none',cursor:'pointer',color:'#6366f1',fontSize:'1.1rem'}} title={showPassword?'Hide password':'Show password'}>
              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
            </button>
          </div>
        </div>
        {error && <div style={{color:'#ef4444',marginBottom:12,textAlign:'center',fontWeight:500}}>{error}</div>}
        <button type="button" className="btn btn-primary auth-btn" style={{width:'100%',fontSize:'1.13rem',marginTop:'6px',marginBottom:'10px',background:'linear-gradient(90deg,#6366f1 60%,#60a5fa 100%)',border:'none',padding:'14px 0',borderRadius:'12px',fontWeight:'bold',boxShadow:'0 2px 8px rgba(99,102,241,0.10)',transition:'background 0.2s,box-shadow 0.2s'}} onClick={mode==='login'?handleLogin:handleSignup} disabled={loading}>
          {loading ? (mode==='login'?'Signing In...':'Signing Up...') : (mode==='login'?'Sign In':'Sign Up')}
        </button>
        <div style={{marginTop:18,textAlign:'center'}}>
          {mode === 'login' ? (
            <>
              <span>Don't have an account? </span>
              <button className="btn btn-link" style={{padding:'0 6px',fontSize:'1rem',color:'#6366f1',background:'none',border:'none',textDecoration:'underline',cursor:'pointer'}} onClick={()=>{setMode('signup');setError('')}}>Sign Up</button>
            </>
          ) : (
            <>
              <span>Already have an account? </span>
              <button className="btn btn-link" style={{padding:'0 6px',fontSize:'1rem',color:'#6366f1',background:'none',border:'none',textDecoration:'underline',cursor:'pointer'}} onClick={()=>{setMode('login');setError('')}}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
