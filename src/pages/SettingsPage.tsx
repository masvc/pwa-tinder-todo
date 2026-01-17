import { useState, useEffect } from 'react';
import { Settings } from '../hooks/useSettings';

interface SettingsPageProps {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const SettingsPage = ({ settings, updateSettings }: SettingsPageProps) => {
  const [notionDbUrl, setNotionDbUrl] = useState(settings.notionDbUrl);
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotionDbUrl(settings.notionDbUrl);
  }, [settings.notionDbUrl]);

  const handleSave = () => {
    const updates: Partial<Settings> = {
      notionDbUrl,
    };

    if (claudeApiKey) {
      updates.claudeApiKey = claudeApiKey;
    }

    updateSettings(updates);
    setClaudeApiKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>設定</h1>
      </header>

      <div className="settings-form">
        <div className="settings-group">
          <label>Notion Database URL</label>
          <input
            type="url"
            placeholder="https://notion.so/..."
            value={notionDbUrl}
            onChange={(e) => setNotionDbUrl(e.target.value)}
          />
          <p className="settings-hint">連携するNotionデータベースのURL</p>
        </div>

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
        </div>

        <div className="settings-group">
          <label>最終更新日時</label>
          <p className="settings-value">{formatDate(settings.updatedAt)}</p>
        </div>

        <button className="save-btn" onClick={handleSave}>
          {saved ? '保存しました' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
