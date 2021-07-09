package net.task_circle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.task_circle.mapper.SettingMapper;
import net.task_circle.model.Setting;

@Service
public class SettingService {
    private final SettingMapper settingMapper;

    @Autowired
    public SettingService(SettingMapper settingMapper) {
        this.settingMapper = settingMapper;
    }

    public Setting findByUserUuid(String userUuid) {
        return settingMapper.findByUserUuid(userUuid);
    }

    public boolean create(String userUuid) {
        return settingMapper.create(userUuid);
    }

    public boolean update(Setting setting) {
        return settingMapper.update(setting);
    }
}
