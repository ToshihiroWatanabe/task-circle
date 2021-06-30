package app.taskcircle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.SessionMapper;
import app.taskcircle.model.Session;

@Service
public class SessionService {

    private final SessionMapper sessionMapper;

    @Autowired
    public SessionService(SessionMapper sessionMapper) {
        this.sessionMapper = sessionMapper;
    }

    public List<Session> findAll() {
        return sessionMapper.findAll();
    }

    public boolean create(Session session) {
        return sessionMapper.create(session);
    }

    public boolean update(Session session) {
        return sessionMapper.update(session);
    }

    public boolean delete(Session session) {
        return sessionMapper.delete(session);
    }
}
