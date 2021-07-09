package net.task_circle.mapper;

import org.apache.ibatis.annotations.Mapper;

import net.task_circle.model.Setting;

@Mapper
public interface SettingMapper {
    public Setting findByUserUuid(String userUuid);

    public boolean create(String userUuid);

    public boolean update(Setting setting);
}
