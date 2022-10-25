import axios from "axios";

export default axios.create({
  // リクエスト送信先のURL
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:8080/api",
  // ヘッダーでタイプをJSONに指定
  headers: {
    "Content-type": "application/json",
  },
});
