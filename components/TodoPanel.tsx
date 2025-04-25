import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  content: string;
  due_date?: string;
  status?: string;
}

interface TodoPanelProps {
  token: string;
}

const TodoPanel: React.FC<TodoPanelProps> = ({ token }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number[]>([]); // For bulk actions

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTodos(Array.isArray(data.content) ? data.content : []);
    } catch {
      setError('Failed to fetch todos.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, [token]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
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
      <form onSubmit={handleAdd} className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new todo..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Add
        </button>
      </form>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {todos.map((todo, idx) => (
          <li key={todo.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(idx)}
                onChange={e => setSelected(sel =>
                  e.target.checked
                    ? [...sel, idx]
                    : sel.filter(i => i !== idx)
                )}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className={`text-base ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{todo.content}</span>
            </div>
            <div className="flex flex-col items-end text-xs gap-1">
              {todo.due_date && <span className="text-gray-400">Due: {new Date(todo.due_date).toLocaleDateString()}</span>}
              {todo.status === 'overdue' && <span className="text-red-500">Overdue</span>}
              {todo.status === 'due_soon' && <span className="text-yellow-600">Due Soon</span>}
              {todo.status === 'completed' && <span className="text-green-600">Done</span>}
            </div>
          </li>
        ))}
      </ul>
      {selected.length > 0 && (
        <button
          onClick={handleBulkComplete}
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 mt-2"
          disabled={loading}
        >
          Complete Selected
        </button>
      )}
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600 bg-red-50 dark:bg-red-900 rounded p-2">{error}</div>}
    </section>
  );
};

export default TodoPanel;
