import http from "../http-common";

/**
 * 認証に関するAPIのリクエストを送信します。
 */
class AuthService {
  login(obj) {
    return http.post("/auth/login", obj);
  }
}

export default new AuthService();
