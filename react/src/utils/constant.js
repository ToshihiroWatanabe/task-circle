/** デフォルトタイトル */
export const DEFAULT_TITLE = document.title;
/** 一度にカウントする秒数 */
export const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
export const COUNT_INTERVAL = 1000;
/** 1つのToDoリストのタスクの最大数 */
export const NUMBER_OF_TASKS_MAX = 32;
/** カテゴリーの文字数制限 */
export const REPORT_ITEMS_CATEGORY_MAX = 45;
/** 内容(タスク名)の文字数制限 */
export const REPORT_ITEMS_CONTENT_MAX = 45;
/** 経過時間(秒)の最大値 */
export const SPENT_SECOND_MAX = 1000 * 60 * 60 - 1;
/** ドロワーの横幅 */
export const DRAWER_WIDTH = "15rem";
/** WebSocketのURL */
export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "/websocket"
    : "http://localhost:8160/websocket";
