import React, { useState, useEffect } from 'react';

export default function TodoPanel({ token }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]); // For bulk actions

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Expecting backend to return array of task objects
      setTodos(Array.isArray(data.content) ? data.content : []);
    } catch {
      setError('Failed to fetch todos.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchTodos(); }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'todo', content: `add ${input}` }),
      });
      if (!res.ok) throw new Error(await res.text());
      setInput('');
      fetchTodos();
    } catch {
      setError('Failed to add todo.');
    }
    setLoading(false);
  };

  // Helper for status-based color
  const getStatusClass = status => {
    if (status === 'completed') return 'text-green-600';
    if (status === 'overdue') return 'text-red-600 font-semibold';
    if (status === 'due_soon') return 'text-yellow-600 font-semibold';
    return '';
  };

  const handleSelect = idx => {
    setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
  };

  const handleBulkComplete = async () => {
    setLoading(true); setError('');
    try {
      for (const idx of selected) {
        const todo = todos[idx];
        if (!todo || todo.status === 'completed') continue;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/complete/${todo.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSelected([]);
      fetchTodos();
    } catch {
      setError('Failed to complete selected todos.');
    }
    setLoading(false);
  };

  return (
    <section className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">Todo List</h2>
      <div className="text-xs text-gray-500 mb-2">
        <em>Tip: Use <b>#tag</b>, <b>!high</b>, or words like "tomorrow" in your todo for smart parsing.</em>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          className="flex-1 rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new todo..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Add
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
            onClick={handleBulkComplete}
            disabled={loading}
          >
            Mark {selected.length} as Done
          </button>
        )}
      </form>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {todos.map((todo, idx) => (
          <li key={todo.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 gap-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(idx)}
                onChange={() => handleSelect(idx)}
                disabled={loading}
                className="accent-blue-600"
              />
              <span className={`text-base ${getStatusClass(todo.status)}`}>{todo.title}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {todo.priority && <span className="text-gray-400">[{todo.priority}]</span>}
              {todo.tags && todo.tags.length > 0 && (
                <span className="flex flex-wrap gap-2">
                  {todo.tags.map(tag => <span key={tag} className="text-gray-400">#{tag}</span>)}
                </span>
              )}
              {todo.due_date && (
                <span className="text-gray-400">Due: {new Date(todo.due_date).toLocaleDateString()}</span>
              )}
              {todo.status === 'overdue' && <span className="text-red-600 font-semibold">Overdue</span>}
              {todo.status === 'due_soon' && <span className="text-yellow-600 font-semibold">Due Soon</span>}
              {todo.status === 'completed' && <span className="text-green-600 font-semibold">Done</span>}
            </div>
          </li>
        ))}
      </ul>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
}
