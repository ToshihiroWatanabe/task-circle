import {
  secondToHHMMSS,
  secondToHHMMSS_ja,
  secondToHHMM_00_ja,
} from "utils/convert";

/**
 * タスクをHH:MM:SS形式でクリップボードにコピーします。
 */
export const copyTasksToClipboard = (items) => {
  let text = "";
  let totalSecond = 0;
  items.forEach((item) => {
    if (item.category !== "") {
      text += "《" + item.category + "》";
    }
    text += item.content;
    text += "\r\n";
    text += secondToHHMMSS(item.spentSecond);
    if (item.estimatedSecond !== 0) {
      text += " / " + secondToHHMMSS(item.estimatedSecond);
    }
    text += "\r\n";
    text += "\r\n";
    totalSecond += item.spentSecond;
  });
  text += "計 " + secondToHHMMSS(totalSecond);
  copyToClipboard(text);
  return true;
};

/**
 * タスクを「HH時間MM分SS秒」形式でクリップボードにコピーします。
 */
export const copyTasksToClipboard_ja = (items) => {
  let text = "";
  let totalSecond = 0;
  items.forEach((item) => {
    if (item.category !== "") {
      text += "《" + item.category + "》";
    }
    text += item.content;
    text += "\r\n";
    text += secondToHHMMSS_ja(item.spentSecond);
    if (item.estimatedSecond !== 0) {
      text += " / " + secondToHHMMSS_ja(item.estimatedSecond);
    }
    text += "\r\n";
    totalSecond += item.spentSecond;
  });
  text += "計 " + secondToHHMMSS_ja(totalSecond);
  copyToClipboard(text);
  return true;
};

/**
 * タスクをBuildUp形式でクリップボードにコピーします。
 */
export const copyTasksToClipboard_BuildUp = (items) => {
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
  copyToClipboard(text);
  return true;
};

/**
 * テキストをクリップボードにコピーします。
 * @param {*} text
 */
const copyToClipboard = (text) => {
  // 一時的に要素を追加
  let textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  textArea.id = "copyArea";
  document.getElementById("app").appendChild(textArea);
  textArea.select(document.getElementById("copyArea"));
  document.execCommand("Copy");
  document.getElementById("copyArea").remove();
};

/**
 * 日報をテキスト形式でエクスポートします。
 */
export const exportReportsToTxt = (reports) => {
  let text = "";
  for (let i = 0; i < reports.length; i++) {
    // 日付
    text += "🌟" + reports[i].date.replaceAll("-", ".") + "\n";
    text += "\n";
    text += "💡やったこと\n";
    let totalMinute = 0;
    for (let j = 0; j < reports[i].report_items.length; j++) {
      text +=
        "《" +
        reports[i].report_items[j].category +
        "》" +
        reports[i].report_items[j].content +
        "（" +
        reports[i].report_items[j].hour +
        "時間" +
        reports[i].report_items[j].minute +
        "分）\n";
      totalMinute +=
        reports[i].report_items[j].hour * 60 +
        reports[i].report_items[j].minute;
    }
    text += "\n";
    text +=
      "計: " +
      Math.floor(totalMinute / 60) +
      "時間" +
      (totalMinute % 60) +
      "分\n";
    text += "\n";
    text += "✍感想\n";
    text += reports[i].content + "\n";
    text += "\n";
    text += "\n";
  }
  // HTMLのリンク要素を生成する
  const link = document.createElement("a");
  // リンク先にJSON形式の文字列データを置いておく
  link.href = "data:text/plain," + encodeURIComponent(text);
  // 保存するJSONファイルの名前をリンクに設定する
  link.download =
    "reports_" +
    new Date().toLocaleDateString().replaceAll("/", "-") +
    "_" +
    new Date().toLocaleTimeString().replaceAll(":", "-") +
    ".txt";
  // リンクをクリックさせる
  link.click();
};

/**
 * 日報をJSON形式でエクスポートします。
 */
export const exportReportsToJson = (reports) => {
  // HTMLのリンク要素を生成する
  const link = document.createElement("a");
  // リンク先にJSON形式の文字列データを置いておく
  link.href = "data:text/plain," + encodeURIComponent(JSON.stringify(reports));
  // 保存するJSONファイルの名前をリンクに設定する
  link.download =
    "reports_" +
    new Date().toLocaleDateString().replaceAll("/", "-") +
    "_" +
    new Date().toLocaleTimeString().replaceAll(":", "-") +
    ".json";
  // リンクをクリックさせる
  link.click();
};
