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

    @PostMapping("/findbytokenid")
    public TodoList findByTokenId(@RequestBody TodoListRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        return todoListService.findByUserUuid(user.getUserUuid());
    }

    @PostMapping("/update")
    public boolean update(@RequestBody TodoListRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        TodoList todoList = new TodoList();
        todoList.setUserUuid(user.getUserUuid());
        todoList.setTodoList(request.getTodoList());
        return todoListService.update(todoList);
    }
}
