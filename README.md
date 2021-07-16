<h1 align="center">
<img src="https://user-images.githubusercontent.com/79039863/125913153-6f4fe7a0-4357-44ef-8080-4b3652b5c67d.jpg" alt="TaskCircle" title="TaskCircle">
</h1>

<h4 align="center">作業状況を仲間と共有できる、タスク管理＆タイマーWebアプリです。</h4>


<p align="center">
  <a href="#概要">概要</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#使い方">使い方</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#使用技術">使用技術</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#インストール手順">インストール手順</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#作者">作者</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
</p>

![TaskCircle 2021-07-10](https://user-images.githubusercontent.com/79039863/125162472-fbd6de80-e1c2-11eb-9cbc-1dcdb4a47de8.gif)

# 🚀概要

**タスク管理**と**タイマー**、**他のユーザーのステータス表示機能**のあるWebアプリケーションです。

フロントエンドはReact、バックエンドはSpring Bootで制作しています。詳しい説明はそれぞれのREADME.mdをご覧ください。

[React(フロントエンド)のREADME.md](/react/README.md)

[Spring Boot(バックエンド)のREADME.md](/springboot/README.md)

# ▶使い方

![TaskCircle_QuickStartGuide_1](https://user-images.githubusercontent.com/79039863/125425089-ce0972c5-b7ea-4c47-b917-ae6bd2e5e632.png)

![TaskCircle_QuickStartGuide_2](https://user-images.githubusercontent.com/79039863/125425158-bf0085a0-b4cf-4088-84c6-efee6365636e.png)

![TaskCircle_QuickStartGuide_3](https://user-images.githubusercontent.com/79039863/125425203-c1e9b5d6-135c-4b97-b2dc-f7dab6af188c.png)

![TaskCircle_QuickStartGuide_4](https://user-images.githubusercontent.com/79039863/125425277-bd286a68-8cc4-4c35-b1a1-757847d78c9f.png)

# 👨‍💻使用技術

- React (Create React App)
- TypeScript
- Material-UI
- Spring Boot
- WebSocket
- MyBatis
- MySQL

# 🔧インストール手順

## 動作環境

- Java 11.0.10
- Apache Maven 3.8.1
- Node.js 14.16.1
- npm 7.16.0
- MySQL 8.0.25

## データベースの作成

MySQLでデータベースを作成し、
[springboot/src/main/resources/schema.sql](/springboot/src/main/resources/schema.sql)にあるSQL文でテーブルを作成してください。

## 環境変数の設定

#### Spring Boot用の環境変数

環境変数名|説明
---|---
MYSQL_URL|jdbc:mysql://**ホスト名**:**ポート番号**/**データベース名**
MYSQL_USERNAME|データベースに接続するユーザー名
MYSQL_PASSWORD|データベースに接続するユーザーのパスワード

#### React用の環境変数

環境変数名|説明
---|---
REACT_APP_CLIENT_ID|Google OAuthのクライアントID(これが無くてもログイン機能以外は動作します)

## インストールと実行

リポジトリをクローンします。
```
git clone https://github.com/ToshihiroWatanabe/task-circle.git
```
Spring Bootプロジェクトのディレクトリに移動します。
```
cd task-circle/springboot
```
Mavenで依存関係をインストールします。
```
mvn install
```
Spring Bootアプリケーションを起動します。
```
mvn spring-boot:run
```
Reactプロジェクトのディレクトリに移動します。
```
cd ../react
```
npmで依存関係をインストールします。
```
npm install
```
Reactアプリケーションを起動します。
```
npm start
```

# 作者

ワタナベトシヒロ

# License

MIT
