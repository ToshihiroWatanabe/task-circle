package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * セッションのリクエストのモデルクラスです。
 */
@Getter
@Setter
public class SessionRequest {
    private String sessionId;
    private String userName;
    private String email;
    private String sessionType;
    private String content;
    private Boolean isTimerOn;
    private Long startedAt;
    private Long finishAt;
}
