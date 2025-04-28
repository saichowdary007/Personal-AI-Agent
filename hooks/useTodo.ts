import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function useTodo() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get token from localStorage when component mounts
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Create a fetcher function that includes the auth token
  const fetcher = async (url: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch todos');
    }
    
    return res.json();
  };

  const { data, error, mutate } = useSWR<Todo[]>(
    token ? '/api/todo' : null, 
    fetcher
  );

  const addTodo = async (task: string) => {
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add todo');
      }

      await mutate();
      toast.success('Todo added!');
    } catch (err: any) {
      toast.error(err.message || 'Error adding todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id: number, task: string) => {
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }

      await mutate();
      toast.success('Todo updated!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete todo');
      }

      await mutate();
      toast.success('Todo deleted!');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting todo');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    // Optimistic UI update
    const prevData = data || [];
    const newData = prevData.map(todo => 
      todo.id === id ? { ...todo, completed } : todo
    );
    
    // Update the cache immediately
    mutate(newData, false);
    
    try {
      const response = await fetch(`/api/todo/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle todo');
      }

      // Update with actual server data
      mutate();
    } catch (err: any) {
      // Revert to previous data on error
      mutate(prevData);
      toast.error(err.message || 'Error toggling todo');
    }
  };

  return {
    todos: data || [],
    isLoading: !data && !error || isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refresh: mutate
  };
} 