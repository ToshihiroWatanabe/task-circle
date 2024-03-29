import {
  Box,
  Button,
  Card,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import axios from "axios";
import format from "date-fns/format";
import preval from "preval.macro";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "calc(100% - 2rem)",
    padding: "1rem",
    marginBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

/**
 * 「～について」ページのコンポーネントです。
 */
const About = () => {
  const classes = useStyles();
  const [buildTimestamp, setBuildTimestamp] = useState(new Date(0));
  const [newestEmojiFontSize, setNewestEmojiFontSize] = useState(1);

  useEffect(() => {
    axios
      .create({
        // リクエスト送信先のURL
        baseURL:
          process.env.NODE_ENV === "development" ? "http://localhost:8080" : "",
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
        <Box mt="1rem" />
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
            {buildTimestamp.getTime() > 0 &&
            buildTimestamp.getTime() - preval`module.exports = Date.now();` <=
              10 * 60 * 1000 ? (
              <>
                お使いのアプリは最新のバージョンです
                <span
                  style={{ fontSize: newestEmojiFontSize + "rem" }}
                  onClick={() => {
                    setNewestEmojiFontSize(
                      newestEmojiFontSize + 0.5 < 10
                        ? newestEmojiFontSize + 0.5
                        : 10
                    );
                  }}
                >
                  {newestEmojiFontSize < 10 ? <>😀</> : <>🤩</>}
                </span>
              </>
            ) : (
              ""
            )}
            {buildTimestamp.getTime() - preval`module.exports = Date.now();` >=
            60 * 60 * 1000
              ? "キャッシュを削除すると最新版がダウンロードされます。"
              : ""}
          </div>
        </div>
        <Link
          href="https://github.com/ToshihiroWatanabe/task-circle"
          target="_blank"
          rel="noopener"
        >
          <Button size="small" variant="outlined" style={{ color: "black" }}>
            <GitHubIcon style={{ marginRight: "0.5rem" }} />
            使い方やソースコードを見る
          </Button>
        </Link>

        <Typography style={{ margin: "1rem 0" }}>
          Copyright © {new Date().getFullYear()} ワタナベトシヒロ All Rights
          Reserved.
        </Typography>
      </Card>
    </>
  );
};

export default About;
