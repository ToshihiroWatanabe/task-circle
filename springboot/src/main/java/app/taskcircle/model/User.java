package app.taskcircle.model;

import lombok.Getter;
import lombok.Setter;

/**
 * usersテーブルのモデルクラスです。
 */
@Getter
@Setter
public class User {
    /** ユーザーUUID */
    private String userUuid;
    /** メールアドレス */
    private String email;
    /** トークンID */
    private String tokenId;
}
