package app.taskcircle;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void 必ず成功するテスト() {
		assertEquals(1, 1);
	}

}
