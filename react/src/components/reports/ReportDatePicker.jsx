import React, { memo } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import jaLocale from "date-fns/locale/ja";
import format from "date-fns/format";
import "components/reports/ReportDatePicker.css";

const useStyles = makeStyles((theme) => ({
  red: {
    color: "red",
  },
  blue: {
    color: "blue",
  },
  dayWithDotContainer: {
    position: "relative",
  },
  dayWithDot: {
    position: "absolute",
    height: 0,
    width: 0,
    border: "3px solid",
    borderRadius: "50%",
    borderColor: theme.palette.secondary.main,
    right: "50%",
    transform: "translateX(3px)",
    top: "75%",
    backgroundColor: theme.palette.secondary.main,
  },
}));

class ExtendedUtils extends DateFnsUtils {
  getCalendarHeaderText(date) {
    return format(date, "yyyy年 MMM", { locale: this.locale });
  }
  getDatePickerHeaderText(date) {
    return format(date, "MMMd日", { locale: this.locale });
  }
}

/**
 * 日付を選択するカレンダーのコンポーネントです。
 * @param props
 */
const ReportDatePicker = memo((props) => {
  const classes = useStyles();

  /**
   * カレンダーの月が変わったときの処理です。
   * @param {*} event
   */
  const onMonthChange = (event) => {
    props.setCalendarMonth(format(event, "yyyy-MM"));
  };

  /**
   * 選択した日時が変わったときの処理です。
   */
  const onDateChange = (date) => {
    props.setSelectedDate(date);
  };

  /**
   * 日を描画します。
   */
  const renderDay = (day, selectedDate, dayInCurrentMonth, dayComponent) => {
    /** 日付の切り替わりは午前4時 */
    let today = new Date().setHours(new Date().getHours() - 4);
    // 日曜日
    if (day.getDay() === 0 && day < today && dayInCurrentMonth) {
      if (
        props.reports.filter((report, index) => {
          return report.date.includes(format(day, "yyyy-MM-dd"));
        }).length !== 0
      ) {
        return (
          <>
            <div className={classes.dayWithDotContainer}>
              {React.cloneElement(dayComponent, {
                style: { ...dayComponent.props.style, color: "red" },
              })}
              <div className={classes.dayWithDot} />
            </div>
          </>
        );
      }
      return (
        <>
          {React.cloneElement(dayComponent, {
            style: { ...dayComponent.props.style, color: "red" },
          })}
        </>
      );
      // 土曜日
    } else if (day.getDay() === 6 && day < today && dayInCurrentMonth) {
      if (
        props.reports.filter((report, index) => {
          return report.date.includes(format(day, "yyyy-MM-dd"));
        }).length !== 0
      ) {
        return (
          <>
            <div className={classes.dayWithDotContainer}>
              {React.cloneElement(dayComponent, {
                style: {
                  ...dayComponent.props.style,
                  color: "blue",
                  textShadow: "0px 0px 1px #000",
                },
              })}
              <div className={classes.dayWithDot} />
            </div>
          </>
        );
      }
      return (
        <>
          {React.cloneElement(dayComponent, {
            style: { ...dayComponent.props.style, color: "blue" },
          })}
        </>
      );
      // 平日
    } else {
      if (
        props.reports.filter((report, index) => {
          return report.date.includes(format(day, "yyyy-MM-dd"));
        }).length !== 0 &&
        dayInCurrentMonth
      ) {
        return (
          <div className={classes.dayWithDotContainer}>
            {dayComponent}
            <div className={classes.dayWithDot} />
          </div>
        );
      } else {
        return dayComponent;
      }
    }
  };

  return (
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="static"
          format="yyyy/MM/dd"
          margin="normal"
          value={props.selectedDate}
          onChange={onDateChange}
          onMonthChange={onMonthChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          maxDate={new Date().setHours(new Date().getHours() - 4)}
          minDate={new Date("2020-01-01")}
          renderDay={renderDay}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
});

export default ReportDatePicker;
