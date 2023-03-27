# task-circle/frontend

JavaScriptのライブラリ「React」を使ったフロントエンドWebアプリケーションです。

# 🌟 機能

## ボード形式のタスク管理

タスクをドラッグ移動で並べ替えることができます。Todoリストの列を追加し、タスクを別の列へ移動することもできます。

![TaskCircle ToDoList 2021-07-13](https://user-images.githubusercontent.com/79039863/125474590-41c34d6a-8868-4e9e-8b57-e1412dbfbd0f.gif)

## 直前の操作を元に戻す

リセットや削除をした直後に、その操作をキャンセルして元に戻すことができます。

![TaskCircle Undo 2021-07-13](https://user-images.githubusercontent.com/79039863/125475464-812a4567-157b-4241-b83c-9b2953183a3d.gif)

## ドラッグ移動＆リサイズ可能なタイマーボタン

PCではタイマーボタンのドラッグ移動と拡大縮小ができます。右クリックでタイマーの種類の切り替えができます。

![TaskCircle TimerFAB 2021-07-17](https://user-images.githubusercontent.com/79039863/126031483-9a442664-db66-4319-aafe-647f63b2acae.gif)

## ポモドーロタイマーに対応

作業と休憩を一定のサイクルで繰り返す時間管理術「ポモドーロ・テクニック」のためのタイマーに切り替えることができます。

![image](https://user-images.githubusercontent.com/79039863/125463286-d3533a23-87b9-4804-bb9c-dd83cf9577e3.png)

## タスク選択カーソルでもタイマーの開始/停止が可能

1つの記号▶に2つの意味を持たせることで、シンプルな見た目で快適な操作性を実現しました。

![TaskCircle CursorTimer 2021-07-17](https://user-images.githubusercontent.com/79039863/126032078-79e312a9-62b7-49c1-b8f5-5f9efa5f542f.gif)

## 動的favicon＆動的タイトル

タイマー開始時や終了時にfaviconが変化し、タスク名や経過時間、残り時間がタイトルに反映されます。

![TaskCircle TimerFAB 2021-07-13](https://user-images.githubusercontent.com/79039863/125471767-8263543c-dc6a-4a75-aed9-c811fe5d8c1d.gif)

## ルーム機能

現在入室しているユーザーの状態をリアルタイムで表示します。

![TaskCircle Room 2021-07-13](https://user-images.githubusercontent.com/79039863/125460246-a971419b-eebb-4368-a4a9-52e608244fa6.gif)

## YouTubeの動画をBGMとして再生する

設定でYouTubeの動画のURLを貼ると、タイマー作動中にBGMとして流せます。

![TaskCircle YouTubeBGM 2021-07-13](https://user-images.githubusercontent.com/79039863/125431901-b6e60674-d8e7-407b-8665-73b7f58ca713.gif)

## チクタク音

デフォルト設定ではGoogle Chromeのタブにスピーカーアイコンがギリギリ付くくらいの小さな音量で、タイマー作動中に毎秒チクタク音を鳴らします。これによって、アプリを開いたタブが非アクティブになっていても優先度が下がらず、タイマーのカウントの遅れを抑制することができます。

![image](https://user-images.githubusercontent.com/79039863/125426229-6e30ade8-0081-45e3-8e5a-67cd18512f2a.png)

## デスクトップ通知

タイマー終了時の通知をオンにできます。

![image](https://user-images.githubusercontent.com/79039863/125428979-dee0330e-3079-471c-b620-2906bd120987.png)

## Googleアカウントでログイン

ログインすると、異なるデバイス間でToDoリストや設定を同期できます。

※データは基本的にローカルストレージに保存され、ログイン時はサーバーのデータベースにも保存されます。
※2022年11月21日追記: 現在不具合のため使えません。

![image](https://user-images.githubusercontent.com/79039863/125453575-57983f12-e48f-4894-bf07-ea35e7283706.png)

## クリップボードにコピー

タスクごとの経過時間や合計作業時間をクリップボードにコピーできます。

(クリップボード出力の例)
```
タスク1
01:13:44

課題
00:50:00

計 02:03:44
```

## ツイートボタン

タスクや合計時間をツイートするボタンを表示させることができます。定型文として、よく使うハッシュタグなどを事前に登録しておくこともできます。

![image](https://user-images.githubusercontent.com/79039863/125434674-8b47f364-d661-4346-ab55-7977a84acf41.png)

## ダークモードに対応

ダークモードへの切り替えができます。

![TaskCircle DarkMode 2021-07-13](https://user-images.githubusercontent.com/79039863/125433625-9c6443b7-8d96-468b-9a36-3615bc5db285.gif)

## PWA(プログレッシブウェブアプリ)に対応

キャッシュが残っていればオフラインでも使えます(通信が必要な機能を除く)。アプリとしてホーム画面などに追加することもできます。

![image](https://user-images.githubusercontent.com/79039863/125427718-5fb0b3de-07da-44e9-9bf7-505c8dbeda4f.png)

## バージョン確認

このアプリはPWAに対応しているので、アプリのキャッシュがクライアント側に残っていると、古いバージョンのものが表示されることがあります。

そのため、手元のアプリのバージョンが最新のものかどうか確認できるようにしたかったのですが、アップデートのたびにわざわざバージョンの数字を書き換えるのは面倒でした。

そこで、クライアント側(フロントエンド)のアプリケーションのビルド時刻とサーバー側(バックエンド)のアプリケーションのビルド時刻を比較し、差が少なければ最新バージョンと判定するようにしています。

![image](https://user-images.githubusercontent.com/79039863/125949724-997d3b9f-a0ae-45dd-ae1e-3bae9aefe26a.png)
