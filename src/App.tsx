import { useState, useEffect, useCallback } from 'react';
import { useGitHub } from './hooks/useGitHub';
import { Todo, TodoStatus, Priority } from './types';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TodoListPage from './pages/TodoListPage';
import AddTodoPage from './pages/AddTodoPage';
import './App.css';

type Page = 'home' | 'list' | 'add';

function App() {
  const github = useGitHub();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [initialLoading, setInitialLoading] = useState(true);

  // 初回ロード
  useEffect(() => {
    if (github.isAuthenticated) {
      github.fetchTodos().then((fetchedTodos) => {
        setTodos(fetchedTodos);
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }
  }, [github.isAuthenticated]);

  // ログイン処理
  const handleLogin = async (token: string, repo: string, claudeKey?: string): Promise<boolean> => {
    const success = await github.testAuth(token, repo);
    if (success) {
      github.saveAuth(token, repo, claudeKey);
    }
    return success;
  };

  // タスク追加
  const addTodo = useCallback(async (title: string, description?: string, priority?: Priority) => {
    const newTodo = await github.createTodo(title, description, priority);
    if (newTodo) {
      setTodos(prev => [newTodo, ...prev]);
    }
  }, [github]);

  // ステータス更新
  const updateTodoStatus = useCallback(async (id: string, status: TodoStatus) => {
    // 楽観的更新
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status } : t));

    const success = await github.updateTodoStatus(id, status);
    if (!success) {
      // 失敗したら元に戻す
      const refreshed = await github.fetchTodos();
      setTodos(refreshed);
    }
  }, [github]);

  // スキップ（後ろに回す）
  const skipTodo = useCallback((id: string) => {
    setTodos(prev => {
      const todo = prev.find(t => t.id === id);
      if (!todo) return prev;
      return [...prev.filter(t => t.id !== id), todo];
    });
  }, []);

  // 進行中を戻す
  const refreshTodos = useCallback(() => {
    setTodos(prev => prev.map(t =>
      t.status === 'inProgress' ? { ...t, status: 'pending' as TodoStatus } : t
    ));
  }, []);

  // 未認証ならログイン画面
  if (!github.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 初回ロード中
  if (initialLoading) {
    return (
      <div className="app">
        <div className="loading-screen">読み込み中...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            todos={todos}
            updateTodoStatus={updateTodoStatus}
            skipTodo={skipTodo}
            refreshTodos={refreshTodos}
          />
        );
      case 'list':
        return <TodoListPage todos={todos} updateTodoStatus={updateTodoStatus} />;
      case 'add':
        return (
          <AddTodoPage
            onAdd={addTodo}
            onComplete={() => setCurrentPage('home')}
            claudeKey={github.claudeKey}
            hasClaudeKey={github.hasClaudeKey}
          />
        );
      default:
        return null;
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
          <span className="nav-icon">☰</span>
          <span className="nav-label">一覧</span>
        </button>
        <button
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => setCurrentPage('home')}
        >
          <span className="nav-icon">◉</span>
          <span className="nav-label">ホーム</span>
        </button>
        <button
          className={currentPage === 'add' ? 'active' : ''}
          onClick={() => setCurrentPage('add')}
        >
          <span className="nav-icon">+</span>
          <span className="nav-label">追加</span>
        </button>
        <button onClick={github.logout}>
          <span className="nav-icon">↩</span>
          <span className="nav-label">ログアウト</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
