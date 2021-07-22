import { ONCE_COUNT, COUNT_INTERVAL } from "utils/constant";

test("一度にカウントする秒数の定数が1である事", () => {
  expect(ONCE_COUNT).toEqual(1);
});

test("カウントの間隔(ミリ秒)の定数が1000である事", () => {
  expect(COUNT_INTERVAL).toEqual(1000);
});
