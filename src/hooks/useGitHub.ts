import { useState, useCallback } from 'react';
import { Todo, TodoStatus, Priority } from '../types';

const GITHUB_API = 'https://api.github.com';

// ラベル名の定義
const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'priority:high',
  medium: 'priority:medium',
  low: 'priority:low',
};

const STATUS_LABELS: Record<TodoStatus, string> = {
  pending: 'status:pending',
  inProgress: 'status:inProgress',
  completed: 'status:completed',
  archived: 'status:archived',
};

interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: { name: string }[];
  created_at: string;
}

export const useGitHub = () => {
  const [token, setToken] = useState<string>(() => {
    return sessionStorage.getItem('github-pat') || '';
  });
  const [repo, setRepo] = useState<string>(() => {
    return sessionStorage.getItem('github-repo') || '';
  });
  const [claudeKey, setClaudeKey] = useState<string>(() => {
    return sessionStorage.getItem('claude-key') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = token.length > 0 && repo.length > 0;
  const hasClaudeKey = claudeKey.length > 0;

  const saveAuth = useCallback((newToken: string, newRepo: string, newClaudeKey?: string) => {
    sessionStorage.setItem('github-pat', newToken);
    sessionStorage.setItem('github-repo', newRepo);
    if (newClaudeKey) {
      sessionStorage.setItem('claude-key', newClaudeKey);
      setClaudeKey(newClaudeKey);
    }
    setToken(newToken);
    setRepo(newRepo);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('github-pat');
    sessionStorage.removeItem('github-repo');
    sessionStorage.removeItem('claude-key');
    setToken('');
    setRepo('');
    setClaudeKey('');
  }, []);

  const apiRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const response = await fetch(`${GITHUB_API}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
  }, [token]);

  // Issueの優先度ラベルを取得
  const getPriorityFromLabels = (labels: { name: string }[]): Priority => {
    for (const label of labels) {
      if (label.name === 'priority:high') return 'high';
      if (label.name === 'priority:medium') return 'medium';
      if (label.name === 'priority:low') return 'low';
    }
    return 'medium';
  };

  // Issueのステータスラベルを取得
  const getStatusFromLabels = (labels: { name: string }[], state: 'open' | 'closed'): TodoStatus => {
    if (state === 'closed') return 'completed';
    for (const label of labels) {
      if (label.name === 'status:inProgress') return 'inProgress';
      if (label.name === 'status:archived') return 'archived';
    }
    return 'pending';
  };

  // IssueをTodoに変換
  const issueToTodo = (issue: GitHubIssue): Todo => ({
    id: String(issue.number),
    title: issue.title,
    description: issue.body || undefined,
    priority: getPriorityFromLabels(issue.labels),
    status: getStatusFromLabels(issue.labels, issue.state),
    createdAt: new Date(issue.created_at).getTime(),
  });

  // 全Issueを取得
  const fetchTodos = useCallback(async (): Promise<Todo[]> => {
    if (!isAuthenticated) return [];

    setLoading(true);
    setError(null);

    try {
      const [openIssues, closedIssues] = await Promise.all([
        apiRequest(`/repos/${repo}/issues?state=open&per_page=100`),
        apiRequest(`/repos/${repo}/issues?state=closed&per_page=100`),
      ]);

      const allIssues: GitHubIssue[] = [...openIssues, ...closedIssues];
      return allIssues.map(issueToTodo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, repo, apiRequest]);

  // Issue作成
  const createTodo = useCallback(async (
    title: string,
    description?: string,
    priority: Priority = 'medium'
  ): Promise<Todo | null> => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);

    try {
      const issue = await apiRequest(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          body: description || '',
          labels: [PRIORITY_LABELS[priority], STATUS_LABELS.pending],
        }),
      });

      return issueToTodo(issue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, repo, apiRequest]);

  // Issueのステータス更新
  const updateTodoStatus = useCallback(async (
    id: string,
    status: TodoStatus
  ): Promise<boolean> => {
    if (!isAuthenticated) return false;

    setLoading(true);
    setError(null);

    try {
      // 現在のIssueを取得
      const issue: GitHubIssue = await apiRequest(`/repos/${repo}/issues/${id}`);

      // 現在のラベルからステータスラベルを除去
      const currentLabels = issue.labels
        .map(l => l.name)
        .filter(name => !name.startsWith('status:'));

      // 新しいステータスラベルを追加
      const newLabels = [...currentLabels, STATUS_LABELS[status]];

      // IssueをクローズするかどうかOpenするか
      const state = status === 'completed' ? 'closed' : 'open';

      await apiRequest(`/repos/${repo}/issues/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ labels: newLabels, state }),
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, repo, apiRequest]);

  // 認証テスト
  const testAuth = useCallback(async (testToken: string, testRepo: string): Promise<boolean> => {
    try {
      const response = await fetch(`${GITHUB_API}/repos/${testRepo}`, {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    token,
    repo,
    claudeKey,
    isAuthenticated,
    hasClaudeKey,
    loading,
    error,
    saveAuth,
    logout,
    testAuth,
    fetchTodos,
    createTodo,
    updateTodoStatus,
  };
};
