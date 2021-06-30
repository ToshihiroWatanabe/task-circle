package app.taskcircle.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.SessionMapper;
import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionMessage;

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

    public Session messageToSession(SessionMessage message) {
        Session session = new Session();
        session.setUserName(message.getUserName());
        session.setSessionType(message.getSessionType());
        session.setContent(message.getContent());
        session.setIsTimerOn(message.getIsTimerOn());
        session.setStartedAt(
                LocalDateTime.ofInstant(Instant.ofEpochMilli(message.getStartedAt()), ZoneId.systemDefault()));
        session.setFinishAt(
                LocalDateTime.ofInstant(Instant.ofEpochMilli(message.getFinishAt()), ZoneId.systemDefault()));
        return session;
    }
}
