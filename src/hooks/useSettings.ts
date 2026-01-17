import { useState, useEffect } from 'react';

export interface Settings {
  notionDbUrl: string;
  claudeApiKey: string;
  updatedAt: number | null;
}

const STORAGE_KEY = 'swipe-todo-settings';

const defaultSettings: Settings = {
  notionDbUrl: '',
  claudeApiKey: '',
  updatedAt: null,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({
      ...settings,
      ...newSettings,
      updatedAt: Date.now(),
    });
  };

  const hasApiKey = settings.claudeApiKey.length > 0;

  return {
    settings,
    updateSettings,
    hasApiKey,
  };
};
