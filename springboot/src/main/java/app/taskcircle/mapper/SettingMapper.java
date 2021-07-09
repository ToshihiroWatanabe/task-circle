package app.taskcircle.mapper;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.Setting;

/**
 * settingsテーブルのマッパーインターフェースです。
 */
@Mapper
public interface SettingMapper {
    public Setting findByUserUuid(String userUuid);

    public boolean create(String userUuid);

    public boolean update(Setting setting);
}
