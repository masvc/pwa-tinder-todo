import { Todo, TodoStatus } from '../types';
import { useState } from 'react';

interface TodoListPageProps {
  todos: Todo[];
  updateTodoStatus: (id: string, status: TodoStatus) => void;
}

const TodoListPage = ({ todos, updateTodoStatus }: TodoListPageProps) => {
  const [filter, setFilter] = useState<TodoStatus | 'all'>('all');

  const filteredTodos = filter === 'all' ? todos : todos.filter(t => t.status === filter);

  const statusCounts = {
    all: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: todos.filter(t => t.status === 'inProgress').length,
    completed: todos.filter(t => t.status === 'completed').length,
    archived: todos.filter(t => t.status === 'archived').length,
  };

  return (
    <div className="list-page">
      <header className="page-header">
        <h1>タスク一覧</h1>
      </header>

      <div className="status-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          全て ({statusCounts.all})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          未実施 ({statusCounts.pending})
        </button>
        <button
          className={filter === 'inProgress' ? 'active' : ''}
          onClick={() => setFilter('inProgress')}
        >
          進行中 ({statusCounts.inProgress})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          完了 ({statusCounts.completed})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-message">タスクがありません</div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item priority-${todo.priority}`}>
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
              </div>
              <select
                value={todo.status}
                onChange={(e) => updateTodoStatus(todo.id, e.target.value as TodoStatus)}
                className="status-select"
              >
                <option value="pending">未実施</option>
                <option value="inProgress">進行中</option>
                <option value="completed">完了</option>
                <option value="archived">アーカイブ</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoListPage;
