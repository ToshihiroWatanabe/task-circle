package app.taskcircle.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * sessionsテーブルのモデルクラスです。
 */
@Getter
@Setter
public class Session {
    /** セッションID */
    private String sessionId;
    /** ユーザー名 */
    private String userName;
    /** メールアドレス */
    private String email;
    /** セッションタイプ */
    private String sessionType;
    /** 内容 */
    private String content;
    /** タイマーがオンかどうか */
    private Boolean isTimerOn;
    /** 開始時刻 */
    private LocalDateTime startedAt;
    /** 終了予定時刻 */
    private LocalDateTime finishAt;
}
