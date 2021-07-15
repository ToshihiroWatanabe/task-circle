/**
 * 全角文字は2文字、半角文字は1文字としてカウントします。
 * @param {string} str
 * @returns 文字数
 */
export const byteLength = (str: string) => {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    str[i].match(/[ -~]/) ? (length += 1) : (length += 2);
  }
  return length;
};

/**
 * 指定された文字数を超えた分を省略します。
 * @param {string} str 文字列
 * @param {number} length 文字数
 */
export const byteSlice = (str: string, length: number) => {
  if (byteLength(str) <= length) {
    return str;
  }
  while (byteLength(str) > length) {
    str = str.slice(0, -1);
  }
  return str + "...";
};

/**
 * メールアドレスを一部隠します。
 *
 * @param {string} email
 * @returns マスク加工されたメールアドレス
 */
export const maskEmail = (email: string) => {
  let emailSplit = email.split("@");
  emailSplit[0] = emailSplit[0].replace(
    emailSplit[0].substring(1, emailSplit[0].length),
    "*".repeat(emailSplit[0].length - 1)
  );
  return emailSplit[0] + "@" + emailSplit[1];
};
