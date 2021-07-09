package net.task_circle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.task_circle.mapper.TodoListMapper;
import net.task_circle.model.TodoList;

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
