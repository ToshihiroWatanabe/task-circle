import http from "../http-common";

/**
 * Todoリストに関するAPIのリクエストを送信します。
 */
class TodoListService {
  findByTokenId(tokenId) {
    return http.post("/todolist/findbytokenid", { tokenId });
  }
  update(tokenId, todoList) {
    return http.post("/todolist/update", { tokenId, todoList });
  }
}

export default new TodoListService();
