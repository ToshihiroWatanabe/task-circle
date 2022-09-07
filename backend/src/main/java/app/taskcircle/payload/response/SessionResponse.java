package app.taskcircle.payload.response;

import lombok.Getter;
import lombok.Setter;

/**
 * セッションのレスポンスのモデルクラスです。
 */
@Getter
@Setter
public class SessionResponse {
    /** セッションID */
    private String sessionId;
    /** ユーザー名 */
    private String userName;
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
