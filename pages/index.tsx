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

interface User {
  username: string;
}

type ViewType = 'chat' | 'summarize' | 'email' | 'todo' | 'translate' | 'code';

const Home: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('testuser');
  const [password, setPassword] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<ViewType>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [typing, setTyping] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    setMessages((m) => [...m, { from: 'You', content }]);
    setLoading(true);
    setTyping(true);
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
      setTyping(false);
      if (!res.ok) {
        const errText = await res.text();
        setMessages((m) => [...m, { from: 'Error', text: errText }]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { from: 'AI', content: data.content }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { from: 'Error', text: 'Network or server error.' }]);
      setTyping(false);
    }
    setLoading(false);
    setContent('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-1 w-full">
        <Sidebar active={view} onNavigate={(key: string) => setView(key as ViewType)} />
        <main className="flex-1 flex flex-col overflow-hidden p-2 sm:p-6">
          {!isLoggedIn ? (
            <section className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Sign In</h2>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
              </form>
            </section>
          ) : (
            <ErrorBoundary>
              {view === 'chat' && (
                <ChatPanel
                  messages={messages}
                  content={content}
                  setContent={setContent}
                  onSend={handleSend}
                  loading={loading}
                  typing={typing}
                />
              )}
              {view === 'summarize' && <SummarizePanel token={token} />}
              {view === 'email' && <EmailPanel token={token} />}
              {view === 'todo' && <TodoPanel token={token} />}
              {view === 'translate' && <TranslatePanel token={token} />}
              {view === 'code' && <CodePanel token={token} />}
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
