import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, Typography } from "@material-ui/core";
import ReportAnalytics from "components/ReportAnalytics";

/**
 * ポートフォリオページのコンポーネントです。
 */
const Portfolio = () => {
  const [reports] = useState([]);
  const [userName] = useState("");
  const [introduction] = useState("");
  const [skillSet] = useState([]);
  const reportId = document.location.href.split("/").slice(-1)[0];

  const [message, setMessage] = useState("読込中...");

  useEffect(() => {}, []);

  return (
    <>
      <Link
        to="/"
        id="linkToHome"
        onClick={() => {
          document.getElementById("linkToHome").click();
          setTimeout(window.location.reload(), 1);
        }}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <Button>
          <Typography>日報管理アプリ</Typography>
        </Button>
      </Link>
      {reports.length > 0 && (
        <>
          <Card
            style={{
              width: "95%",
              padding: "1rem",
              marginLeft: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h5">{userName}</Typography>
            <Typography>{introduction}</Typography>
            <Typography variant="h6" style={{ marginTop: "1rem" }}>
              {skillSet.length > 0 && "スキルセット"}
            </Typography>
            {skillSet.map((e) => {
              return (
                <>
                  <Chip label={e} style={{ margin: "0.1rem" }} />
                </>
              );
            })}
          </Card>
          <ReportAnalytics reports={reports} />
        </>
      )}
      {reports.length === 0 && (
        <>
          <div>{message}</div>
        </>
      )}
    </>
  );
};

export default Portfolio;
