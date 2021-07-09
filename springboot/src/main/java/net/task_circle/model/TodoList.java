package net.task_circle.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodoList {
    private String userUuid;
    private String todoList;
    private LocalDateTime updatedAt;
}
