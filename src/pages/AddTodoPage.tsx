import { useState, FormEvent } from 'react';

interface AddTodoPageProps {
  onAdd: (title: string, description?: string) => void;
  onComplete: () => void;
}

const AddTodoPage = ({ onAdd, onComplete }: AddTodoPageProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description || undefined);
      setTitle('');
      setDescription('');
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
