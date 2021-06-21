import { endOfToday } from "date-fns/esm";
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
 * タスクの配列を日報に変換します。
 * @param {*} items タスクの配列
 */
export const taskItemsToReport = (items) => {
  let report = {
    date: format(new Date(), "yyyy/MM/dd"),
    content: "",
    report_items: [],
    updatedAt: 0,
  };
  items.forEach((item) => {
    if (item.spentSecond > 0) {
      let reportItem = {
        category: item.category,
        content: item.content,
        hour: Math.floor(item.spentSecond / 3600),
        minute: Math.floor((item.spentSecond / 60) % 60),
      };
      report.report_items.push(reportItem);
    }
  });
  return report;
};
