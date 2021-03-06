import {
  secondToHHMMSS,
  secondToHHMMSS_ja,
  secondToHHMM_00_ja,
} from "utils/convert";

/**
 * タスクをHH:MM:SS形式でクリップボードにコピーします。
 */
export const copyTasksToClipboard = (items: any) => {
  let text = "";
  let totalSecond = 0;
  items.forEach((item: any) => {
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
export const copyTasksToClipboard_ja = (items: any) => {
  let text = "";
  let totalSecond = 0;
  items.forEach((item: any) => {
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
  text += "\r\n";
  text += "計 " + secondToHHMMSS_ja(totalSecond);
  copyToClipboard(text);
  return true;
};

/**
 * タスクをBuildUp形式でクリップボードにコピーします。
 */
export const copyTasksToClipboard_BuildUp = (items: any) => {
  let text = "";
  let totalSecond = 0;
  // 日付
  let newDate: any = new Date();
  text += "🌟*";
  text +=
    newDate.getHours < 4
      ? newDate
          .setDate(--newDate.getDate)
          .toLocaleDateString()
          .replaceAll("/", ".")
      : newDate.toLocaleDateString().replaceAll("/", ".");
  text += "*\r\n";
  text += "\r\n";
  text += "💡*やったこと*\r\n";
  items.forEach((item: any) => {
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
  text += "&#x270d; *感想*";
  text += "\r\n";
  copyToClipboard(text);
  return true;
};

/**
 * テキストをクリップボードにコピーします。
 * @param {string} text
 */
const copyToClipboard = (text: string) => {
  // 一時的に要素を追加
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  textArea.id = "copyArea";
  const documentGetElementByIdApp = document.getElementById("app");
  if (documentGetElementByIdApp) {
    documentGetElementByIdApp.appendChild(textArea);
  }
  const documentGetElementByIdCopyArea = document.getElementById("copyArea");
  if (documentGetElementByIdCopyArea) {
    textArea.select();
    document.execCommand("Copy");
    documentGetElementByIdCopyArea.remove();
  }
};
