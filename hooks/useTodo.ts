import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTodo() {
  const { data, error, mutate } = useSWR<Todo[]>('/api/todo', fetcher);
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = async (task: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
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
    setIsLoading(true);
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
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
    setIsLoading(true);
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
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
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
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