import { useState, FormEvent } from 'react';
import { Priority } from '../types';

interface AddTodoPageProps {
  onAdd: (title: string, description?: string, priority?: Priority) => void;
  onComplete: () => void;
}

const AddTodoPage = ({ onAdd, onComplete }: AddTodoPageProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description || undefined, priority);
      setTitle('');
      setDescription('');
      setPriority('medium');
      onComplete();
    }
  };

  return (
    <div className="add-page">
      <header className="page-header">
        <h1>タスクを追加</h1>
      </header>

      <form onSubmit={handleSubmit} className="add-form">
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
              value={priority === 'high' ? 0 : priority === 'medium' ? 1 : 2}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPriority(val === 0 ? 'high' : val === 1 ? 'medium' : 'low');
              }}
              className={`priority-range priority-${priority}`}
            />
            <div className="priority-labels">
              <span className={priority === 'high' ? 'active' : ''}>高</span>
              <span className={priority === 'medium' ? 'active' : ''}>中</span>
              <span className={priority === 'low' ? 'active' : ''}>低</span>
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
    </div>
  );
};

export default AddTodoPage;
