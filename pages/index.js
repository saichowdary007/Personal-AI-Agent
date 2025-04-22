import { useState, useEffect } from 'react';
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatPanel from '../components/ChatPanel';
import SummarizePanel from '../components/SummarizePanel';
import EmailPanel from '../components/EmailPanel';
import TodoPanel from '../components/TodoPanel';
import TranslatePanel from '../components/TranslatePanel';
import ErrorBoundary from '../components/ErrorBoundary';
import CodePanel from '../components/CodePanel';


export default function Home() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
      });
      if (!res.ok) {
        setError('Login failed');
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setIsLoggedIn(true);
      setUser({ username });
      localStorage.setItem('user', JSON.stringify({ username }));
    } catch (err) {
      setError('Login error');
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMessages([]);
    setContent('');
    setUsername('testuser');
    setPassword('');
    setView('chat');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setMessages((m) => [...m, { from: 'You', text: content }]);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'chat', content }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setMessages((m) => [...m, { from: 'Error', text: errText }]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { from: 'AI', text: data.content }]);
      }
      setContent('');
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { from: 'Error', text: 'Request failed' }]);
    }
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f5' }}>
        <main style={{ background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 340 }}>
          <h1 style={{ marginBottom: 24, textAlign: 'center', color: '#22223b' }}>Sign in to Personal AI Assistant</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: 12, borderRadius: 7, border: '1px solid #c9ada7', fontSize: '1rem' }}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 12, borderRadius: 7, border: '1px solid #c9ada7', fontSize: '1rem' }}
            />
            <button
              type="submit"
              style={{ background: '#4a4e69', color: '#fff', border: 'none', padding: '12px', borderRadius: 7, fontWeight: 500, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <div style={{ color: '#c0392b', marginTop: 8 }}>{error}</div>}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar active={view} onNavigate={setView} />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div style={{ flex: 1, padding: '32px 0', overflow: 'auto' }}>
          {view === 'chat' && (
            <ChatPanel
              messages={messages}
              content={content}
              setContent={setContent}
              onSend={handleSend}
              loading={loading}
            />
          )}
          {view === 'summarize' && <SummarizePanel token={token} />}
          {view === 'email' && <EmailPanel token={token} />}
          {view === 'todo' && <TodoPanel token={token} />}
          {view === 'translate' && (
  <ErrorBoundary>
    <TranslatePanel token={token} />
  </ErrorBoundary>
)}
          {view === 'code' && <CodePanel token={token} />}
        </div>
      </div>
    </div>
  );
}
