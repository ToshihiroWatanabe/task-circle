import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Card, Chip, Tooltip, Typography } from "@material-ui/core";
import format from "date-fns/format";
import { Fragment } from "react";

const COLORS = [
  "#e57373", // Red 300
  "#ffa726", // Orange 400
  "#fdd835", // Yellow 600
  "#d4e157", // Lime 400
  "#66bb6a", // Green 400
  "#42a5f5", // Blue 400
  "#7986cb", // Indigo 300
  "#ab47bc", // Purple 400
];

const pv = 2400;
const amt = 2400;

const useStyles = makeStyles((theme) => ({
  categoryCard: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  leftColumn: {},
  rightColumn: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  categoryChip: {
    width: "5.1rem",
    marginRight: "2px",
  },
}));

/** 凡例のテキストを描画します。 */
const renderColorfulLegendText = (value, entry) => {
  return <span style={{ color: "#000" }}>{value}</span>;
};

/**
 * 日報の分析レポートのコンポーネントです。
 * @param {*} props
 * @returns
 */
const ReportAnalytics = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  /** 月ごとの日報登録日数 */
  let nonStateNumberOfReportPerMonth = [];
  /** 月ごとの総合学習時間(分) */
  let nonStateTotalMinutePerMonth = [];
  /** 月ごとの総合学習時間(時間) */
  let nonStateTotalHourPerMonth = [];
  /** 総合学習時間(分) */
  let nonStateTotalMinutePerYear = 0;
  /** 総合学習時間(時間) */
  let nonStateTotalHourPerYear = 0;
  /** カテゴリー別の学習時間(分) */
  let nonStateTotalMinuteByCategory = [];
  /** カテゴリー別の学習時間(時間) */
  let nonStateTotalHourByCategory = [];
  /** 月別のカテゴリー別の学習時間(分) */
  let nonStateTotalMinutePerMonthByCategory = [];
  /** 月別のカテゴリー別の学習時間(時間) */
  let nonStateTotalHourPerMonthByCategory = [];

  // カテゴリー別学習比率で何位まで集計するか
  const [numberOfCategory, setNumberOfCategory] = useState(7);

  // 直近12ヶ月
  for (let i = 11; i >= 0; i--) {
    const now = new Date();
    let month = format(now.setMonth(now.getMonth() - i), "yyyy-MM");
    let uv = 0;
    let localTotalMinute = 0;
    // 日報数だけ繰り返す
    for (let j = 0; j < props.reports.length; j++) {
      if (props.reports[j].date.includes(month)) {
        uv++;
        // タスク数だけ繰り返す
        for (let k = 0; k < props.reports[j].report_items.length; k++) {
          localTotalMinute +=
            props.reports[j].report_items[k].hour * 60 +
            props.reports[j].report_items[k].minute;
          // 新しいカテゴリーであれば追加、既存のカテゴリーであれば加算
          let isCategoryAlreadyExist = false;
          for (let n = 0; n < nonStateTotalMinuteByCategory.length; n++) {
            if (
              props.reports[j].report_items[k].category ===
              nonStateTotalMinuteByCategory[n].category
            ) {
              isCategoryAlreadyExist = true;
              nonStateTotalMinuteByCategory[n].uv +=
                props.reports[j].report_items[k].hour * 60 +
                props.reports[j].report_items[k].minute;
            }
            if (isCategoryAlreadyExist === true) {
              break;
            }
          }
          // 新しいカテゴリーの場合
          if (!isCategoryAlreadyExist) {
            nonStateTotalMinuteByCategory.push({
              category: props.reports[j].report_items[k].category,
              uv:
                props.reports[j].report_items[k].hour * 60 +
                props.reports[j].report_items[k].minute,
              pv: pv,
              amt: amt,
            });
          }
          // 月別のカテゴリー別の学習時間
          isCategoryAlreadyExist = false;
          for (
            let n = 0;
            n < nonStateTotalMinutePerMonthByCategory.length;
            n++
          ) {
            if (
              props.reports[j].report_items[k].category ===
                nonStateTotalMinutePerMonthByCategory[n].category &&
              props.reports[j].date.includes(
                nonStateTotalMinutePerMonthByCategory[n].month
              )
            ) {
              isCategoryAlreadyExist = true;
              nonStateTotalMinutePerMonthByCategory[n].uv +=
                props.reports[j].report_items[k].hour * 60 +
                props.reports[j].report_items[k].minute;
            }
            if (isCategoryAlreadyExist === true) {
              break;
            }
          }
          // 新しいカテゴリーの場合
          if (!isCategoryAlreadyExist) {
            nonStateTotalMinutePerMonthByCategory.push({
              month: month,
              category: props.reports[j].report_items[k].category,
              uv:
                props.reports[j].report_items[k].hour * 60 +
                props.reports[j].report_items[k].minute,
              pv: pv,
              amt: amt,
            });
          }
        }
      }
    }
    nonStateNumberOfReportPerMonth.push({
      month: month.replace("-", "/"),
      // uv: Math.floor(31 * Math.random()),
      uv: uv,
      pv: pv,
      amt: amt,
    });
    nonStateTotalMinutePerMonth.push({
      month: month.replace("-", "/"),
      uv: localTotalMinute,
      pv: pv,
      amt: amt,
    });
    nonStateTotalMinutePerYear += localTotalMinute;
  }

  // 時間の長い順に並べ替え
  nonStateTotalMinuteByCategory.sort((a, b) => {
    return b.uv - a.uv;
  });
  nonStateTotalMinutePerMonthByCategory.sort((a, b) => {
    return b.uv - a.uv;
  });
  // 分から時に変換
  for (let i = 0; i < nonStateTotalMinutePerMonth.length; i++) {
    nonStateTotalHourPerMonth.push({
      month: nonStateTotalMinutePerMonth[i].month.replace("-", "/"),
      uv: Math.floor(nonStateTotalMinutePerMonth[i].uv / 60),
      pv: pv,
      amt: amt,
    });
  }
  nonStateTotalHourPerYear = Math.floor(nonStateTotalMinutePerYear / 60);
  for (let i = 0; i < nonStateTotalMinuteByCategory.length; i++) {
    nonStateTotalHourByCategory.push({
      category: nonStateTotalMinuteByCategory[i].category,
      uv: Math.floor(nonStateTotalMinuteByCategory[i].uv / 60),
      pv: pv,
      amt: amt,
    });
  }
  for (let i = 0; i < nonStateTotalMinutePerMonthByCategory.length; i++) {
    nonStateTotalHourPerMonthByCategory.push({
      month: nonStateTotalMinutePerMonthByCategory[i].month.replace("-", "/"),
      category: nonStateTotalMinutePerMonthByCategory[i].category,
      uv: Math.floor(nonStateTotalMinutePerMonthByCategory[i].uv / 60),
      pv: pv,
      amt: amt,
    });
  }

  /** 直近7日分の総合学習時間(分) */
  let nonStateTotalMinuteLastWeek = 0;
  /** 直近7日分の総合学習時間(時間) */
  let nonStateTotalHourLastWeek = 0;
  /** 直近7日分のカテゴリー別の学習時間(分) */
  // {category: , uv: }
  let nonStateTotalMinuteLastWeekByCategory = [];
  /** 直近7日分のカテゴリー別の学習時間(時間) */
  let nonStateTotalHourLastWeekByCategory = [];
  /** 直近7日分のタスク別の学習時間(分) */
  // {taskName: , uv: }
  let nonStateTotalMinuteLastWeekByTask = [];
  /** 直近7日分のタスク別の学習時間(時間) */
  let nonStateTotalHourLastWeekByTask = [];
  /** 何日分集計するか */
  const NUMBER_OF_DAYS = 7;

  let lastWeekOutput = "";

  if (props.reports.length >= NUMBER_OF_DAYS) {
    // 直近の日報を集計する
    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
      // console.log(props.reports[i].date);
      // タスク数だけ繰り返す
      for (let j = 0; j < props.reports[i].report_items.length; j++) {
        // console.log(props.reports[i].report_items[j]);
        // 新しいカテゴリーなら追加、既存のカテゴリーなら加算
        let isCategoryAlreadyExist = false;
        for (let k = 0; k < nonStateTotalMinuteLastWeekByCategory.length; k++) {
          if (
            props.reports[i].report_items[j].category ===
            nonStateTotalMinuteLastWeekByCategory[k].category
          ) {
            isCategoryAlreadyExist = true;
            nonStateTotalMinuteLastWeekByCategory[k].uv +=
              props.reports[i].report_items[j].hour * 60 +
              props.reports[i].report_items[j].minute;
          }
          if (isCategoryAlreadyExist === true) {
            break;
          }
        }
        // 新しいカテゴリーの場合
        if (!isCategoryAlreadyExist) {
          nonStateTotalMinuteLastWeekByCategory.push({
            category: props.reports[i].report_items[j].category,
            uv:
              props.reports[i].report_items[j].hour * 60 +
              props.reports[i].report_items[j].minute,
            pv: pv,
            amt: amt,
          });
        }
        // 新しいタスク名なら追加、既存のタスク名なら加算
        let isTaskAlreadyExist = false;
        for (let k = 0; k < nonStateTotalMinuteLastWeekByTask.length; k++) {
          if (
            props.reports[i].report_items[j].content ===
            nonStateTotalMinuteLastWeekByTask[k].content
          ) {
            isTaskAlreadyExist = true;
            nonStateTotalMinuteLastWeekByTask[k].uv +=
              props.reports[i].report_items[j].hour * 60 +
              props.reports[i].report_items[j].minute;
          }
          if (isTaskAlreadyExist === true) {
            break;
          }
        }
        // 新しいタスク名の場合
        if (!isTaskAlreadyExist) {
          nonStateTotalMinuteLastWeekByTask.push({
            content: props.reports[i].report_items[j].content,
            uv:
              props.reports[i].report_items[j].hour * 60 +
              props.reports[i].report_items[j].minute,
            pv: pv,
            amt: amt,
          });
        }
        // 総合学習時間に加算する
        nonStateTotalMinuteLastWeek +=
          props.reports[i].report_items[j].hour * 60 +
          props.reports[i].report_items[j].minute;
      }
      if (i === 0) {
        lastWeekOutput += props.reports[i].date;
      } else if (i === NUMBER_OF_DAYS - 1) {
        lastWeekOutput = props.reports[i].date + " ~ " + lastWeekOutput;
      }
    }
  }

  console.log(nonStateTotalMinuteLastWeekByCategory);
  console.log(nonStateTotalMinuteLastWeekByTask);

  lastWeekOutput += "\n";
  nonStateTotalMinuteLastWeekByTask
    .sort((a, b) => {
      return b.uv - a.uv;
    })
    .map((value, index) => {
      lastWeekOutput +=
        "\n" +
        value.content +
        "\t" +
        Math.floor(value.uv / 60) +
        ":" +
        (Math.floor(value.uv % 60) < 10
          ? "0" + Math.floor(value.uv % 60)
          : Math.floor(value.uv % 60));
    });
  lastWeekOutput +=
    "\n\n計\t" +
    Math.floor(nonStateTotalMinuteLastWeek / 60) +
    ":" +
    (Math.floor(nonStateTotalMinuteLastWeek % 60) < 10
      ? "0" + Math.floor(nonStateTotalMinuteLastWeek % 60)
      : Math.floor(nonStateTotalMinuteLastWeek % 60));

  lastWeekOutput += "\n\n【カテゴリー別学習比率】\n";
  nonStateTotalMinuteLastWeekByCategory
    .sort((a, b) => {
      return b.uv - a.uv;
    })
    .map((value, index) => {
      lastWeekOutput +=
        "\n" +
        value.category +
        "\t" +
        Math.floor(value.uv / 60) +
        ":" +
        (Math.floor(value.uv % 60) < 10
          ? "0" + Math.floor(value.uv % 60)
          : Math.floor(value.uv % 60)) +
        "\t(" +
        Math.floor((value.uv / nonStateTotalMinuteLastWeek) * 100) +
        "%)";
    });

  console.log(lastWeekOutput);

  // console.log(nonStateTotalHourPerMonthByCategory);

  const [numberOfReportPerMonth] = useState(nonStateNumberOfReportPerMonth);
  const [totalHourPerMonth] = useState(nonStateTotalHourPerMonth);
  const [totalHourPerYear] = useState(nonStateTotalHourPerYear);
  const [totalHourByCategory] = useState(nonStateTotalHourByCategory);
  const [totalHourPerMonthByCategory] = useState(
    nonStateTotalHourPerMonthByCategory
  );

  return (
    <>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h5">日報投稿日数</Typography>
        <ResponsiveContainer height={300}>
          <BarChart
            width={600}
            height={300}
            data={numberOfReportPerMonth}
            margin={{ top: 30 }}
          >
            {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> */}
            <CartesianGrid stroke="#EEE" strokeDasharray="1 0" />
            <XAxis dataKey="month"></XAxis>
            <YAxis
              type="number"
              domain={[0, 31]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
              label={{ value: "単位(日)", position: "top" }}
            />
            <Bar dataKey="uv" barSize={30} fill={theme.palette.primary.main}>
              <LabelList dataKey="uv" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "8px" }}>
          総合学習時間
        </Typography>
        <ResponsiveContainer height={300}>
          <BarChart
            width={600}
            height={300}
            data={totalHourPerMonth}
            // data={totalHourPerMonthByCategory}
            margin={{ top: 30 }}
          >
            {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> */}
            <CartesianGrid stroke="#EEE" strokeDasharray="1 0" />
            <XAxis dataKey="month"></XAxis>
            <YAxis
              type="number"
              label={{ value: "単位(時間)", position: "top", dx: 4, dy: -8 }}
            />
            <Bar dataKey="uv" barSize={30} fill={theme.palette.primary.main}>
              <LabelList dataKey="uv" position="top" />
            </Bar>
            {/* TODO: 積み上げ棒グラフを実装する */}
            {/* {totalHourPerMonthByCategory.map((value, index) => {
              <Fragment key={index}>
            <Bar
              dataKey="uv"
              stackId="a"
              barSize={30}
              fill={COLORS[index % COLORS.length]}
            >
              <LabelList dataKey="uv" position="top" />
            </Bar>
            </Fragment>;
            })} */}
          </BarChart>
        </ResponsiveContainer>
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          総合学習時間: {totalHourPerYear}時間
          <Typography variant="caption">(直近12ヶ月)</Typography>
        </Typography>
      </Card>
      <Card
        style={{
          width: "95%",
          padding: "1rem",
          marginLeft: "1rem",
        }}
        className={classes.categoryCard}
      >
        <div className={classes.leftColumn}>
          <Typography variant="h5" style={{ marginBottom: "1rem" }}>
            カテゴリー別学習比率{" "}
            <Typography variant="caption">(直近12ヶ月)</Typography>
          </Typography>
          {totalHourByCategory
            .filter((value, index) => {
              return index < numberOfCategory;
            })
            .map((value, index) => (
              <Fragment key={index}>
                <div style={{ margin: "0.5rem" }}>
                  <Typography
                    style={{ display: "inline-block", marginRight: "0.5rem" }}
                  >
                    {index + 1}位
                  </Typography>
                  <Tooltip title={value.category} placement="top">
                    <Chip
                      label={value.category}
                      color="secondary"
                      size="small"
                      className={classes.categoryChip}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </Tooltip>
                  {value.uv}時間(
                  {Math.floor((value.uv / totalHourPerYear) * 100)}
                  %)
                </div>
              </Fragment>
            ))}
        </div>
        <div className={classes.rightColumn}>
          <PieChart width={300} height={300}>
            <Pie
              data={totalHourByCategory}
              dataKey="uv"
              nameKey="vategory"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              startAngle={90}
              endAngle={-270}
            >
              {totalHourByCategory
                .filter((value, index) => {
                  return index < numberOfCategory;
                })
                .map((item, index) => (
                  <Fragment key={index}>
                    <Cell fill={COLORS[index % COLORS.length]} />
                  </Fragment>
                ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="center"
              height={50}
              payload={totalHourByCategory
                .filter((value, index) => {
                  return index < numberOfCategory;
                })
                .map((item, index) => ({
                  id: item.name,
                  type: "square",
                  value: `${item.category}`,
                  color: COLORS[index % COLORS.length],
                }))}
              formatter={renderColorfulLegendText}
            />
          </PieChart>
        </div>
      </Card>
    </>
  );
};

export default ReportAnalytics;
