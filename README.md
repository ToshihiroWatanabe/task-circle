# task-circle（タスクサークル）

## Requirement

- Java 11.0.10
- Apache Maven 3.8.1
- npm 7.16.0
- MySQL 8.0.25

## Install

### データベース

springboot\src\main\resources\schema.sqlを実行して、テーブルを作成してください。

### 環境変数

#### Java用の環境変数

環境変数名|説明
---|---
MYSQL_URL|jdbc:mysql://ホスト名:ポート番号/データベース名
MYSQL_USERNAME|データベースに接続するユーザー名
MYSQL_PASSWORD|データベースに接続するユーザーのパスワード

#### React用の環境変数

.envファイルに記述する際は変数名の先頭にREACT_APP_を付けてください。

環境変数名|説明
---|---
CLIENT_ID|Google OAuthのクライアントID

### インストールと実行

`git clone https://github.com/ToshihiroWatanabe/task-circle.git`

`cd task-circle/springboot`

`mvn install`

`mvn spring-boot:run`

`cd ../react`

`npm install`

`npm start`

