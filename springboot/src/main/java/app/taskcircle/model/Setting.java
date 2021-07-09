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
    private String userUuid;
    private String setting;
    private LocalDateTime updatedAt;

}
