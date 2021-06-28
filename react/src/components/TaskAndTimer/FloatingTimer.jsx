import React, { memo, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./FloatingTimer.css";
import { useTheme, Zoom, useMediaQuery } from "@material-ui/core";
import { Rnd } from "react-rnd";
import TimerFab from "./TimerFab";

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 180;
const MIN_WIDTH = 180;
const MIN_HEIGHT = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const FloatingTimer = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();

  const useMediaQueryThemeBreakpointsUpMd = useMediaQuery(
    theme.breakpoints.up("md")
  );
  const useMediaQueryThemeBreakpointsDownSm = useMediaQuery(
    theme.breakpoints.down("sm")
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

  const onResizeStop = (e, dir, refToElement, delta, position) => {
    let count = 0;
    setWidth((width) => {
      setPositionX((positionX) => {
        setHeight((height) => {
          if (count === 0) {
            height =
              height + delta.height > window.innerHeight * 0.9
                ? window.innerHeight * 0.9
                : height + delta.height;
            setPositionY(
              document.documentElement.clientHeight -
                height -
                DEFAULT_HEIGHT / 2
            );
            count++;
          }
          return height;
        });
        return position.x > window.innerWidth * 0.9
          ? window.innerWidth * 0.9
          : position.x;
      });
      console.log(width, delta.width);
      width =
        width + delta.width > window.innerWidth * 0.9
          ? window.innerWidth * 0.9
          : width + delta.width;
      console.log(width);
      return width;
    });
  };

  const onDragStop = (e, d) => {
    setTimeout(() => {
      setIsDragging(false);
    }, 1);
    setPositionX(
      d.x > 0
        ? d.x < window.innerWidth - width
          ? d.x
          : window.innerWidth - width
        : 0
    );
  };

  return (
    <>
      {useMediaQueryThemeBreakpointsDownSm && (
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
              columns={props.columns}
              isDragging={isDragging}
              onPlayButtonClick={props.onPlayButtonClick}
            />
          </Zoom>
        </div>
      )}
      {useMediaQueryThemeBreakpointsUpMd && (
        <Rnd
          dragAxis="x"
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          maxWidth={window.innerWidth * 0.9}
          maxHeight={window.innerHeight * 0.9}
          lockAspectRatio={true}
          onResizeStop={onResizeStop}
          onDrag={() => {
            setIsDragging(true);
          }}
          onDragStop={onDragStop}
          position={{ x: positionX, y: positionY }}
          default={{
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
          }}
          style={{
            display: "flex",
            posision: "fixed",
            bottom: "0",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #ddd",
            borderRadius: "8px",
            background: "#f0f0f0",
            zIndex: "1",
            padding: "8px",
          }}
        >
          <TimerFab
            columns={props.columns}
            isDragging={isDragging}
            onPlayButtonClick={props.onPlayButtonClick}
          />
        </Rnd>
      )}
    </>
  );
});

export default FloatingTimer;
