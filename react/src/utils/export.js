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
