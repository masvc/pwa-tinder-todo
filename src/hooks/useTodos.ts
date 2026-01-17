import { useState, useEffect } from 'react';
import { Todo, TodoStatus } from '../types';

const STORAGE_KEY = 'swipe-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      status: 'pending',
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const updateTodoStatus = (id: string, status: TodoStatus) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return {
    todos,
    addTodo,
    updateTodoStatus,
    deleteTodo,
  };
};
