export type TodoStatus = 'pending' | 'completed' | 'inProgress' | 'archived';
export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  createdAt: number;
}

