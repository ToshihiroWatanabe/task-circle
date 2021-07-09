package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 認証のリクエストのモデルクラスです。
 */
@Getter
@Setter
public class AuthRequest {
    /** トークンID */
    private String tokenId;
    /** メールアドレス */
    private String email;
}
