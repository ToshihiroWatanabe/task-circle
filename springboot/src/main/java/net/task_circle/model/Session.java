package net.task_circle.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * sessionsテーブルのモデルクラスです。
 */
@Getter
@Setter
public class Session {
    private String sessionId;
    private String userName;
    private String email;
    private String sessionType;
    private String content;
    private Boolean isTimerOn;
    private LocalDateTime startedAt;
    private LocalDateTime finishAt;
}
