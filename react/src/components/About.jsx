import React, { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  Link,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import format from "date-fns/format";
import preval from "preval.macro";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "calc(100% - 2rem)",
    padding: "1rem",
    marginBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 8px)",
    },
  },
}));

/**
 * 「～について」ページのコンポーネントです。
 */
const About = () => {
  const classes = useStyles();
  const [buildTimestamp, setBuildTimestamp] = useState(new Date(0));

  useEffect(() => {
    axios
      .create({
        // リクエスト送信先のURL
        baseURL:
          process.env.NODE_ENV === "development" ? "http://localhost:8160" : "",
        // ヘッダーでタイプをJSONに指定
        headers: {
          "Content-type": "application/json",
        },
      })
      .get("/actuator/info")
      .then((response) => {
        setBuildTimestamp(new Date(response.data.application.buildTimestamp));
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <Card className={classes.card}>
        <Typography variant="h5">TaskCircle（タスクサークル）</Typography>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">
            クライアント側のビルド時刻{" "}
            {format(
              preval`module.exports = Date.now();`,
              "yyyy/MM/dd HH:mm:ss"
            )}
          </Typography>
          <Typography
            variant="caption"
            style={{ display: buildTimestamp.getTime() > 0 ? "" : "none" }}
          >
            サーバー側のビルド時刻{"　　 "}
            {format(buildTimestamp, "yyyy/MM/dd HH:mm:ss")}
          </Typography>
          {/* 最新のバージョンかどうか */}
          <div>
            {buildTimestamp.getTime() - preval`module.exports = Date.now();` <=
              3 * 60 * 1000 &&
            buildTimestamp.getTime() - preval`module.exports = Date.now();` >= 0
              ? "お使いのアプリは最新のバージョンです😀"
              : ""}
            {buildTimestamp.getTime() - preval`module.exports = Date.now();` >=
            60 * 60 * 1000
              ? "キャッシュを削除すると最新版がダウンロードされます。"
              : ""}
          </div>
        </div>
        <Tooltip title="GitHubでリポジトリを見る">
          <Link
            href="https://github.com/ToshihiroWatanabe/task-circle"
            target="_blank"
            rel="noopener"
          >
            <IconButton size="small" style={{ color: "black" }}>
              <GitHubIcon />
            </IconButton>
          </Link>
        </Tooltip>

        <Typography style={{ margin: "1rem 0" }}>
          Copyright © {new Date().getFullYear()} ワタナベトシヒロ All Rights
          Reserved.
        </Typography>
      </Card>
    </>
  );
};

export default About;
