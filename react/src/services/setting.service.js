import http from "http-common";

/**
 * 設定に関するAPIのリクエストを送信します。
 */
class SettingService {
  findByTokenId(tokenId) {
    return http.post("/setting/findbytokenid", { tokenId });
  }
  update(tokenId, setting) {
    return http.post("/setting/update", { tokenId, setting });
  }
}

export default new SettingService();
