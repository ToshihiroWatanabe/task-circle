package app.taskcircle.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.List;

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
        List<Session> sessions = sessionMapper.findAll();

        @Test
        void _1件目のユーザー名を取得できる事() {
            assertEquals("たすくん", sessions.get(0).getUserName());
        }
    }

    @Nested
    class updateメソッド {
        @Test
        void 空の値でセッションを更新できない事() {
            assertFalse(sessionMapper.update(new Session()));
        }
    }
}
