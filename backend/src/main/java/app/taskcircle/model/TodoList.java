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
    /** ユーザーUUID */
    private String userUuid;
    /** ToDoリスト */
    private String todoList;
    /** 更新時刻 */
    private LocalDateTime updatedAt;
}
