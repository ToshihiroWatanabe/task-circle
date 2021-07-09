package app.taskcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.taskcircle.model.Setting;
import app.taskcircle.model.User;
import app.taskcircle.payload.request.SettingRequest;
import app.taskcircle.service.SettingService;
import app.taskcircle.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * 設定に関するコントローラークラスです。
 */
@RestController
@RequestMapping("/api/setting")
public class SettingController {

    private final UserService userService;
    private final SettingService settingService;

    @Autowired
    public SettingController(UserService userService, SettingService settingService) {
        this.userService = userService;
        this.settingService = settingService;
    }

    /**
     * トークンIDから設定を取得するリクエストを受けて、結果を返します。
     * 
     * @param request 設定のリクエスト
     * @return 設定
     */
    @PostMapping("/findbytokenid")
    public Setting findByTokenId(@RequestBody SettingRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        return settingService.findByUserUuid(user.getUserUuid());
    }

    /**
     * 設定を更新するリクエストを受けて、結果を返します。
     * 
     * @param request 設定のリクエスト
     * @return 成功した場合はtrue
     */
    @PostMapping("/update")
    public boolean update(@RequestBody SettingRequest request) {
        User user = userService.findByTokenId(request.getTokenId());
        Setting setting = new Setting();
        setting.setUserUuid(user.getUserUuid());
        setting.setSetting(request.getSetting());
        return settingService.update(setting);
    }
}
