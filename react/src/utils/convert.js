import format from "date-fns/format";

/**
 * 秒をHH:MM:SS形式の文字列に変換します。
 * @param {*} second 秒
 * @returns HH:MM:SS形式の文字列
 */
export const secondToHHMMSS = (second) => {
  let output = "";
  let hour = Math.floor(second / 3600);
  let minute = Math.floor((second / 60) % 60);
  let remainderSecond = Math.floor(second % 60);
  output += hour < 10 ? "0" + hour : hour;
  output += ":";
  output += minute < 10 ? "0" + minute : minute;
  output += ":";
  output += remainderSecond < 10 ? "0" + remainderSecond : remainderSecond;
  return output;
};

/**
 * 秒を「HH時間MM分SS秒」の文字列に変換します。
 * @param {*} second 秒
 * @returns 「HH時間MM分SS秒」の文字列
 */
export const secondToHHMMSS_ja = (second) => {
  let output = "";
  let hour = Math.floor(second / 3600);
  let minute = Math.floor((second / 60) % 60);
  let remainderSecond = Math.floor(second % 60);
  if (hour > 0) {
    output += hour;
    output += "時間";
  }
  if (minute > 0) {
    output += minute;
    output += "分";
  }
  if (remainderSecond > 0) {
    output += remainderSecond;
    output += "秒";
  }
  return output;
};

/**
 * 秒を「HH時間MM分」のMMをゼロ埋めした文字列に変換します。
 * @param {*} second 秒
 * @returns 「HH時間MM分」のMMをゼロ埋めした文字列
 */
export const secondToHHMM_00_ja = (second) => {
  let output = "";
  let hour = Math.floor(second / 3600);
  let minute = Math.floor((second / 60) % 60);
  if (hour > 0) {
    output += hour;
    output += "時間";
  }
  if (minute >= 10) {
    output += minute;
    output += "分";
  } else if (minute > 0) {
    output += "0" + minute;
    output += "分";
  } else {
    output += "00分";
  }
  return output;
};

/**
 * タスクの配列をBuildUp形式のテキストに変換します。
 * @param {*} items
 * @returns
 */
export const taskItemsToBuildUp = (items) => {
  let text = "";
  let totalSecond = 0;
  // 日付
  let newDate = new Date();
  text += "🌟";
  text +=
    newDate.getHours < 4
      ? newDate
          .setDate(--newDate.getDate)
          .toLocaleDateString()
          .replaceAll("/", ".")
      : newDate.toLocaleDateString().replaceAll("/", ".");
  text += "\r\n";
  text += "\r\n";
  text += "💡やったこと\r\n";
  items.forEach((item) => {
    if (item.category !== "") {
      text += "《" + item.category + "》";
    }
    text += item.content;
    text += "\r\n";
    totalSecond += item.spentSecond;
  });
  text += "\r\n";
  text += "計: " + secondToHHMM_00_ja(totalSecond);
  text += "\r\n";
  text += "\r\n";
  text += "✍感想";
  text += "\r\n";
  return text;
};
