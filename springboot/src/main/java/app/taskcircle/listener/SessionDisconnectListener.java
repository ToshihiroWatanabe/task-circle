package app.taskcircle.listener;

import app.taskcircle.model.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class SessionDisconnectListener implements ApplicationListener<SessionDisconnectEvent> {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public SessionDisconnectListener(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @EventListener
    @Override
    public void onApplicationEvent(SessionDisconnectEvent applicationEvent) {
        System.out.println("切断 セッションID: " + applicationEvent.getSessionId());
        Session session = new Session();
        session.setSessionId(applicationEvent.getSessionId());
        simpMessagingTemplate.convertAndSend("/topic/session/leave", session);
    }
}
