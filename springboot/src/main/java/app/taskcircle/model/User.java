package app.taskcircle.model;

import lombok.Getter;
import lombok.Setter;

/**
 * ユーザーアカウントのモデルクラスです。
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
    /** 名前 */
    private String name;
    /** プロフィール画像のURL */
    private String imageUrl;
}
