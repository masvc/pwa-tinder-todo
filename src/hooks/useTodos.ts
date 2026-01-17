import { useState, useEffect } from 'react';
import { Todo, TodoStatus, Priority } from '../types';

const STORAGE_KEY = 'swipe-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string, priority: Priority = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      status: 'pending',
      priority,
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

  const skipTodo = (id: string) => {
    const todoToSkip = todos.find(t => t.id === id);
    if (!todoToSkip) return;
    const others = todos.filter(t => t.id !== id);
    setTodos([...others, todoToSkip]);
  };

  const refreshTodos = () => {
    setTodos(todos.map(todo =>
      todo.status === 'inProgress' ? { ...todo, status: 'pending' as TodoStatus } : todo
    ));
  };

  return {
    todos,
    addTodo,
    updateTodoStatus,
    deleteTodo,
    skipTodo,
    refreshTodos,
  };
};
