package app.taskcircle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.SettingMapper;
import app.taskcircle.model.Setting;

/**
 * 設定に関するサービスクラスです。
 */
@Service
public class SettingService {
    private final SettingMapper settingMapper;

    @Autowired
    public SettingService(SettingMapper settingMapper) {
        this.settingMapper = settingMapper;
    }

    /**
     * ユーザーUUIDから設定を取得します。
     * 
     * @param userUuid ユーザーUUID
     * @return 設定
     */
    public Setting findByUserUuid(String userUuid) {
        return settingMapper.findByUserUuid(userUuid);
    }

    /**
     * 設定を作成します。
     * 
     * @param userUuid ユーザーUUID
     * @return 成功した場合はtrue
     */
    public boolean create(String userUuid) {
        return settingMapper.create(userUuid);
    }

    /**
     * 設定を更新します。
     * 
     * @param setting 設定
     * @return 成功した場合はtrue
     */
    public boolean update(Setting setting) {
        return settingMapper.update(setting);
    }
}
