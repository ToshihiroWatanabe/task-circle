-- セッションテーブル
CREATE TABLE IF NOT EXISTS sessions(
    -- セッションID
    session_id VARCHAR(36) NOT NULL PRIMARY KEY,
    -- ユーザー名
    user_name VARCHAR(24) NOT NULL,
    -- メールアドレス
    email VARCHAR(100) UNIQUE,
    -- セッションタイプ(work, breakなど)
    session_type VARCHAR(50),
    -- 内容(タスク名など)
    content VARCHAR(100),
    -- タイマーがオンかどうか
    is_timer_on BOOLEAN,
    -- 開始時刻
    started_at DATETIME,
    -- 終了予定時刻
    finish_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users(
    -- ユーザーUUID
    user_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    -- メールアドレス
    email VARCHAR(100) NOT NULL UNIQUE,
    -- トークンID
    token_id TEXT(2048),
    -- ユーザー名
    user_name VARCHAR(24),
    -- プロフィール画像のURL
    image_url VARCHAR(255),
    -- Todoリスト
    -- todo_lists JSON,
    -- 設定
    -- settings JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- CHECK (JSON_VALID(todo_lists)),
    -- CHECK (JSON_VALID(settings))
);

-- 個人の統計テーブル
-- 全体の統計テーブル