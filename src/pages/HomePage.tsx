import { Todo, TodoStatus } from '../types';
import SwipeCard from '../components/SwipeCard';

interface HomePageProps {
  todos: Todo[];
  updateTodoStatus: (id: string, status: TodoStatus) => void;
}

const HomePage = ({ todos, updateTodoStatus }: HomePageProps) => {
  const pendingTodos = todos.filter(t => t.status === 'pending');
  const currentTodo = pendingTodos[0];
  const nextTodos = pendingTodos.slice(1, 3);

  const handleSwipe = (status: TodoStatus) => {
    if (currentTodo) {
      updateTodoStatus(currentTodo.id, status);
    }
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Swipe Todo</h1>
        <p className="subtitle">残り {pendingTodos.length} 件</p>
      </header>

      <div className="card-container">
        {currentTodo ? (
          <div className="card-stack">
            {nextTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="background-card"
                style={{
                  transform: `scale(${0.95 - index * 0.02}) translateY(${(index + 1) * 4}px)`,
                  opacity: 0.5 - index * 0.2,
                  zIndex: 2 - index,
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
