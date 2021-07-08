import http from "../http-common";

/**
 * 設定に関するAPIのリクエストを送信します。
 */
class SettingService {
  findAll(tokenId) {
    return http.post("/setting/findall", { tokenId });
  }
  update(tokenId, settings) {
    return http.post("/setting/update", { tokenId, settings });
  }
}

export default new SettingService();
