<h1 align="center">
<img src="https://user-images.githubusercontent.com/79039863/125965026-0afa11d2-9678-4e71-82e3-683bd205fee0.png" alt="TaskCircle" title="TaskCircle" width="500">
</h1>

<h4 align="center">作業状況を仲間と共有できる、タスク管理＆タイマーWebアプリです。</h4>

<h4 align="center">
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/ToshihiroWatanabe/task-circle">
<img alt="License MIT" src="https://img.shields.io/github/license/ToshihiroWatanabe/task-circle">
</h4>

<p align="center">
  <a href="#概要">概要</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#使い方">使い方</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#開発履歴">開発履歴</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#使用技術">使用技術</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#インストール手順">インストール手順</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
</p>

![TaskCircle 2021-07-10](https://user-images.githubusercontent.com/79039863/126265535-fe696cba-fe48-4c63-9933-e51c40aff972.gif)

<h3 align="center">アプリはこちらで公開しています。<br>
<a href="https://task-circle.onrender.com" align="center">https://task-circle.onrender.com</a>
</h3>

# 💡概要

**タスク管理**と**タイマー**、**他のユーザーのステータス表示機能**のあるWebアプリケーションです。

フロントエンドはReact、バックエンドはSpring Bootで制作しています。詳しい説明はそれぞれのREADME.mdをご覧ください。

**アプリの機能の紹介はこちら↓**<br>
[frontend/README.md](/frontend/README.md)

**APIの表とER図はこちら↓**<br>
[backend/README.md](/backend/README.md)

<details>
  <summary>(旧)AWSでのデプロイについて</summary>

-   ビルド時は、まずReactアプリケーションをビルドしたものをSpring Bootプロジェクトに統合してから、Spring Bootアプリケーションをビルドします。<br>
-   AWS上でEC2とRDSを作成し、EC2上のTomcatでSpring Bootアプリケーションを起動させています。<br>
-   CI/CDツールはCircleCIを利用していて、mainブランチへのプッシュがあると自動でデプロイされます。<br>
-   独自ドメインを取得してRoute53に登録し、Let's Encryptで取得した証明書をTomcatにインストールし、80番と443番ポートの通信を8443番ポートへ転送してHTTPS化しています。<br>
    </details>

# 🔰使い方

![TaskCircle_QuickStartGuide_1](https://user-images.githubusercontent.com/79039863/125425089-ce0972c5-b7ea-4c47-b917-ae6bd2e5e632.png)

![TaskCircle_QuickStartGuide_2](https://user-images.githubusercontent.com/79039863/126100268-13ac01b3-6ce1-4d8b-a15f-205b2f860c99.png)

![TaskCircle_QuickStartGuide_3](https://user-images.githubusercontent.com/79039863/125425203-c1e9b5d6-135c-4b97-b2dc-f7dab6af188c.png)

![TaskCircle_QuickStartGuide_4](https://user-images.githubusercontent.com/79039863/125425277-bd286a68-8cc4-4c35-b1a1-757847d78c9f.png)

# 📅開発履歴

2021年6月18日 Reactプロジェクトを作成  
2021年6月29日 Spring Bootプロジェクトを追加  
2021年7月 3日 AWSにデプロイし、アプリ公開  
2021年7月15日 TypeScriptへの移行開始  
2022年3月21日 ホスティングサービスをAWSからHerokuに移行
2022年11月21日 ホスティングサービスをHerokuからRenderに移行

# 👨‍💻使用技術

<details>
  <summary>React</summary>
  JavaScriptのライブラリです。Create React Appでプロジェクトを作成しました。
</details>
<details>
  <summary>TypeScript</summary>
  JavaScriptで型宣言をできるようにした言語です。
</details>
<details>
  <summary>Material-UI</summary>
  ReactのUIフレームワークです。Googleが提唱するマテリアルデザインのようなUIを作ることができます。
</details>
<details>
  <summary>Jest, React Testing Library</summary>
  JavaScriptのテストランナーと、Reactコンポーネントのテストライブラリです。
</details>
<details>
  <summary>Spring Boot</summary>
  Javaのフレームワークです。バックエンド(サーバーサイド)アプリケーションとして利用しています。
</details>
<details>
  <summary>WebSocket (STOMP, SockJS)</summary>
  HTTP通信とは別の通信方法で、リアルタイムな双方向通信ができます。ルーム機能でタイマーの状況を送受信するのに利用しています。
</details>
<details>
  <summary>MyBatis</summary>
  Javaの世界とデータベースの世界をつなぐO/Rマッパーです。
</details>
<details>
  <summary>MySQL</summary>
  データベースを管理するためのシステムおよび言語です。基本的なCRUD処理(新規作成、取得、更新、削除)を行っています。
</details>

# 🛠インストール手順

## 実行環境

-   Java 11.0.10
-   Apache Maven 3.8.1
-   Node.js 14.16.1
-   npm 7.16.0
-   MySQL 8.0.25

※Dockerで実行することもできます。

## データベースの作成

MySQLでデータベースを作成し、
[backend/src/main/resources/schema.sql](/backend/src/main/resources/schema.sql)にあるSQL文でテーブルを作成してください。

## 環境変数の設定

#### Spring Boot用の環境変数

環境変数を設定するか、[backend/src/main/resources/application.properties](/backend/src/main/resources/application.properties)のデータベースの接続に関する記述を書き換えてください。

| 環境変数名          | 説明                                          |
| -------------- | ------------------------------------------- |
| MYSQL_URL      | jdbc:mysql://**ホスト名**:**ポート番号**/**データベース名** |
| MYSQL_USERNAME | データベースに接続するユーザー名                            |
| MYSQL_PASSWORD | データベースに接続するユーザーのパスワード                       |

#### React用の環境変数

Googleログイン機能を使用する場合は、frontendディレクトリに.envファイルを作成し、環境変数を記述してください。
※2022年11月21日追記: 現在不具合のため使えません。

| 環境変数名               | 説明                    |
| ------------------- | --------------------- |
| REACT_APP_CLIENT_ID | Google OAuthのクライアントID |

## インストールと実行

リポジトリをクローンします。

    git clone https://github.com/ToshihiroWatanabe/task-circle.git

## Dockerを使わない場合

Spring Bootプロジェクトのディレクトリに移動します。

    cd task-circle/backend

Mavenで依存関係をインストールします。

    mvn install

Spring Bootアプリケーションを起動します。

    mvn spring-boot:run

Reactプロジェクトのディレクトリに移動します。

    cd ../frontend

npmで依存関係をインストールします。

    npm install

Reactアプリケーションを起動します。

    npm start

### Dockerを使う場合

プロジェクトのディレクトリに移動します。

    cd task-circle

Docker Composeで起動します。

    docker-compose up

# License

The MIT License (MIT)

Copyright © 2022 ワタナベトシヒロ
