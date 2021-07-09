package net.task_circle.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.task_circle.model.Session;

/**
 * sessionsテーブルのマッパークラスです。
 */
@Mapper
public interface SessionMapper {

    public List<Session> findAll();

    public boolean create(Session session);

    public boolean update(Session session);

    public boolean delete(Session session);

    public boolean deleteAll();
}
