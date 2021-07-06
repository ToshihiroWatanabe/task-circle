/**
 * 全角文字は2文字、半角文字は1文字としてカウントします。
 * @param {*} str
 * @returns
 */
export const byteLength = (str) => {
  let length = 0;

  for (let i = 0; i < str.length; i++) {
    str[i].match(/[ -~]/) ? (length += 1) : (length += 2);
  }

  return length;
};

/**
 * 指定された文字数を超えた分を省略します。
 */
export const byteSlice = (str, length) => {
  while (byteLength(str) > length) {
    str = str.slice(0, -1);
  }
  return str + "...";
};
