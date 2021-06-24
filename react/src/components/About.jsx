import React from "react";
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

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    padding: "1rem",
    marginBottom: "1rem",
  },
});

/**
 * 「～について」ページのコンポーネントです。
 */
const About = () => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <Typography variant="h5">Task Circle（タスクサークル）</Typography>
        <Typography variant="caption">
          ビルド時刻{" "}
          {format(preval`module.exports = Date.now();`, "yyyy/MM/dd HH:mm:ss")}
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
        </Typography>

        <Typography>
          Copyright © {new Date().getFullYear()} ワタナベトシヒロ All Rights
          Reserved.
        </Typography>
      </Card>
    </>
  );
};

export default About;
