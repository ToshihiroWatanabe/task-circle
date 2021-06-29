-- セッションテーブル
CREATE TABLE IF NOT EXISTS sessions(
    session_id VARCHAR(36),
    user_name VARCHAR(24),
    email VARCHAR(100) UNIQUE,
    session_type VARCHAR(50),
    content VARCHAR(100),
    is_timer_on BOOLEAN,
    started_at DATETIME,
    finish_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);