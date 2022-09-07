package app.taskcircle.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Spring Securityに関する設定クラスです。
 */
@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * HTTP通信に関する設定をします。
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // HTTPSを強制(Heroku)
        http.requiresChannel().requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null).requiresSecure();
        // CSRF対策を無効に設定
        http.csrf().disable();
    }

}