package net.task_circle.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodoListRequest {
    private String tokenId;
    private String todoList;
}
