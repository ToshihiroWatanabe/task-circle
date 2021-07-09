package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 設定のリクエストのモデルクラスです。
 */
@Getter
@Setter
public class SettingRequest {
  /** トークンID */
  private String tokenId;
  /** 設定 */
  private String setting;
}
