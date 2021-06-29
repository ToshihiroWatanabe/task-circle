package app.taskcircle.controller;

import app.taskcircle.model.Session;
import app.taskcircle.payload.request.SessionMessage;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionWebSocketController {

    @MessageMapping("/session")
    @SendTo("/topic/session")
    public SessionMessage SendToMessage(@Payload SessionMessage message, SimpMessageHeaderAccessor headerAcessor)
            throws Exception {
        message.setSessionId(headerAcessor.getSessionId());
        System.out.println(message.getSessionId() + " " + message.getUserName());
        return message;
    }

    @MessageMapping("/session/enter")
    @SendTo("/topic/session")
    public Session enter(@Payload Session message, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        System.out.println("enter: " + message.getSessionId() + " " + message.getUserName());
        return message;
    }

    @MessageMapping("/session/leave")
    @SendTo("/topic/session/leave")
    public Session leave(@Payload Session message, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        message.setSessionId(headerAccessor.getSessionId());
        System.out.println("leave: " + message.getSessionId());
        return message;
    }
}