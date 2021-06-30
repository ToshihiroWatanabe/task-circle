package app.taskcircle.controller;

import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionMessage;
import app.taskcircle.service.SessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionWebSocketController {

    private final SessionService sessionService;

    @Autowired
    public SessionWebSocketController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @MessageMapping("/session")
    @SendTo("/topic/session")
    public SessionMessage SendToMessage(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        System.out.println(message.getSessionId() + " " + message.getUserName());
        return message;
    }

    @MessageMapping("/session/enter")
    @SendTo("/topic/session")
    public SessionMessage enter(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = new Session();
        session.setSessionId(headerAccessor.getSessionId());
        session.setUserName(message.getUserName());
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
}