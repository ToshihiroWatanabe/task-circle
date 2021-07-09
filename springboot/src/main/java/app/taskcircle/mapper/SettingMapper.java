package app.taskcircle.mapper;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.Setting;

/**
 * settingsテーブルのマッパーインターフェースです。
 */
@Mapper
public interface SettingMapper {

    /**
     * ユーザーUUIDから設定を取得します。
     * 
     * @param userUuid ユーザーUUID
     * @return 設定
     */
    public Setting findByUserUuid(String userUuid);

    /**
     * 設定を作成します。
     * 
     * @param userUuid ユーザーUUID
     * @return 成功した場合はtrue
     */
    public boolean create(String userUuid);

    /**
     * 設定を更新します。
     * 
     * @param setting 設定
     * @return 成功した場合はtrue
     */
    public boolean update(Setting setting);
}
