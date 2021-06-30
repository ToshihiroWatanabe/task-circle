package app.taskcircle.controller;

import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionMessage;
import app.taskcircle.service.SessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionWebSocketController {

    private final SessionService sessionService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public SessionWebSocketController(SessionService sessionService, SimpMessagingTemplate simpMessagingTemplate) {
        this.sessionService = sessionService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/session")
    @SendTo("/topic/session")
    public SessionMessage SendToMessage(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.messageToSession(message);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.update(session);
        System.out.println(message.getSessionId() + " " + message.getUserName());
        return message;
    }

    @MessageMapping("/session/enter")
    @SendTo("/topic/session")
    public SessionMessage enter(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.messageToSession(message);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.create(session);
        System.out.println("enter: " + message.getSessionId() + " " + message.getUserName());
        return message;
    }

    @MessageMapping("/session/leave")
    @SendTo("/topic/session/leave")
    public SessionMessage leave(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = new Session();
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.delete(session);
        System.out.println("leave: " + message.getSessionId());
        return message;
    }

    @MessageMapping("/session/findall")
    public void findAll(@Payload String sessionFindAllTopicsId) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/session/findall/" + sessionFindAllTopicsId,
                sessionService.findAll());
    }
}