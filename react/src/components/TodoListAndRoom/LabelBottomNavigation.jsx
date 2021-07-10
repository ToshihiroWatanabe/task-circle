import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "components/TodoListAndRoom/LabelBottomNavigation.css";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PeopleIcon from "@material-ui/icons/People";
import { NUMBER_OF_LISTS_MAX } from "utils/constant";
import { StateContext } from "contexts/StateContext";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    position: "fixed",
    bottom: "0",
    paddingRight: "5rem",
  },
});

/**
 * ボトムナビゲーションのコンポーネントです。
 */
const LabelBottomNavigation = (props) => {
  const classes = useStyles();
  const [state, setState] = useContext(StateContext);

  useEffect(() => {
    // スクロールイベントリスナーを追加
    // document.getElementsByTagName("main")[0].addEventListener("scroll", () => {
    //   onScroll();
    // });
  }, []);

  const onScroll = () => {
    // const scrollWidth = document.body.scrollWidth;
    // console.log(scrollWidth);
    // const todoListAndRoomWidth =
    //   document.getElementById("todoListAndRoom").children[0].clientWidth +
    //   document.getElementById("todoListAndRoom").children[1].clientWidth;
    // const todoListLength = Object.values(props.todoLists).length;
    // const scrollLeft = document.getElementsByTagName("main")[0].scrollLeft;
    // console.log(Object.values(props.todoLists).length + 1);
    // console.log(todoListAndRoomWidth / (todoListLength + 1));
    // console.log(scrollLeft);
    // if (
    //   scrollLeft <
    //   todoListAndRoomWidth / (todoListLength + 1) - scrollWidth / 2
    // ) {
    //   setValue("list1");
    // }
  };

  const handleChange = (event, newValue) => {
    setState({ ...state, bottomNavigationValue: newValue });
  };

  /**
   * ToDoリストボタンがクリックされたときの処理です。
   * @param {*} index
   */
  const onListButtonClick = (index) => {
    if (index === 0) {
      document.getElementsByTagName("main")[0].scrollLeft = 0;
    } else {
      const todoListAndRoomWidth =
        document.getElementById("todoListAndRoom").children[0].clientWidth +
        document.getElementById("todoListAndRoom").children[1].clientWidth;
      const todoListLength = Object.values(props.todoLists).length;
      // リスト数が最大数以上のとき
      if (todoListLength >= NUMBER_OF_LISTS_MAX) {
        document.getElementsByTagName("main")[0].scrollLeft =
          (todoListAndRoomWidth * index) / (todoListLength + 1) + index * 4;
      } else {
        // リスト数が最大数未満のとき
        document.getElementsByTagName("main")[0].scrollLeft =
          (todoListAndRoomWidth * index) / (todoListLength + 1) - index * 8;
      }
    }
  };

  /**
   * ルームボタンがクリックされたときの処理です。
   */
  const onRoomButtonClick = () => {
    const todoListAndRoomWidth =
      document.getElementById("todoListAndRoom").children[0].clientWidth +
      document.getElementById("todoListAndRoom").children[1].clientWidth;
    document.getElementsByTagName("main")[0].scrollLeft = todoListAndRoomWidth;
  };

  return (
    <BottomNavigation
      value={state.bottomNavigationValue}
      onChange={handleChange}
      className={classes.root}
    >
      {Object.values(props.todoLists).map((todoList, index) => {
        return (
          <BottomNavigationAction
            key={index}
            label={todoList.name}
            value={"list" + (index + 1)}
            icon={<ListAltIcon />}
            onClick={() => {
              onListButtonClick(index);
            }}
          />
        );
      })}
      <BottomNavigationAction
        label="ルーム"
        value="room"
        icon={<PeopleIcon />}
        onClick={() => {
          onRoomButtonClick();
        }}
      />
    </BottomNavigation>
  );
};

export default LabelBottomNavigation;
