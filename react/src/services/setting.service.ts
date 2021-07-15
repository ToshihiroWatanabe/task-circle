import http from "http-common";

/**
 * 設定に関するAPIのリクエストを送信します。
 */
class SettingService {
  findByTokenId(tokenId: string) {
    return http.post("/setting/findbytokenid", { tokenId });
  }
  update(tokenId: string, setting: string) {
    return http.post("/setting/update", { tokenId, setting });
  }
}

export default new SettingService();
