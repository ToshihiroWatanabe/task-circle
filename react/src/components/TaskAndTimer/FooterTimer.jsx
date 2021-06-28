import { Context } from "contexts/Context";
import { useContext, useState } from "react";
import { Rnd } from "react-rnd";

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 144;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 48;

/**
 * フッタータイマーのコンポーネントです。
 */
const FooterTimer = (props) => {
  const [positionX, setPositionX] = useState(
    document.documentElement.clientWidth / 2 - DEFAULT_WIDTH / 2
  );
  const [positionY, setPositionY] = useState(
    document.documentElement.clientHeight - DEFAULT_HEIGHT - DEFAULT_HEIGHT / 2
  );
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
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
    console.log(width);
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
      <Rnd
        dragAxis="x"
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        maxWidth={window.innerWidth * 0.9}
        maxHeight={window.innerHeight * 0.9}
        // lockAspectRatio={true}
        onResizeStop={onResizeStop}
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
          borderRadius: "4px",
          background: "#f0f0f0",
          zIndex: "9999",
        }}
      >
        {Object.values(props.columns)
          .filter((column, index) => {
            return (
              column.items.filter((item, index) => {
                return item.isSelected;
              })[0] !== undefined
            );
          })[0]
          .items.filter((item, index) => {
            return item.isSelected;
          }).length > 0
          ? Object.values(props.columns)
              .filter((column, index) => {
                return (
                  column.items.filter((item, index) => {
                    return item.isSelected;
                  })[0] !== undefined
                );
              })[0]
              .items.filter((item, index) => {
                return item.isSelected;
              })[0].content
          : ""}
      </Rnd>
    </>
  );
};

export default FooterTimer;
