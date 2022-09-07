import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PeopleIcon from "@material-ui/icons/People";
import "components/home/LabelBottomNavigation.css";
import React, { memo } from "react";
import { NUMBER_OF_LISTS_MAX } from "utils/constant";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    position: "fixed",
    left: 0,
    bottom: 0,
    paddingRight: "5rem",
  },
});

/**
 * ボトムナビゲーションのコンポーネントです。
 */
const LabelBottomNavigation = memo(
  (props: {
    bottomNavigationValue: string;
    setBottomNavigationValue: any;
    todoLists: any;
  }) => {
    const classes = useStyles();

    const handleChange = (event: any, newValue: string) => {
      props.setBottomNavigationValue(newValue);
    };
    /**
     * ToDoリストボタンがクリックされたときの処理です。
     * @param {*} index
     */
    const onListButtonClick = (index: number) => {
      if (index === 0) {
        document.getElementsByTagName("main")[0].scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        const todoListAndRoomWidth =
          // @ts-ignore
          document.getElementById("todoListAndRoom").children[0].clientWidth +
          // @ts-ignore
          document.getElementById("todoListAndRoom").children[1].clientWidth;
        const todoListLength = Object.values(props.todoLists).length;
        // リスト数が最大数以上のとき
        if (todoListLength >= NUMBER_OF_LISTS_MAX) {
          document.getElementsByTagName("main")[0].scrollTo({
            left:
              (todoListAndRoomWidth * index) / (todoListLength + 1) + index * 4,
            behavior: "smooth",
          });
        } else {
          // リスト数が最大数未満のとき
          document.getElementsByTagName("main")[0].scrollTo({
            left:
              (todoListAndRoomWidth * index) / (todoListLength + 1) - index * 8,
            behavior: "smooth",
          });
        }
      }
    };

    /**
     * ルームボタンがクリックされたときの処理です。
     */
    const onRoomButtonClick = () => {
      const todoListAndRoomWidth =
        // @ts-ignore
        document.getElementById("todoListAndRoom").children[0].clientWidth +
        // @ts-ignore
        document.getElementById("todoListAndRoom").children[1].clientWidth;
      document.getElementsByTagName("main")[0].scrollTo({
        left: todoListAndRoomWidth,
        behavior: "smooth",
      });
    };

    return (
      <BottomNavigation
        value={props.bottomNavigationValue}
        onChange={handleChange}
        className={classes.root}
      >
        {Object.values(props.todoLists).map((todoList, index) => {
          return (
            <BottomNavigationAction
              key={index}
              // @ts-ignore
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
  }
);

export default LabelBottomNavigation;
