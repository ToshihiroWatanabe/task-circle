# task-circle/springboot

Javaのフレームワーク「Spring Boot」で制作したバックエンドWebアプリケーションです。

## Features

- WebSocket通信で、接続されているユーザー情報の送受信を行います。
- HTTP通信で、ログインのためのGoogle APIの認証処理や、ユーザーのToDoリストや設定の同期を行います。
- O/Rマッパー「MyBatis」を使用して、データベースの操作を行います。

## WebSocket

受信元|送信先|説明
---|---|---
[/websocket/session/enter](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|[/websocket/topic/session](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|入室メッセージ
[/websocket/session/leave](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|[/websocket/topic/session/leave](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|退室メッセージ
[/websocket/session](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|[/websocket/topic/session](/springboot/src/main/java/app/taskcircle/controller/SessionWebSocketController.java)|その他のメッセージ

## API

URI(エンドポイント)|リクエスト|パラメータ|説明
---|---|---|---
[/api/auth/login](/springboot/src/main/java/app/taskcircle/controller/AuthController.java)|POST|リクエストボディ･･･トークンID、メールアドレス|ログインまたは新規登録します。
[/api/todolist/findbytokenid](/springboot/src/main/java/app/taskcircle/controller/TodoListController.java)|POST|リクエストボディ･･･トークンID|ToDoリストを取得します。
[/api/todolist/update](/springboot/src/main/java/app/taskcircle/controller/TodoListController.java)|POST|リクエストボディ･･･トークンID、ToDoリスト|ToDoリストを更新します。
[/api/setting/findbytokenid](/springboot/src/main/java/app/taskcircle/controller/SettingController.java)|POST|リクエストボディ･･･トークンID|設定を取得します。
[/api/setting/update](/springboot/src/main/java/app/taskcircle/controller/SettingController.java)|POST|リクエストボディ･･･トークンID、設定|設定を更新します。
[/actuator/info](/springboot/src/main/resources/application.properties)|GET|なし|アプリのビルド時刻などを取得します。
