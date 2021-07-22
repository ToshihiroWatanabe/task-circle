import { ONCE_COUNT, COUNT_INTERVAL } from "utils/constant";

describe("定数のテスト", () => {
  test("一度にカウントする秒数が1である事", () => {
    expect(ONCE_COUNT).toEqual(1);
  });

  test("カウントの間隔(ミリ秒)が1000である事", () => {
    expect(COUNT_INTERVAL).toEqual(1000);
  });
});
