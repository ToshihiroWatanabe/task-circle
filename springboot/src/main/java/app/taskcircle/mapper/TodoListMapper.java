package app.taskcircle.mapper;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.TodoList;

/**
 * todo_listsテーブルのマッパーインターフェースです。
 */
@Mapper
public interface TodoListMapper {
    public TodoList findByUserUuid(String userUuid);

    public boolean create(String userUuid);

    public boolean update(TodoList todoList);
}
