package app.taskcircle.mapper;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.TodoList;

/**
 * todo_listsテーブルのマッパーインターフェースです。
 */
@Mapper
public interface TodoListMapper {

    /**
     * ユーザーUUIDからToDoリストを取得します。
     * 
     * @param userUuid ユーザーUUID
     * @return ToDoリスト
     */
    public TodoList findByUserUuid(String userUuid);

    /**
     * ToDoリストを作成します。
     * 
     * @param userUuid ユーザーUUID
     * @return 成功した場合はtrue
     */
    public boolean create(String userUuid);

    /**
     * ToDoリストを更新します。
     * 
     * @param todoList ToDoリスト
     * @return 成功した場合はtrue
     */
    public boolean update(TodoList todoList);
}
