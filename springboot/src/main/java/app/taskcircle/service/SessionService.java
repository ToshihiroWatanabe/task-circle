package app.taskcircle.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.taskcircle.mapper.SessionMapper;
import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionRequest;

/**
 * セッションに関するサービスクラスです。
 */
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

    public boolean deleteAll() {
        return sessionMapper.deleteAll();
    }

    /**
     * セッションのリクエストをsessionsテーブルのモデルクラスに変換します。
     */
    public Session requestToSession(SessionRequest request) {
        Session session = new Session();
        session.setUserName(request.getUserName());
        session.setSessionType(request.getSessionType());
        session.setContent(request.getContent());
        session.setIsTimerOn(request.getIsTimerOn());
        session.setStartedAt(
                LocalDateTime.ofInstant(Instant.ofEpochMilli(request.getStartedAt()), ZoneId.systemDefault()));
        session.setFinishAt(
                LocalDateTime.ofInstant(Instant.ofEpochMilli(request.getFinishAt()), ZoneId.systemDefault()));
        return session;
    }
}
