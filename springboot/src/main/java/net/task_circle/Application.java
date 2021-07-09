package net.task_circle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import net.task_circle.service.SessionService;

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
		System.out.println("deleteAll: " + app.execStartup(args));
	}

	/**
	 * アプリケーション起動時に実行する処理です。
	 * 
	 * @param args
	 */
	public boolean execStartup(String[] args) {
		return sessionService.deleteAll();
	}
}
