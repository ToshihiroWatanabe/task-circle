/** デフォルトタイトル */
export const DEFAULT_TITLE = document.title;
/** 一度にカウントする秒数 */
export const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
export const COUNT_INTERVAL = 1000;
/** 1つのToDoリストまたは日報のタスクの最大数 */
export const NUMBER_OF_TASKS_MAX = 32;
/** カテゴリーの文字数制限 */
export const REPORT_ITEMS_CATEGORY_MAX = 45;
/** 内容の文字数制限 */
export const REPORT_ITEMS_CONTENT_MAX = 45;
/** 感想の文字数制限 */
export const REPORT_CONTENT_MAX = 400;
/** ユーザーIDの最小文字数 */
export const USER_ID_LENGTH_MIN = 5;
/** ユーザーIDの最大文字数 */
export const USER_ID_LENGTH_MAX = 32;
/** パスワードの最小文字数 */
export const PASSWORD_LENGTH_MIN = 12;
/** パスワードの最大文字数 */
export const PASSWORD_LENGTH_MAX = 100;
/** ドロワーの横幅 */
export const DRAWER_WIDTH = "15rem";
/** WebSocketのURL */
export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "/websocket"
    : "http://localhost:8160/websocket";
