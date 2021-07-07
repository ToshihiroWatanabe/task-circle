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
export const maskEmail = (email) => {
  let emailSplit = email.split("@");
  emailSplit[0] = emailSplit[0].replace(
    emailSplit[0].substring(1, emailSplit[0].length),
    "*".repeat(emailSplit[0].length - 1)
  );
  return emailSplit[0] + "@" + emailSplit[1];
};
