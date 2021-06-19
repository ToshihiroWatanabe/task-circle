import React, { Fragment, useContext, useEffect, useState } from "react";
import ReportDatePicker from "components/reports/ReportDatePicker";
import ReportFormDialog from "components/reports/ReportFormDialog";
import ReportCard from "components/reports/ReportCard";
import format from "date-fns/format";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Context } from "contexts/Context";
import SyncSnackbar from "components/SimpleSnackbar";

const DEFAULT_REPORT = {
  date: "",
  content: "",
  report_items: [
    {
      category: "",
      content: "",
      hour: 1,
      minute: 0,
    },
  ],
  updatedAt: 0,
};

const localStorageGetItemReports = localStorage.getItem("reports")
  ? JSON.parse(localStorage.getItem("reports"))
  : [];

const useStyles = makeStyles((theme) => ({
  contents1: {
    [theme.breakpoints.up("md")]: { display: "flex" },
  },
  leftColumn: {
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  },
  rightColumn: { [theme.breakpoints.up("md")]: { margin: theme.spacing(1) } },
  selectedDateReportHeading: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      marginTop: "0.5rem",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  },
  selectedDateReportNotFound: {
    marginTop: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  },
  createReportButton: {
    margin: theme.spacing(1),
    marginLeft: "0",
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(4),
    },
  },
  reportCard: {
    margin: theme.spacing(2),
  },
  reportsHeading: {
    [theme.breakpoints.up("md")]: { margin: "0 1rem" },
  },
  monthReportNotFound: {
    [theme.breakpoints.up("md")]: { margin: "1rem" },
  },
}));

/**
 * 日報管理ページのコンポーネントです。
 */
const Reports = () => {
  const classes = useStyles();
  const [state, setState] = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [syncSnackbarOpen, setSyncSnackbarOpen] = useState(false);
  const [syncSnackbarMessage, setSyncSnackbarMessage] = useState("");
  // 日報入力ダイアログの初期値
  const [defaultReport, setDefaultReport] = useState(
    JSON.parse(JSON.stringify(DEFAULT_REPORT))
  );
  // カテゴリーの配列
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setState((state) => {
      setCategories((categories) => {
        for (let i = 0; i < state.reports.length; i++) {
          for (let j = 0; j < state.reports[i].report_items.length; j++) {
            categories.push({
              label: state.reports[i].report_items[j].category,
              value: state.reports[i].report_items[j].category,
            });
          }
        }
        // 重複を削除
        const newCategories = categories.filter((element, index, array) => {
          return (
            array.findIndex((element2) => element.label === element2.label) ===
            index
          );
        });
        return newCategories;
      });
      return state;
    });
  }, []);

  /**
   * 日報を作成する処理です。
   * @param {*} input
   */
  const onCreateReport = (input) => {
    // 先端・末尾の空白スペースを削除
    for (let i = 0; i < input.report_items.length; i++) {
      input.report_items[i].category = input.report_items[i].category.trim();
      input.report_items[i].content = input.report_items[i].content.trim();
    }
    setState((state) => {
      let newReports = [input, ...state.reports]
        // 重複を削除
        .filter(
          (element, index, array) =>
            array.findIndex((e) => e.date === element.date) === index
        )
        // 並べ替え
        .sort((a, b) => {
          return b.date.replaceAll("-", "") - a.date.replaceAll("-", "");
        });
      localStorage.setItem("reports", JSON.stringify(newReports));
      return { ...state, reports: newReports };
    });
  };

  /**
   * 作成ボタンがクリックされたときの処理です。
   * @param {*} event
   */
  const onCreateButtonClick = (event) => {
    setDefaultReport(
      JSON.parse(
        JSON.stringify({
          ...DEFAULT_REPORT,
          date: format(selectedDate, "yyyy-MM-dd"),
        })
      )
    );
    setFormDialogOpen(true);
  };

  /**
   * 編集ボタンがクリックされたときの処理です。
   * @param {*} date
   */
  const onEditButtonClick = (date) => {
    setDefaultReport(() => {
      let defaultReport = JSON.parse(
        JSON.stringify(
          state.reports.filter((report, index) => {
            return report.date.includes(date);
          })[0]
        )
      );
      return defaultReport;
    });
    setFormDialogOpen(true);
  };

  /**
   * 削除ボタンがクリックされたときの処理です。
   * @param {*} date 削除する日報の日付
   */
  const onDeleteButtonClick = (date) => {
    setState((state) => {
      let newReports = state.reports.filter((report) => {
        return report.date !== date;
      });
      localStorage.setItem("reports", JSON.stringify(newReports));
      return { ...state, reports: newReports };
    });
  };

  return (
    <>
      <div className={classes.contents1}>
        <div className={classes.leftColumn}>
          {/* 日付選択カレンダー */}
          <ReportDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setCalendarMonth={setCalendarMonth}
            reports={state.reports}
          />
        </div>
        <div className={classes.rightColumn}>
          <Typography
            variant="h5"
            className={classes.selectedDateReportHeading}
          >
            {format(selectedDate, "yyyy.MM.dd")}の日報
          </Typography>
          {/* 選択した日に日報がなかったとき */}
          {state.reports.filter((report, index) => {
            return report.date.includes(format(selectedDate, "yyyy-MM-dd"));
          }).length === 0 && (
            <div className={classes.selectedDateReportNotFound}>
              <Typography>日報はありません</Typography>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                className={classes.createReportButton}
                startIcon={<AddCircleOutlineIcon />}
                onClick={(event) => onCreateButtonClick(event)}
              >
                日報を作成する
              </Button>
            </div>
          )}
          {/* 選択した日に日報があったとき */}
          {state.reports.filter((report, index) => {
            return report.date.includes(format(selectedDate, "yyyy-MM-dd"));
          }).length > 0 &&
            state.reports
              .filter((report, index) => {
                return report.date.includes(format(selectedDate, "yyyy-MM-dd"));
              })
              .map((report, index) => {
                return (
                  <div key={index} className={classes.reportCard}>
                    <ReportCard
                      report={report}
                      onEditButtonClick={() => onEditButtonClick(report.date)}
                      onDeleteButtonClick={() =>
                        onDeleteButtonClick(report.date)
                      }
                    />
                  </div>
                );
              })}
        </div>
      </div>
      <Typography variant="h5" className={classes.reportsHeading}>
        日報一覧
      </Typography>
      {state.reports
        .filter((report, index) => {
          return report.date.includes(calendarMonth);
        })
        .map((report, index) => {
          return (
            <Fragment key={index}>
              <div className={classes.reportCard}>
                <ReportCard
                  className={classes.reportCard}
                  report={report}
                  onEditButtonClick={onEditButtonClick}
                  onDeleteButtonClick={onDeleteButtonClick}
                />
              </div>
            </Fragment>
          );
        })}
      {/* その月の日報がないとき→「日報がありません」と表示 */}
      {state.reports.filter((report, index) => {
        return report.date.includes(calendarMonth);
      }).length === 0 && (
        <div className={classes.monthReportNotFound}>日報がありません</div>
      )}

      {/* 日報入力ダイアログ */}
      <ReportFormDialog
        open={formDialogOpen}
        setOpen={setFormDialogOpen}
        onCreate={onCreateReport}
        defaultReport={defaultReport}
        categories={categories}
      />
      <SyncSnackbar
        open={syncSnackbarOpen}
        setOpen={setSyncSnackbarOpen}
        message={syncSnackbarMessage}
      />
    </>
  );
};

export default Reports;
