package app.taskcircle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.TodoListMapper;
import app.taskcircle.model.TodoList;

@Service
public class TodoListService {
    private final TodoListMapper todoListMapper;

    @Autowired
    public TodoListService(TodoListMapper todoListMapper) {
        this.todoListMapper = todoListMapper;
    }

    public TodoList findByUserUuid(String userUuid) {
        return todoListMapper.findByUserUuid(userUuid);
    }

    public boolean create(String userUuid) {
        return todoListMapper.create(userUuid);
    }

    public boolean update(TodoList todoList) {
        return todoListMapper.update(todoList);
    }
}
