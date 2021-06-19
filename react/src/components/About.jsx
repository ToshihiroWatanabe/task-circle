import React from "react";
import { IconButton, Link, Tooltip, Typography } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import format from "date-fns/format";
import preval from "preval.macro";

/**
 * 「～について」ページのコンポーネントです。
 */
const About = () => {
  return (
    <>
      <div
        style={{
          // display: "flex",
          // alignItems: "center",
          margin: "0 1rem",
        }}
      >
        <Typography variant="h5">Task Circle（タスクサークル）</Typography>
        <Typography
          variant="caption"
          style={{ margin: "0 1rem", marginTop: "0.5rem" }}
        >
          ビルド時刻{" "}
          {format(preval`module.exports = Date.now();`, "yyyy/MM/dd HH:mm:ss")}
        </Typography>
        <Tooltip title="GitHubでリポジトリを見る">
          <Link
            href="https://github.com/ToshihiroWatanabe/daily-report-management"
            target="_blank"
            rel="noopener"
          >
            <IconButton size="small">
              <GitHubIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </div>
      <Typography
        component="p"
        style={{
          margin: "0 1rem",
        }}
      >
        Copyright © {new Date().getFullYear()} ワタナベトシヒロ All Rights
        Reserved.
      </Typography>
    </>
  );
};

export default About;
