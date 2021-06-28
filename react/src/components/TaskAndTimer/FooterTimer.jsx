import { useState } from "react";
import { Rnd } from "react-rnd";

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 180;

const style = {
  display: "flex",
  posision: "fixed",
  bottom: "0",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  zIndex: "9999",
};

/**
 * フッタータイマーのコンポーネントです。
 */
const FooterTimer = () => {
  const [positionX, setPositionX] = useState(
    document.documentElement.clientWidth / 2 - DEFAULT_WIDTH / 2
  );
  const [positionY, setPositionY] = useState(
    document.documentElement.clientHeight - DEFAULT_HEIGHT * 1.5
  );
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const onResizeStop = (e, dir, refToElement, delta, position) => {
    setWidth((width) => {
      setHeight((height) => {
        width = width + delta.width;
        height = height + delta.height;
        setPositionX((positionX) => {
          return positionX - delta.width / 2 > 0
            ? positionX - delta.width / 2
            : 0;
        });
        setPositionY(
          document.documentElement.clientHeight - height - DEFAULT_HEIGHT / 2
        );
        return height;
      });
      return width;
    });
  };

  const onDragStop = (e, d) => {
    setPositionX(
      d.x > 0
        ? d.x < window.parent.screen.width - width
          ? d.x
          : window.parent.screen.width - width
        : 0
    );
  };
  return (
    <>
      <Rnd
        style={style}
        dragAxis="x"
        minWidth="100px"
        minHeight="100px"
        // lockAspectRatio={true}
        onResizeStop={onResizeStop}
        onDragStop={onDragStop}
        position={{ x: positionX, y: positionY }}
        default={{
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
        }}
      >
        Rnd
      </Rnd>
    </>
  );
};

export default FooterTimer;
