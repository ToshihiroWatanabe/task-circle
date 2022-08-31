-- セッションテーブル
CREATE TABLE IF NOT EXISTS sessions(
    -- セッションID
    session_id VARCHAR(36) NOT NULL PRIMARY KEY,
    -- ユーザー名
    user_name VARCHAR(24) NOT NULL,
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
    -- 作成時刻
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 更新時刻
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
    -- 作成時刻
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 更新時刻
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Todoリストテーブル
CREATE TABLE IF NOT EXISTS todo_lists(
    -- ユーザーUUID
    user_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    -- Todoリスト
    todo_list JSON,
    -- 更新時刻
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (JSON_VALID(todo_list)),
    FOREIGN KEY (user_uuid) REFERENCES users(user_uuid)
);

-- 設定テーブル
CREATE TABLE IF NOT EXISTS settings(
    -- ユーザーUUID
    user_uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    -- 設定
    setting JSON,
    -- 更新時刻
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (JSON_VALID(setting)),
    FOREIGN KEY (user_uuid) REFERENCES users(user_uuid)
);
