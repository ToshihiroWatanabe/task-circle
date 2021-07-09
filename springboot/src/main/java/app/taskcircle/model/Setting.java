package app.taskcircle.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

/**
 * settingsテーブルのモデルクラスです。
 */
@Getter
@Setter
public class Setting {
    /** ユーザーUUID */
    private String userUuid;
    /** 設定 */
    private String setting;
    /** 更新時刻 */
    private LocalDateTime updatedAt;

}
