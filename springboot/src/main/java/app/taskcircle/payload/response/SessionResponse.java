package app.taskcircle.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionResponse {
    private String sessionId;
    private String userName;
    private String sessionType;
    private String content;
    private Boolean isTimerOn;
    private Long startedAt;
    private Long finishAt;
}
