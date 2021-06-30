package app.taskcircle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import app.taskcircle.service.SessionService;

@SpringBootApplication
public class Application {

	private final SessionService sessionService;

	@Autowired
	public Application(SessionService sessionService) {
		this.sessionService = sessionService;
	}

	public static void main(String[] args) {
		ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args);
		Application app = ctx.getBean(Application.class);
		app.execStartup(args);
	}

	/**
	 * アプリケーション起動時に実行する処理です。
	 * 
	 * @param args
	 */
	public void execStartup(String[] args) {
		sessionService.deleteAll();
	}
}
