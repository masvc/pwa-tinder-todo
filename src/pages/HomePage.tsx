import { Todo, TodoStatus } from '../types';
import SwipeCard from '../components/SwipeCard';

interface HomePageProps {
  todos: Todo[];
  updateTodoStatus: (id: string, status: TodoStatus) => void;
}

const HomePage = ({ todos, updateTodoStatus }: HomePageProps) => {
  const pendingTodos = todos.filter(t => t.status === 'pending');
  const currentTodo = pendingTodos[0];
  const stackedTodos = pendingTodos.slice(1, 4);
  const remainingCount = pendingTodos.length;

  const handleSwipe = (status: TodoStatus) => {
    if (currentTodo) {
      updateTodoStatus(currentTodo.id, status);
    }
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Swipe Todo</h1>
        <p className="subtitle">
          {remainingCount === 0 ? 'タスクなし' :
           remainingCount === 1 ? 'ラスト 1 件' :
           `残り ${remainingCount} 件`}
        </p>
      </header>

      <div className="card-container">
        {currentTodo ? (
          <div className="card-stack" data-count={Math.min(remainingCount, 4)}>
            {stackedTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`background-card priority-${todo.priority}`}
                style={{
                  transform: `scale(${0.94 - index * 0.03}) translateY(${(index + 1) * 8}px)`,
                  opacity: 0.7 - index * 0.15,
                  zIndex: 3 - index,
                }}
              />
            ))}
            <SwipeCard todo={currentTodo} onSwipe={handleSwipe} />
          </div>
        ) : (
          <div className="empty-state">
            <p>すべて処理済み</p>
          </div>
        )}
      </div>

      <div className="swipe-guide">
        <div className="guide-item">
          <span>← 未実施</span>
        </div>
        <div className="guide-item">
          <span>↑ 完了</span>
        </div>
        <div className="guide-item">
          <span>→ 進行中</span>
        </div>
        <div className="guide-item">
          <span>↓ アーカイブ</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
