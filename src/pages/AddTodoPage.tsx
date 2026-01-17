import { useState, FormEvent } from 'react';
import { Priority } from '../types';

interface AddTodoPageProps {
  onAdd: (title: string, description?: string, priority?: Priority) => void;
  onComplete: () => void;
  apiKey: string;
  hasApiKey: boolean;
}

interface GeneratedTask {
  title: string;
  description?: string;
  priority: Priority;
}

const AddTodoPage = ({ onAdd, onComplete, apiKey, hasApiKey }: AddTodoPageProps) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  // AI mode
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [error, setError] = useState('');

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description || undefined, priority);
      setTitle('');
      setDescription('');
      setPriority('medium');
      onComplete();
    }
  };

  const handleAiGenerate = async () => {
    if (!prompt.trim() || !apiKey) return;

    setIsLoading(true);
    setError('');
    setGeneratedTasks([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `以下のリクエストからタスクを生成してください。JSON配列で返してください。各タスクは {title: string, description?: string, priority: "high" | "medium" | "low"} の形式です。タスク名は簡潔に、説明は必要に応じて追加してください。JSONのみを返してください。

リクエスト: ${prompt}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('APIエラーが発生しました');
      }

      const data = await response.json();
      const content = data.content[0].text;

      // JSONを抽出してパース
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const tasks = JSON.parse(jsonMatch[0]) as GeneratedTask[];
        setGeneratedTasks(tasks);
      } else {
        throw new Error('タスクの生成に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGeneratedTask = (task: GeneratedTask) => {
    onAdd(task.title, task.description, task.priority);
    setGeneratedTasks(generatedTasks.filter((t) => t !== task));
  };

  const handleAddAllTasks = () => {
    generatedTasks.forEach((task) => {
      onAdd(task.title, task.description, task.priority);
    });
    setGeneratedTasks([]);
    setPrompt('');
    onComplete();
  };

  return (
    <div className="add-page">
      <header className="page-header">
        <h1>タスクを追加</h1>
      </header>

      <div className="mode-tabs">
        <button
          className={mode === 'manual' ? 'active' : ''}
          onClick={() => setMode('manual')}
        >
          通常追加
        </button>
        <button
          className={mode === 'ai' ? 'active' : ''}
          onClick={() => setMode('ai')}
          disabled={!hasApiKey}
        >
          AI追加 {!hasApiKey && '(設定必要)'}
        </button>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={handleManualSubmit} className="add-form">
          <div className="form-group">
            <label>タスク名</label>
            <input
              type="text"
              placeholder="例: 資料作成"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>優先度</label>
            <div className="priority-slider">
              <input
                type="range"
                min="0"
                max="2"
                value={priority === 'low' ? 0 : priority === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPriority(val === 0 ? 'low' : val === 1 ? 'medium' : 'high');
                }}
                className={`priority-range priority-${priority}`}
              />
              <div className="priority-labels">
                <span className={priority === 'low' ? 'active' : ''}>低</span>
                <span className={priority === 'medium' ? 'active' : ''}>中</span>
                <span className={priority === 'high' ? 'active' : ''}>高</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>詳細（オプション）</label>
            <textarea
              placeholder="タスクの詳細を入力..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn">
            追加する
          </button>
        </form>
      ) : (
        <div className="ai-form">
          <div className="form-group">
            <label>プロンプト</label>
            <textarea
              placeholder="例: 来週の会議の準備タスクを作成して"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <button
            className="submit-btn"
            onClick={handleAiGenerate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? '生成中...' : 'AIでタスク生成'}
          </button>

          {error && <p className="error-message">{error}</p>}

          {generatedTasks.length > 0 && (
            <div className="generated-tasks">
              <div className="generated-header">
                <h3>生成されたタスク ({generatedTasks.length}件)</h3>
                <button className="add-all-btn" onClick={handleAddAllTasks}>
                  すべて追加
                </button>
              </div>
              {generatedTasks.map((task, index) => (
                <div key={index} className="generated-task">
                  <div className="task-info">
                    <span className={`priority-text priority-${task.priority}`}>
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </span>
                    <div>
                      <strong>{task.title}</strong>
                      {task.description && <p>{task.description}</p>}
                    </div>
                  </div>
                  <button
                    className="add-single-btn"
                    onClick={() => handleAddGeneratedTask(task)}
                  >
                    追加
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddTodoPage;
