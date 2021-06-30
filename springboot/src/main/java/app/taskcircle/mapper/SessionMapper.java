package app.taskcircle.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.Session;

@Mapper
public interface SessionMapper {

    public List<Session> findAll();

    public boolean create(Session session);

    public boolean update(Session session);

    public boolean delete(Session session);
}
