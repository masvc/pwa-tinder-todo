export type TodoStatus = 'pending' | 'completed' | 'inProgress' | 'archived';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
}

export interface SwipeDirection {
  x: number;
  y: number;
}
