import React, { useState, useEffect } from 'react';
import styles from '../styles/TodoPanel.module.css';

export default function TodoPanel({ token }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]); // For bulk actions

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/todos', {
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
      const res = await fetch('http://localhost:8000/assist', {
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
    if (status === 'completed') return styles.completed;
    if (status === 'overdue') return styles.overdue;
    if (status === 'due_soon') return styles.dueSoon;
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
        await fetch(`http://localhost:8000/todos/complete/${todo.id}`, {
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
    <section className={styles.panel}>
      <h2>Todo List</h2>
      <div className={styles.hint}>
        <em>Tip: Use <b>#tag</b>, <b>!high</b>, or words like "tomorrow" in your todo for smart parsing.</em>
      </div>
      <form onSubmit={handleAdd} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Add a new todo..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className={styles.btn} disabled={loading || !input.trim()}>
          Add
        </button>
        {selected.length > 0 && (
          <button type="button" className={styles.bulkBtn} onClick={handleBulkComplete} disabled={loading}>
            Mark {selected.length} as Done
          </button>
        )}
      </form>
      <ul className={styles.list}>
        {todos.map((todo, idx) => (
          <li key={todo.id || idx} className={getStatusClass(todo.status)}>
            <input
              type="checkbox"
              checked={selected.includes(idx)}
              onChange={() => handleSelect(idx)}
              disabled={todo.status === 'completed'}
            />
            <span className={styles.title}>{todo.title}</span>
            {todo.priority && <span className={styles.priority}>[{todo.priority}]</span>}
            {todo.tags && todo.tags.length > 0 && (
              <span className={styles.tags}>{todo.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}</span>
            )}
            {todo.due_date && <span className={styles.dueDate}>Due: {new Date(todo.due_date).toLocaleDateString()}</span>}
            {todo.status === 'overdue' && <span className={styles.status}>Overdue</span>}
            {todo.status === 'due_soon' && <span className={styles.status}>Due Soon</span>}
            {todo.status === 'completed' && <span className={styles.status}>Done</span>}
          </li>
        ))}
      </ul>
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
