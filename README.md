# Swipe Todo

Tinder風スワイプUIのタスク管理アプリ（GitHub Issues連携）

## スワイプ操作

| 方向 | アクション |
|------|-----------|
| ← | スキップ |
| → | 進行中 |
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

- PATとリポジトリ名（`username/repo`形式）を入力

> **注意**: トークンはsessionStorageに保存されます。タブを閉じると消えます。

## 機能

- GitHub Issuesでタスク管理
- 優先度設定（高/中/低）→ ラベルで管理
- PWA対応

## 開発

```bash
npm install
npm run dev
```
