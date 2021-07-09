package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * セッションのリクエストのモデルクラスです。
 */
@Getter
@Setter
public class SessionRequest {
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
    private Long startedAt;
    /** 終了時刻 */
    private Long finishAt;
}
