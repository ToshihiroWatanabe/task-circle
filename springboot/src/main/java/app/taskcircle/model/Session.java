package app.taskcircle.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Session {
    private String sessionId;
    private String userName;
    private String userId;
    private String sessionType;
    private String content;
    private Boolean isTimerOn;
    private Long startedAt;
    private Long finishAt;
}
