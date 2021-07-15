import http from "http-common";

/**
 * 認証に関するAPIのリクエストを送信します。
 */
class AuthService {
  login(obj: { tokenId: string; email: string }) {
    return http.post("/auth/login", obj);
  }
}

export default new AuthService();
