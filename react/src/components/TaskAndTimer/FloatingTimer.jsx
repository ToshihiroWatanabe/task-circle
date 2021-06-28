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

  const onResize = (e, dir, refToElement, delta, position) => {
    setWidth(refToElement.style.width);
    setHeight(refToElement.style.height);
  };

  const onResizeStop = (e, dir, refToElement, delta, position) => {
    console.log(dir);
    setPositionX(dir.match(/.*Left/) ? positionX - delta.width : positionX);
    setPositionY(dir.match(/top.*/) ? positionY - delta.height : positionY);
  };

  const onDragStop = (e, d) => {
    setTimeout(() => {
      setIsDragging(false);
    }, 1);
    setPositionX(d.x);
    setPositionY(d.y);
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
            border: "solid 1px #ddd",
            borderRadius: "8px",
            background: "#f0f0f0",
            zIndex: "1",
          }}
        >
          <TimerFab
            columns={props.columns}
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

export default FloatingTimer;
