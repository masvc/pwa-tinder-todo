import { useState, useEffect } from 'react';

export interface Settings {
  claudeApiKey: string;
  claudeUpdatedAt: number | null;
}

const STORAGE_KEY = 'swipe-todo-settings';

const defaultSettings: Settings = {
  claudeApiKey: '',
  claudeUpdatedAt: null,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: { claudeApiKey?: string }) => {
    const now = Date.now();
    setSettings((prev) => ({
      ...prev,
      ...(updates.claudeApiKey !== undefined && {
        claudeApiKey: updates.claudeApiKey,
        claudeUpdatedAt: now,
      }),
    }));
  };

  const hasApiKey = settings.claudeApiKey.length > 0;

  return {
    settings,
    updateSettings,
    hasApiKey,
  };
};
