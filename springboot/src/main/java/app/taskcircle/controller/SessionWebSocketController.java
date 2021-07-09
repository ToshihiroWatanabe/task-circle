package app.taskcircle.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionRequest;
import app.taskcircle.payload.response.SessionResponse;
import app.taskcircle.service.SessionService;

/**
 * セッションに関するWebSocket通信のコントローラークラスです。
 */
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
    public SessionResponse SendToMessage(@Payload SessionRequest request, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        request.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.requestToSession(request);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.update(session);
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(request, response);
        return response;
    }

    @MessageMapping("/session/enter")
    @SendTo("/topic/session")
    public SessionResponse enter(@Payload SessionRequest request, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        request.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.requestToSession(request);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.create(session);
        System.out.println("enter: " + request.getSessionId() + " " + request.getUserName());
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(request, response);
        return response;
    }

    @MessageMapping("/session/leave")
    @SendTo("/topic/session/leave")
    public SessionResponse leave(@Payload SessionRequest request, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        request.setSessionId(headerAccessor.getSessionId());
        Session session = new Session();
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.delete(session);
        System.out.println("leave: " + request.getSessionId());
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(request, response);
        return response;
    }

    @MessageMapping("/session/findall")
    public void findAll(@Payload String sessionFindAllTopicsId) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/session/findall/" + sessionFindAllTopicsId,
                sessionService.findAll());
    }
}