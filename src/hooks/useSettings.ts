import { useState, useEffect } from 'react';

export interface Settings {
  notionDbUrl: string;
  notionUpdatedAt: number | null;
  claudeApiKey: string;
  claudeUpdatedAt: number | null;
}

const STORAGE_KEY = 'swipe-todo-settings';

const defaultSettings: Settings = {
  notionDbUrl: '',
  notionUpdatedAt: null,
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

  const updateSettings = (updates: { notionDbUrl?: string; claudeApiKey?: string }) => {
    const now = Date.now();
    setSettings((prev) => ({
      ...prev,
      ...(updates.notionDbUrl !== undefined && {
        notionDbUrl: updates.notionDbUrl,
        notionUpdatedAt: now,
      }),
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
