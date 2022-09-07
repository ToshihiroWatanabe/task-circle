/** アイコンの名前の一覧 */
const icons = ["tomato", "coffee"];

/**
 * faviconを、渡された名前のアイコンに変更します。
 * @param {string} icon アイコンの名前
 */
export function changeFaviconTo(icon: string) {
  if (icons.includes(icon)) {
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      return false;
    }
    link.href = "/favicon/" + icon + "/favicon.ico";
    return true;
  } else {
    return false;
  }
}
