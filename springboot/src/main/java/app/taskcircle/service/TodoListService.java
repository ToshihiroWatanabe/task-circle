package app.taskcircle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.TodoListMapper;
import app.taskcircle.model.TodoList;

/**
 * ToDoリストに関するサービスクラスです。
 */
@Service
public class TodoListService {
    private final TodoListMapper todoListMapper;

    @Autowired
    public TodoListService(TodoListMapper todoListMapper) {
        this.todoListMapper = todoListMapper;
    }

    /**
     * ユーザーUUIDからToDoリストを取得します。
     * 
     * @param userUuid ユーザーUUID
     * @return ToDoリスト
     */
    public TodoList findByUserUuid(String userUuid) {
        return todoListMapper.findByUserUuid(userUuid);
    }

    /**
     * ToDoリストを作成します。
     * 
     * @param userUuid ユーザーUUID
     * @return 成功した場合はtrue
     */
    public boolean create(String userUuid) {
        return todoListMapper.create(userUuid);
    }

    /**
     * ToDoリストを更新します。
     * 
     * @param todoList ToDoリスト
     * @return 成功した場合はtrue
     */
    public boolean update(TodoList todoList) {
        return todoListMapper.update(todoList);
    }
}
