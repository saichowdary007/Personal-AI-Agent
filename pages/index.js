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
  // ...state and handlers remain unchanged

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
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE}/token`, {
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
    setMessages((m) => [...m, { from: 'You', content }]);
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE}/assist`, {
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
        setMessages((m) => [...m, { from: 'AI', content: data.content }]);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <form
          onSubmit={handleLogin}
          className="max-w-xs w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold mb-2 text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && (
            <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2 text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-1 min-h-0">
        <Sidebar active={view} onNavigate={setView} />
        <main className="flex-1 min-w-0 p-2 sm:p-6 overflow-auto">
          <ErrorBoundary>
            {view === 'chat' && (
              <ChatPanel
                messages={messages}
                content={content}
                setContent={setContent}
                onSend={handleSend}
                loading={loading}
                typing={loading}
              />
            )}
            {view === 'summarize' && <SummarizePanel token={token} />}
            {view === 'email' && <EmailPanel token={token} />}
            {view === 'todo' && <TodoPanel token={token} />}
            {view === 'translate' && <TranslatePanel token={token} />}
            {view === 'code' && <CodePanel token={token} />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
