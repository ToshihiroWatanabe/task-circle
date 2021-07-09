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

    /**
     * メッセージを送受信します。
     * 
     * @param request        セッションのリクエスト
     * @param headerAccessor リクエストヘッダー
     * @return セッションのレスポンス
     * @throws Exception
     */
    @MessageMapping("/session")
    @SendTo("/topic/session")
    public SessionResponse SendMessage(@Payload SessionRequest request, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        request.setSessionId(headerAccessor.getSessionId());
        Session session = sessionService.requestToSession(request);
        session.setSessionId(headerAccessor.getSessionId());
        sessionService.update(session);
        SessionResponse response = new SessionResponse();
        BeanUtils.copyProperties(request, response);
        return response;
    }

    /**
     * 入室メッセージを送受信します。
     * 
     * @param request        セッションのリクエスト
     * @param headerAccessor リクエストヘッダー
     * @return セッションのレスポンス
     * @throws Exception
     */
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

    /**
     * 退室メッセージを送受信します。
     * 
     * @param request        セッションのリクエスト
     * @param headerAccessor リクエストヘッダー
     * @return セッションのレスポンス
     * @throws Exception
     */
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

    /**
     * セッションテーブルからデータを取得するリクエストを受けて、結果を返します。
     * 
     * @param sessionFindAllTopicsId 送受信するトピックのID
     * @throws Exception
     */
    @MessageMapping("/session/findall")
    public void findAll(@Payload String sessionFindAllTopicsId) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/session/findall/" + sessionFindAllTopicsId,
                sessionService.findAll());
    }
}