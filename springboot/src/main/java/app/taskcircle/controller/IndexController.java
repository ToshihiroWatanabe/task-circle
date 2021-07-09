package app.taskcircle.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * index.htmlを返すコントローラークラスです。
 */
@Controller
public class IndexController {

    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/{x:^(?!api|websocket$).*$}/**/{y:[\\w\\-]+}", })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
}
