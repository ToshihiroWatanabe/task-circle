package app.taskcircle.controller;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;

import app.taskcircle.model.User;
import app.taskcircle.service.SettingService;
import app.taskcircle.service.TodoListService;
import app.taskcircle.service.UserService;

import java.util.UUID;

/**
 * 認証リクエストを受けとり、結果を返すコントローラークラスです。
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RestOperations restOperations;
    private final UserService userService;
    private final TodoListService todoListService;
    private final SettingService settingService;

    public AuthController(RestTemplateBuilder restTemplateBuilder, UserService userService,
            TodoListService todoListService, SettingService settingService) {
        this.restOperations = restTemplateBuilder.build();
        this.userService = userService;
        this.todoListService = todoListService;
        this.settingService = settingService;
    }

    /**
     * ログイン処理です。
     * 
     * @param user ユーザーデータ
     */
    @PostMapping("/login")
    @Transactional
    public String login(@RequestBody User user) {
        User responseUser = restOperations.getForObject(
                "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + user.getTokenId(), User.class);
        // クライアントから送られてきたメールアドレスとGoogleから送られてきたメールアドレスが同じか判定
        if (user.getEmail().equals(responseUser.getEmail())) {
            try {
                user.setUserUuid(UUID.randomUUID().toString());
                System.out.println("新規登録: " + user.getEmail());
                userService.create(user);
                todoListService.create(user.getUserUuid());
                settingService.create(user.getUserUuid());
                return "registered";
            } catch (DuplicateKeyException e) {
                userService.updateTokenAndImageUrl(user);
                System.out.println("ログイン: " + user.getEmail());
                return "logined";
            }
        } else {
            return "failed";
        }
    }
}
