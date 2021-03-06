import { useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TimerFab from "components/home/TimerFab";
import React, { memo, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useLocation } from "react-router-dom";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

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
  dragIndicator: {
    position: "absolute",
    display: "block",
    top: "0",
    right: "0",
    color: "gray",
  },
}));

/**
 * リサイズ＆ドラッグ移動可能なタイマーのコンポーネントです。
 */
const TimerRnd = memo((props: { todoLists: any; onPlayButtonClick: any }) => {
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

  const [positionX, setPositionX] = useState(
    document.documentElement.clientWidth / 2 - DEFAULT_WIDTH / 2
  );
  const [positionY, setPositionY] = useState(
    document.documentElement.clientHeight - DEFAULT_HEIGHT - DEFAULT_HEIGHT / 2
  );
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /** 選択されているタスク */
  const selectedTask =
    Object.values(props.todoLists).filter((column: any) => {
      return (
        column.items.filter((item: any) => {
          return item.isSelected;
        })[0] !== undefined
      );
    }).length > 0
      ? //@ts-ignore
        Object.values(props.todoLists)
          .filter((column: any) => {
            return (
              column.items.filter((item: any) => {
                return item.isSelected;
              })[0] !== undefined
            );
          })[0]
          .items.filter((item: any) => {
            return item.isSelected;
          })[0]
      : null;

  // ウインドウがリサイズされたとき
  window.addEventListener("resize", () => {
    if (positionY + 80 + height > window.innerHeight) {
      setPositionY(window.innerHeight - 80 - height);
    }
    if (positionX + 20 + width > window.innerWidth) {
      setPositionX(window.innerWidth - 20 - width);
    }
  });

  // URLに変更があったとき
  useEffect(() => {
    if (location.pathname === "/") {
      // @ts-ignore
      if (positionY + 80 + parseInt(height) > window.innerHeight) {
        // @ts-ignore
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
  const onResize = (e: any, dir: any, refToElement: any) => {
    setWidth(refToElement.style.width);
    setHeight(refToElement.style.height);
  };

  /**
   * リサイズが終わったときの処理です。
   */
  const onResizeStop = (e: any, dir: any, refToElement: any, delta: any) => {
    setPositionX(dir.match(/.*Left/) ? positionX - delta.width : positionX);
    setPositionY(dir.match(/top.*/) ? positionY - delta.height : positionY);
  };

  /**
   * ドラッグが終わったときの処理です。
   * @param {*} e
   * @param {*} d
   */
  const onDragStop = (e: any, d: any) => {
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
          {/* @ts-ignore */}
          <TimerFab
            todoLists={props.todoLists}
            isDragging={isDragging}
            onPlayButtonClick={props.onPlayButtonClick}
          />
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
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          position={{
            x: positionX,
            y: positionY,
          }}
          default={{
            x: 0,
            y: 0,
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
            zIndex: 1,
          }}
        >
          <TimerFab
            todoLists={props.todoLists}
            isDragging={isDragging}
            onPlayButtonClick={props.onPlayButtonClick}
            width={width}
            height={height}
          />
          {isHovered && (
            <div className={classes.dragIndicator}>
              <DragIndicatorIcon fontSize="small" />
            </div>
          )}
        </Rnd>
      )}
    </>
  );
});

export default TimerRnd;
