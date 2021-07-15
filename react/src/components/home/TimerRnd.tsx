// @ts-nocheck
import { useMediaQuery, useTheme, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TimerFab from "components/home/TimerFab";
import React, { memo, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useLocation } from "react-router-dom";

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 180;
const MIN_WIDTH = 120;
const MIN_HEIGHT = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    zIndex: 1,
    bottom: 0,
    right: 0,
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

/**
 * リサイズ＆ドラッグ移動可能なタイマーのコンポーネントです。
 */
const TimerRnd = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const useMediaQueryThemeBreakpointsUpMd = useMediaQuery(
    theme.breakpoints.up("md")
  );
  const useMediaQueryThemeBreakpointsOnlySm = useMediaQuery(
    theme.breakpoints.only("sm")
  );

  const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
    theme.breakpoints.down("xs")
  );

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const [positionX, setPositionX] = useState(
    document.documentElement.clientWidth / 2 - DEFAULT_WIDTH / 2
  );
  const [positionY, setPositionY] = useState(
    document.documentElement.clientHeight - DEFAULT_HEIGHT - DEFAULT_HEIGHT / 2
  );
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  /** 選択されているタスク */
  const selectedTask =
    Object.values(props.todoLists).filter((column, index) => {
      return (
        column.items.filter((item, index) => {
          return item.isSelected;
        })[0] !== undefined
      );
    }).length > 0
      ? Object.values(props.todoLists)
          .filter((column, index) => {
            return (
              column.items.filter((item, index) => {
                return item.isSelected;
              })[0] !== undefined
            );
          })[0]
          .items.filter((item, index) => {
            return item.isSelected;
          })[0]
      : null;

  // URLに変更があったとき
  useEffect(() => {
    if (location.pathname === "/") {
      if (positionY + 80 + parseInt(height) > window.innerHeight) {
        setPositionY(window.innerHeight - 80 - parseInt(height));
      }
    }
  }, [location]);

  /**
   * リサイズされたときの処理です。
   * @param {*} e
   * @param {*} dir
   * @param {*} refToElement
   */
  const onResize = (e, dir, refToElement) => {
    setWidth(refToElement.style.width);
    setHeight(refToElement.style.height);
  };

  /**
   * リサイズが終わったときの処理です。
   */
  const onResizeStop = (e, dir, refToElement, delta) => {
    setPositionX(dir.match(/.*Left/) ? positionX - delta.width : positionX);
    setPositionY(dir.match(/top.*/) ? positionY - delta.height : positionY);
  };

  /**
   * ドラッグが終わったときの処理です。
   * @param {*} e
   * @param {*} d
   */
  const onDragStop = (e, d) => {
    setTimeout(() => {
      setIsDragging(false);
    }, 1);
    setPositionX(d.x);
    setPositionY(d.y);
  };

  return (
    <>
      {(useMediaQueryThemeBreakpointsOnlySm ||
        (selectedTask && useMediaQueryThemeBreakpointsDownXs)) && (
        <div className={classes.root}>
          <Zoom
            timeout={transitionDuration}
            in={true}
            style={{
              transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
          >
            <TimerFab
              todoLists={props.todoLists}
              isDragging={isDragging}
              onPlayButtonClick={props.onPlayButtonClick}
            />
          </Zoom>
        </div>
      )}
      {useMediaQueryThemeBreakpointsUpMd && (
        <Rnd
          bounds="window"
          size={{ width: width, height: height }}
          lockAspectRatio={true}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          maxWidth={window.innerWidth * 0.9}
          maxHeight={window.innerHeight * 0.9}
          onResize={onResize}
          onResizeStop={onResizeStop}
          onDrag={() => {
            setIsDragging(true);
          }}
          onDragStop={onDragStop}
          position={{
            x: positionX,
            y: positionY,
          }}
          default={{
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
          }}
          style={{
            border:
              theme.palette.type === "light"
                ? "solid 1px #ddd"
                : "solid 1px #111",
            borderRadius: "8px",
            background: theme.palette.type === "light" ? "#f0f0f0" : "#424242",
            zIndex: "1",
          }}
        >
          <TimerFab
            todoLists={props.todoLists}
            isDragging={isDragging}
            onPlayButtonClick={props.onPlayButtonClick}
            width={width}
            height={height}
          />
        </Rnd>
      )}
    </>
  );
});

export default TimerRnd;
