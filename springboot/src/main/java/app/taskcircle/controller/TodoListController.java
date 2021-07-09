package app.taskcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.taskcircle.model.TodoList;
import app.taskcircle.model.User;
import app.taskcircle.payload.request.TodoListRequest;
import app.taskcircle.service.TodoListService;
import app.taskcircle.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Todoリストに関するコントローラークラスです。
 */
@RestController
@RequestMapping("/api/todolist")
public class TodoListController {

    private final UserService userService;
    private final TodoListService todoListService;

    @Autowired
    public TodoListController(UserService userService, TodoListService todoListService) {
        this.userService = userService;
        this.todoListService = todoListService;
    }

    /**
     * トークンIDからToDoリストを取得するリクエストを受けて、結果を返します。
     * 
     * @param request ToDoリストのリクエスト
     * @return ToDoリスト
     */
    @PostMapping("/findbytokenid")
    public TodoList findByTokenId(@RequestBody TodoListRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        return todoListService.findByUserUuid(user.getUserUuid());
    }

    /**
     * ToDoリストを更新するリクエストを受けて、結果を返します。
     * 
     * @param request ToDoリストのリクエスト
     * @return 成功した場合はtrue
     */
    @PostMapping("/update")
    public boolean update(@RequestBody TodoListRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        TodoList todoList = new TodoList();
        todoList.setUserUuid(user.getUserUuid());
        todoList.setTodoList(request.getTodoList());
        return todoListService.update(todoList);
    }
}
