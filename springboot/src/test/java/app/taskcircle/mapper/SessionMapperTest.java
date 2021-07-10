package app.taskcircle.mapper;

/*
 * import static org.junit.jupiter.api.Assertions.assertEquals;
 * 
 * import java.util.List;
 * 
 * import app.taskcircle.model.Session;
 * 
 * import org.junit.jupiter.api.DisplayName; import
 * org.junit.jupiter.api.Nested; import org.junit.jupiter.api.Test; import
 * org.mybatis.spring.boot.test.autoconfigure.MybatisTest; import
 * org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.test.context.TestPropertySource;
 * 
 * @MybatisTest
 * 
 * @TestPropertySource(locations = "classpath:test.properties")
 * 
 * @DisplayName("sessionsテーブルのマッパークラスのテスト") class SessionMapperTest {
 * 
 * @Autowired private SessionMapper sessionMapper;
 * 
 * @Nested class findAllメソッドでsessionsテーブルから全件取得できる事 {
 * 
 * @Nested class findAllメソッドでsessionsテーブルから1件目のレコードを取得できる事 { List<Session>
 * sessions = sessionMapper.findAll();
 * 
 * @Test void findAllメソッドでsessionsテーブルから1件目のidを取得できる事() { assertEquals("testId",
 * sessions.get(0).getSessionId()); }
 * 
 * @Test void findAllメソッドでsessionsテーブルから1件目のuser_nameを取得できる事() {
 * assertEquals("ユーザー1", sessions.get(0).getUserName()); }
 * 
 * @Test void findAllメソッドでsessionsテーブルから1件目のsession_typeを取得できる事() {
 * assertEquals("Work", sessions.get(0).getSessionType()); }
 * 
 * @Test void findAllメソッドでsessionsテーブルから1件目のcontentを取得できる事() {
 * assertEquals("講座予習", sessions.get(0).getContent()); }
 * 
 * }
 * 
 * }
 * 
 * }
 * 
 */