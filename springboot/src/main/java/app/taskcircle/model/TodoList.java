package app.taskcircle.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * todo_listsテーブルのモデルクラスです。
 */
@Getter
@Setter
public class TodoList {
    private String userUuid;
    private String todoList;
    private LocalDateTime updatedAt;
}
