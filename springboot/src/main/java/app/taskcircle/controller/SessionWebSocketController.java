package app.taskcircle.controller;

import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionMessage;
import app.taskcircle.payload.response.SessionResponse;
import app.taskcircle.service.SessionService;

import org.springframework.beans.BeanUtils;
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
    public SessionResponse SendToMessage(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.messageToSession(message);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.update(session);
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(message, response);
        return response;
    }

    @MessageMapping("/session/enter")
    @SendTo("/topic/session")
    public SessionResponse enter(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.messageToSession(message);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.create(session);
        System.out.println("enter: " + message.getSessionId() + " " + message.getUserName());
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(message, response);
        return response;
    }

    @MessageMapping("/session/leave")
    @SendTo("/topic/session/leave")
    public SessionResponse leave(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        Session session = new Session();
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.delete(session);
        System.out.println("leave: " + message.getSessionId());
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(message, response);
        return response;
    }

    @MessageMapping("/session/findall")
    public void findAll(@Payload String sessionFindAllTopicsId) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/session/findall/" + sessionFindAllTopicsId,
                sessionService.findAll());
    }
}