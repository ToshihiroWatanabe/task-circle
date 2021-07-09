package app.taskcircle.payload.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 認証のリクエストのモデルクラスです。
 */
@Getter
@Setter
public class AuthRequest {
    private String tokenId;
    private String email;
}
