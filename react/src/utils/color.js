/** アバター背景色のカラーコードの配列 */
const COLORS = [
  "#f44336", // red[500]
  "#e91e63", // pink[500]
  "#9c27b0", // purple[500]
  "#673ab7", // deepPurple[500]
  "#3f51b5", // indigo[500]
  "#2196f3", // blue[500]
  "#03a9f4", // lightBlue[500]
  "#00bcd4", // cyan[500]
  "#009688", // teal[500]
  "#4caf50", // green[500]
  "#8bc34a", // lightGreen[500]
  "#cddc39", // lime[500]
  "#ffc107", // amber[500]
  "#ff9800", // orange[500]
  "#ff5722", // deepOrange[500]
  "#795548", // brown[500]
];

/**
 * ユーザー名からアバターの背景色を決定します。
 *
 * @param {string} name ユーザー名
 * @returns カラーコード
 */
export const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = 31 * hash + name.charCodeAt(i);
  }
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};
