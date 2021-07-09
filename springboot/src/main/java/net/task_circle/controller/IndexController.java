package net.task_circle.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * index.htmlを返すコントローラーです。
 */
@Controller
public class IndexController {

    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/{x:^(?!api|websocket$).*$}/**/{y:[\\w\\-]+}", })
    public String getIndex(HttpServletRequest request) {
        return "/index.html";
    }
}
