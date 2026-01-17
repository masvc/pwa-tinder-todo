import { useState } from 'react';

interface LoginPageProps {
  onLogin: (token: string, repo: string, claudeKey?: string) => Promise<boolean>;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !repo) return;

    setLoading(true);
    setError('');

    const success = await onLogin(token, repo, claudeKey || undefined);

    if (!success) {
      setError('認証に失敗しました。トークンとリポジトリを確認してください。');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Swipe Todo</h1>
        <p className="login-subtitle">GitHubでタスク管理</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>GitHub PAT *</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>リポジトリ *</label>
            <input
              type="text"
              placeholder="username/my-tasks"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Claude API Key（AI生成用・任意）</label>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '認証中...' : 'ログイン'}
          </button>
        </form>

        <div className="login-help">
          <p className="help-note">
            ※ 入力情報はタブを閉じると消えます
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
