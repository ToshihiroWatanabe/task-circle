package app.taskcircle.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import app.taskcircle.model.Session;
import app.taskcircle.service.SessionService;

/**
 * セッションの切断を検知するリスナークラスです。
 */
@Component
public class SessionDisconnectListener implements ApplicationListener<SessionDisconnectEvent> {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final SessionService sessionService;

    @Autowired
    public SessionDisconnectListener(SimpMessagingTemplate simpMessagingTemplate, SessionService sessionService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.sessionService = sessionService;
    }

    @EventListener
    @Override
    public void onApplicationEvent(SessionDisconnectEvent applicationEvent) {
        System.out.println("disconnect: " + applicationEvent.getSessionId());
        Session session = new Session();
        session.setSessionId(applicationEvent.getSessionId());
        sessionService.delete(session);
        simpMessagingTemplate.convertAndSend("/topic/session/leave", session);
    }
}
