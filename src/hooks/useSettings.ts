import { useState, useEffect } from 'react';

export interface Settings {
  notionDbUrl: string;
  notionUpdatedAt: number | null;
  claudeApiKey: string;
  claudeUpdatedAt: number | null;
  gasWebAppUrl: string;
  gasUpdatedAt: number | null;
  gasConnected: boolean;
}

const STORAGE_KEY = 'swipe-todo-settings';

const defaultSettings: Settings = {
  notionDbUrl: '',
  notionUpdatedAt: null,
  claudeApiKey: '',
  claudeUpdatedAt: null,
  gasWebAppUrl: '',
  gasUpdatedAt: null,
  gasConnected: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: {
    notionDbUrl?: string;
    claudeApiKey?: string;
    gasWebAppUrl?: string;
    gasConnected?: boolean;
  }) => {
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
      ...(updates.gasWebAppUrl !== undefined && {
        gasWebAppUrl: updates.gasWebAppUrl,
        gasUpdatedAt: now,
      }),
      ...(updates.gasConnected !== undefined && {
        gasConnected: updates.gasConnected,
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
