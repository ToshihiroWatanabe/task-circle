-- sessionテーブルにデータを挿入
INSERT INTO sessions(
    session_id,
    user_name,
    session_type,
    content,
    is_timer_on,
    started_at,
    finish_at
    )
VALUES(
    'test',
    'たすくん',
    'work',
    'テスト作業',
    false,
    null,
    null
    );