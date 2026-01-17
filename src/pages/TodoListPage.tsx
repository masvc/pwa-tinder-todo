import { Todo, TodoStatus } from '../types';
import { useState } from 'react';

type FilterType = TodoStatus | 'all' | 'active';

interface TodoListPageProps {
  todos: Todo[];
  updateTodoStatus: (id: string, status: TodoStatus) => void;
}

const priorityLabel = { high: '高', medium: '中', low: '低' };

const TodoListPage = ({ todos, updateTodoStatus }: TodoListPageProps) => {
  const [filter, setFilter] = useState<FilterType>('active');

  const filteredTodos = filter === 'all'
    ? todos
    : filter === 'active'
    ? todos.filter(t => t.status === 'pending' || t.status === 'inProgress')
    : todos.filter(t => t.status === filter);

  const activeCount = todos.filter(t => t.status === 'pending' || t.status === 'inProgress').length;

  return (
    <div className="list-page">
      <header className="page-header">
        <h1>タスク一覧</h1>
      </header>

      <div className="status-tabs">
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          未完了 ({activeCount})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          完了
        </button>
        <button
          className={filter === 'archived' ? 'active' : ''}
          onClick={() => setFilter('archived')}
        >
          アーカイブ
        </button>
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          全て
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-message">タスクがありません</div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item">
              <span className={`priority-text priority-${todo.priority}`}>
                {priorityLabel[todo.priority]}
              </span>
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
