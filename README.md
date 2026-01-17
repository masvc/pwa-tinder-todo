# Swipe Todo

Tinder風スワイプUIのタスク管理PWAアプリ

**デモ**: https://pwa-tinder-todo.vercel.app

## 特徴

- Tinder風のスワイプUIでタスク管理
- GitHub Issuesをバックエンドとして使用
- AIタスク生成（Claude API、任意）
- PWA対応（オフライン・ホーム画面追加可）

## スワイプ操作

| 方向 | アクション |
|------|-----------|
| ← | スキップ（後回し） |
| → | 進行中に変更 |
| ↑ | 完了 |
| ↓ | アーカイブ |

## セットアップ

### 1. GitHubリポジトリを作成

タスク管理用のリポジトリを作成（空でOK）

### 2. Personal Access Token (PAT) を発行

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 「repo」スコープにチェック
5. トークンを生成してコピー

### 3. アプリにログイン

- PATとリポジトリURL（`https://github.com/username/repo`）を入力
- Claude API Key（任意）：AI生成機能を使う場合

> **注意**: 認証情報はsessionStorageに保存されます。タブを閉じると消えます。

## 技術スタック

- React + TypeScript + Vite
- framer-motion（スワイプアニメーション）
- GitHub Issues API
- Vercel（ホスティング）

## 開発

```bash
npm install
npm run dev
```
