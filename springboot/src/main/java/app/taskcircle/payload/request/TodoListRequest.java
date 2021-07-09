package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * ToDoリストのリクエストのモデルクラスです。
 */
@Getter
@Setter
public class TodoListRequest {
    /** トークンID */
    private String tokenId;
    /** ToDoリスト */
    private String todoList;
}
