import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import HomePage from './pages/HomePage';
import TodoListPage from './pages/TodoListPage';
import AddTodoPage from './pages/AddTodoPage';
import './App.css';

type Page = 'home' | 'list' | 'add';

function App() {
  const { todos, addTodo, updateTodoStatus, skipTodo, refreshTodos } = useTodos();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage todos={todos} updateTodoStatus={updateTodoStatus} skipTodo={skipTodo} refreshTodos={refreshTodos} />;
      case 'list':
        return <TodoListPage todos={todos} updateTodoStatus={updateTodoStatus} />;
      case 'add':
        return <AddTodoPage onAdd={addTodo} onComplete={() => setCurrentPage('home')} />;
      default:
        return <HomePage todos={todos} updateTodoStatus={updateTodoStatus} skipTodo={skipTodo} refreshTodos={refreshTodos} />;
    }
  };

  return (
    <div className="app">
      <main className="main-content">
        {renderPage()}
      </main>

      <nav className="bottom-nav">
        <button
          className={currentPage === 'list' ? 'active' : ''}
          onClick={() => setCurrentPage('list')}
        >
          <span className="nav-icon">list</span>
          <span className="nav-label">一覧</span>
        </button>
        <button
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => setCurrentPage('home')}
        >
          <span className="nav-icon">home</span>
          <span className="nav-label">ホーム</span>
        </button>
        <button
          className={currentPage === 'add' ? 'active' : ''}
          onClick={() => setCurrentPage('add')}
        >
          <span className="nav-icon">add</span>
          <span className="nav-label">追加</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
