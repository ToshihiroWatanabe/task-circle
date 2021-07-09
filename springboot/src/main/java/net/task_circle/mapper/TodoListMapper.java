package net.task_circle.mapper;

import org.apache.ibatis.annotations.Mapper;

import net.task_circle.model.TodoList;

@Mapper
public interface TodoListMapper {
    public TodoList findByUserUuid(String userUuid);

    public boolean create(String userUuid);

    public boolean update(TodoList todoList);
}
