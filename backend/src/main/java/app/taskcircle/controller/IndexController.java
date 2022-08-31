package app.taskcircle.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * index.htmlを返すコントローラークラスです。
 */
@Controller
public class IndexController {

    /**
     * リクエストを受けて、index.htmlを返します。
     * 
     * @param request リクエスト
     * @return index.html
     */
    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/{x:^(?!api|websocket|.well-known$).*$}/**/{y:[\\w\\-]+}", })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
}
