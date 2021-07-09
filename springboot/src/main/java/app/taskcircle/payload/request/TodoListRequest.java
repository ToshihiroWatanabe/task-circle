package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * ToDoリストのリクエストのモデルクラスです。
 */
@Getter
@Setter
public class TodoListRequest {
    private String tokenId;
    private String todoList;
}
