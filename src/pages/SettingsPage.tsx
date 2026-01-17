import { useState, useRef } from 'react';
import { Settings } from '../hooks/useSettings';
import { Todo } from '../types';

interface SettingsPageProps {
  settings: Settings;
  updateSettings: (updates: {
    claudeApiKey?: string;
  }) => void;
  todos: Todo[];
  onSyncFromSheet: (todos: Todo[]) => void;
}

const SettingsPage = ({ settings, updateSettings, todos, onSyncFromSheet }: SettingsPageProps) => {
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedClaude, setSavedClaude] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveClaude = () => {
    if (claudeApiKey) {
      updateSettings({ claudeApiKey });
      setClaudeApiKey('');
      setSavedClaude(true);
      setTimeout(() => setSavedClaude(false), 2000);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return '未設定';
    return new Date(timestamp).toLocaleString('ja-JP');
  };

  const maskApiKey = (key: string) => {
    if (!key) return '未設定';
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  };

  // JSONエクスポート
  const handleExport = () => {
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swipe-todo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSONインポート
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onSyncFromSheet(imported);
          setImportMessage(`${imported.length}件 インポート完了`);
          setTimeout(() => setImportMessage(''), 3000);
        } else {
          throw new Error('Invalid format');
        }
      } catch {
        setImportMessage('エラー: JSONファイルを確認してください');
        setTimeout(() => setImportMessage(''), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>設定</h1>
      </header>

      <div className="settings-form">
        {/* データ管理 */}
        <div className="settings-section">
          <div className="settings-group">
            <label>データ管理</label>
            <p className="settings-hint">タスクデータのバックアップ・復元</p>
          </div>
          <div className="gas-buttons">
            <button className="gas-btn" onClick={handleExport}>
              エクスポート
            </button>
            <button className="gas-btn" onClick={() => fileInputRef.current?.click()}>
              インポート
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
          {importMessage && (
            <p className={`gas-message ${importMessage.startsWith('エラー') ? 'error' : ''}`}>
              {importMessage}
            </p>
          )}
          <p className="settings-hint" style={{ marginTop: 8 }}>
            現在 {todos.length} 件のタスク
          </p>
        </div>

        {/* Claude API Key */}
        <div className="settings-section">
          <div className="settings-group">
            <label>Claude API Key</label>
            <div className="api-key-display">
              <span className="masked-key">{maskApiKey(settings.claudeApiKey)}</span>
              {settings.claudeApiKey && (
                <span className="key-status">設定済み</span>
              )}
            </div>
            <input
              type={showApiKey ? 'text' : 'password'}
              placeholder="sk-ant-..."
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? '隠す' : '表示'}
            </button>
            <p className="settings-hint">AIタスク生成に使用</p>
            <p className="settings-timestamp">設定日時: {formatDate(settings.claudeUpdatedAt)}</p>
          </div>
          <button className="save-btn-small" onClick={handleSaveClaude} disabled={!claudeApiKey}>
            {savedClaude ? '保存しました' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
