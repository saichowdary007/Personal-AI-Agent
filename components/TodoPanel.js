import React, { useState, useEffect } from 'react';
import styles from '../styles/TodoPanel.module.css';

export default function TodoPanel({ token }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTodos(data.content ? data.content.split('\n') : []);
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

  return (
    <section className={styles.panel}>
      <h2>Todo List</h2>
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
      </form>
      <ul className={styles.list}>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      {error && <div className={styles.error}>{error}</div>}
    </section>
  );
}
