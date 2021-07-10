/** デフォルトタイトル */
export const DEFAULT_TITLE = document.title;
/** 一度にカウントする秒数 */
export const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
export const COUNT_INTERVAL = 1000;
/** 1つのToDoリストのタスクの最大数 */
export const NUMBER_OF_TASKS_MAX = 32;
/** ToDoリストの最大数 */
export const NUMBER_OF_LISTS_MAX = 4;
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

/** 使用できないユーザー名 */
export const NG_USER_NAMES = [
  "You",
  "you",
  "あなた",
  "Name",
  "name",
  "Username",
  "userName",
  "username",
  "名前",
  "運営",
  "TaskCircle",
  "Taskcircle",
  "taskCircle",
  "taskcircle",
  "Task Circle",
  "Task circle",
  "task Circle",
  "task circle",
  "Task-Circle",
  "Task-circle",
  "task-Circle",
  "task-circle",
  "Task_Circle",
  "Task_circle",
  "task_Circle",
  "task_circle",
];

/** 使用できないタスク名 */
export const NG_TASK_NAMES = [
  "タスクが選択されていません",
  "作業中",
  "ポモドーロ中",
  "休憩中",
  "離席中",
];
