import { useState } from 'react';
import { Priority } from '../types';

interface AddTodoPageProps {
  onAdd: (title: string, description?: string, priority?: Priority) => void;
  onComplete: () => void;
  claudeKey: string;
  hasClaudeKey: boolean;
}

interface GeneratedTask {
  title: string;
  description?: string;
  priority: Priority;
}

const AddTodoPage = ({ onAdd, onComplete, claudeKey, hasClaudeKey }: AddTodoPageProps) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [error, setError] = useState('');

  // 手動追加
  const handleManualAdd = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onAdd(input.trim());
    setInput('');
    setIsSubmitting(false);
    onComplete();
  };

  // AI生成
  const handleAiGenerate = async () => {
    if (!input.trim() || !claudeKey || isGenerating) return;

    setIsGenerating(true);
    setError('');
    setGeneratedTasks([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeKey,
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

リクエスト: ${input}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      const content = data.content[0].text;

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const tasks = JSON.parse(jsonMatch[0]) as GeneratedTask[];
        setGeneratedTasks(tasks);
      } else {
        throw new Error('Parse error');
      }
    } catch {
      setError('生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成タスクを追加
  const handleAddGenerated = async (task: GeneratedTask) => {
    await onAdd(task.title, task.description, task.priority);
    setGeneratedTasks(prev => prev.filter(t => t !== task));
  };

  // 全て追加
  const handleAddAll = async () => {
    for (const task of generatedTasks) {
      await onAdd(task.title, task.description, task.priority);
    }
    setGeneratedTasks([]);
    setInput('');
    onComplete();
  };

  return (
    <div className="add-page">
      <header className="page-header">
        <h1>タスクを追加</h1>
      </header>

      <div className="add-form">
        <div className="form-group">
          <textarea
            placeholder={hasClaudeKey ? "タスク名 または AIへのリクエスト" : "タスク名を入力"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            autoFocus
          />
        </div>

        <div className="add-buttons">
          <button
            className="add-btn manual"
            onClick={handleManualAdd}
            disabled={!input.trim() || isSubmitting}
          >
            {isSubmitting ? '追加中...' : '追加'}
          </button>
          {hasClaudeKey && (
            <button
              className="add-btn ai"
              onClick={handleAiGenerate}
              disabled={!input.trim() || isGenerating}
            >
              {isGenerating ? '生成中...' : 'AI生成'}
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {generatedTasks.length > 0 && (
          <div className="generated-tasks">
            <div className="generated-header">
              <span>{generatedTasks.length}件</span>
              <button className="add-all-btn" onClick={handleAddAll}>
                すべて追加
              </button>
            </div>
            {generatedTasks.map((task, index) => (
              <div key={index} className="generated-task">
                <div className="task-info">
                  <span className={`priority-dot priority-${task.priority}`} />
                  <div>
                    <strong>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                  </div>
                </div>
                <button
                  className="add-single-btn"
                  onClick={() => handleAddGenerated(task)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTodoPage;
