package app.taskcircle.controller;

import app.taskcircle.model.User;
import app.taskcircle.service.UserService;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;
import java.util.UUID;

/**
 * 認証リクエストを受けとり、結果を返すコントローラーです。
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RestOperations restOperations;
    private final UserService userService;

    public AuthController(RestTemplateBuilder restTemplateBuilder, UserService userService) {
        this.restOperations = restTemplateBuilder.build();
        this.userService = userService;
    }

    /**
     * ログイン処理です。
     * 
     * @param user ユーザーデータ
     */
    @PostMapping("/login")
    public boolean login(@RequestBody User user) {
        User responseUser = restOperations.getForObject(
                "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + user.getTokenId(), User.class);
        // クライアントから送られてきたメールアドレスとGoogleから送られてきたメールアドレスが同じであればOK
        if (user.getEmail().equals(responseUser.getEmail())) {
            try {
                user.setUserUuid(UUID.randomUUID().toString());
                boolean createResult = userService.create(user);
                System.out.println("新規登録: " + user.getEmail());
                return createResult;
            } catch (DuplicateKeyException e) {
                userService.updateTokenAndImageUrl(user);
                System.out.println("ログイン: " + user.getEmail());
                return true;
            }
        } else {
            return false;
        }
    }
}
