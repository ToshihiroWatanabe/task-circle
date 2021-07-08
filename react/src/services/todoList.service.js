import http from "../http-common";

/**
 * Todoリストに関するAPIのリクエストを送信します。
 */
class TodoListService {
  findAll(tokenId) {
    return http.post("/todolist/findall", { tokenId });
  }
  update(tokenId, todoLists) {
    return http.post("/todolist/update", { tokenId, todoLists });
  }
}

export default new TodoListService();
