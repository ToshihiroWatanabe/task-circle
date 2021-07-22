import { byteLength } from "utils/string";

describe("byteLengthのテスト", () => {
  test("'あア亜'と入力して6が返る事", () => {
    expect(byteLength("あア亜")).toEqual(6);
  });
  test("'あaア'と入力して5が返る事", () => {
    expect(byteLength("あaア")).toEqual(5);
  });
  test("'aB!'と入力して3が返る事", () => {
    expect(byteLength("aB!")).toEqual(3);
  });
});
