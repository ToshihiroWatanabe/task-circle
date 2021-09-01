package app.taskcircle.mapper;

import static org.junit.jupiter.api.Assertions.assertFalse;

import app.taskcircle.model.Session;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

@MybatisTest
@TestPropertySource(locations = "classpath:test.properties")
@DisplayName("sessionsテーブルのマッパークラスのテスト")
class SessionMapperTest {
    @Autowired
    private SessionMapper sessionMapper;

    @Nested
    class findAllメソッドでsessionsテーブルから全件取得できる事 {

        @Test
        void 空の値でセッションを更新できない事() {
            assertFalse(sessionMapper.update(new Session()));
        }
    }
}
