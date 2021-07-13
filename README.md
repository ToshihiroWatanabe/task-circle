# task-circle（タスクサークル）

## Demo デモ

![TaskCircle 2021-07-10](https://user-images.githubusercontent.com/79039863/125162472-fbd6de80-e1c2-11eb-9cbc-1dcdb4a47de8.gif)

## Overview 概要

**タスク管理**と**タイマー**、**他のユーザーのステータス表示機能**のあるWebアプリケーションです。

フロントエンドはReact、バックエンドはSpring Bootで制作しています。詳しい説明はそれぞれのREADME.mdをご覧ください。

[React(フロントエンド)のREADME.md](/react/README.md)

[Spring Boot(バックエンド)のREADME.md](/springboot/README.md)

## Requirement 動作環境

- Java 11.0.10
- Apache Maven 3.8.1
- npm 7.16.0
- MySQL 8.0.25

## Install インストール方法

### データベースの作成

MySQLでデータベースを作成し、
[springboot/src/main/resources/schema.sql](/springboot/src/main/resources/schema.sql)にあるSQL文でテーブルを作成してください。

### 環境変数の設定

#### Spring Boot用の環境変数

環境変数名|説明
---|---
MYSQL_URL|jdbc:mysql://ホスト名:ポート番号/データベース名
MYSQL_USERNAME|データベースに接続するユーザー名
MYSQL_PASSWORD|データベースに接続するユーザーのパスワード

#### React用の環境変数

.envファイルに記述する際は変数名の先頭にREACT_APP_を付けてください。

環境変数名|説明
---|---
CLIENT_ID|Google OAuthのクライアントID(これが無くてもログイン機能以外は動作します)

### インストールと実行

GitHubからリポジトリをクローンします。

`git clone https://github.com/ToshihiroWatanabe/task-circle.git`

Spring Bootプロジェクトのディレクトリに移動します。

`cd task-circle/springboot`

Mavenで依存関係をインストールします。

`mvn install`

Spring Bootアプリケーションを起動します。

`mvn spring-boot:run`

Reactプロジェクトのディレクトリに移動します。

`cd ../react`

npmで依存関係をインストールします。

`npm install`

Reactアプリケーションを起動します。

`npm start`

## Author 作者

ワタナベトシヒロ

