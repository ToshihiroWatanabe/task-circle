package app.taskcircle.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.cors.CorsConfiguration;

/**
 * Spring MVCに関する設定クラスです。
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * CORSを許可する条件を追加します。
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins("http://localhost:3000", "http://localhost:8161/")
                .allowedHeaders(CorsConfiguration.ALL).allowedMethods("*");
    }
}
