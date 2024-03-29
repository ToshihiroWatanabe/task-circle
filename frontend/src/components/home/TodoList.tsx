import {
  Button,
  Card,
  Chip,
  IconButton,
  makeStyles,
  Snackbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AlarmIcon from "@material-ui/icons/Alarm";
import AlarmOffIcon from "@material-ui/icons/AlarmOff";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import CloseIcon from "@material-ui/icons/Close";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinearDeterminate from "components/home/LinearDeterminate";
import TaskAddInput from "components/home/TaskAddInput";
import TaskMenu from "components/home/TaskMenu";
import "components/home/TodoList.css";
import TodoListMenu from "components/home/TodoListMenu";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { NUMBER_OF_LISTS_MAX, NUMBER_OF_TASKS_MAX } from "utils/constant";
import { secondToHHMMSS, taskItemsToBuildUp } from "utils/convert";
import {
  copyTasksToClipboard,
  copyTasksToClipboard_BuildUp,
  copyTasksToClipboard_ja,
} from "utils/export";
// @ts-ignore
import uuid from "uuid/v4";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 8,
    width: 320,
    [theme.breakpoints.down("xs")]: {
      width: "calc(100vw - 2rem)",
      maxWidth: "600px",
    },
  },
  columnCard: {
    padding: 4,
    width: "100%",
    maxHeight: "calc(100vh - 14.5rem)",
    overflow: "auto",
  },
  taskCard: {
    userSelect: "none",
    padding: 16,
    margin: "0 0 8px 0",
    minHeight: "50px",
    color: "white",
  },
}));

/**
 * ToDoリストのコンポーネントです。
 */
const TodoList = memo(
  (props: {
    updateTodoLists: any;
    sendMessage: any;
    onPlayButtonClick: any;
  }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { globalState, setGlobalState } = useContext(GlobalStateContext);
    const [isInputFocused, setIsInputFocused] = useState(-1);
    const [previousTodoLists, setPreviousTodoLists] = useState({});
    const [undoSnackbarOpen, setUndoSnackbarOpen] = useState(false);
    const [undoSnackbarMessage, setUndoSnackbarMessage] = useState("");
    const [simpleSnackbarOpen, setSimpleSnackbarOpen] = useState(false);
    const [simpleSnackbarMessage, setSimpleSnackbarMessage] = useState("");
    const [addListTooltipPosition, setAddListTooltipPosition] = useState({
      x: undefined,
      y: undefined,
    });
    const useMediaQueryThemeBreakpointsDownXs = useMediaQuery(
      theme.breakpoints.down("xs")
    );

    /**
     * ドラッグが終わったときの処理です。
     * @param {*} result
     * @param {*} todoLists
     * @param {*} props.setTodoLists
     * @returns
     */
    const onDragEnd = (result: any, todoLists: any, setTodoLists: any) => {
      if (!result.destination) return;
      const { source, destination } = result;

      // 違うカラムに移動したとき
      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = todoLists[source.droppableId];
        const destColumn = todoLists[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        // 移動先のタスク数が最大数を超えていた場合
        if (destItems.length > NUMBER_OF_TASKS_MAX) {
          setSimpleSnackbarMessage(
            destColumn.name + "にはこれ以上タスクを増やせません"
          );
          setSimpleSnackbarOpen(true);
          return;
        }
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        const newTodoLists = {
          ...todoLists,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        };
        setGlobalState((globalState: any) => {
          return { ...globalState, todoLists: newTodoLists };
        });
        props.updateTodoLists(newTodoLists);
      } else {
        // 同じカラムでの移動だったとき
        const column = todoLists[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        const newTodoLists = {
          ...todoLists,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        };
        setGlobalState((globalState: any) => {
          return { ...globalState, todoLists: newTodoLists };
        });
        props.updateTodoLists(newTodoLists);
      }
    };

    /**
     * タスクがクリックされたときの処理です。
     */
    const onItemClick = (
      event: any,
      columnIndex: number,
      taskIndex: number
    ) => {
      if (
        [
          event.target.id,
          event.target.parentNode.id,
          event.target.parentNode.parentNode.id,
          event.target.parentNode.parentNode.parentNode.id,
        ].includes("taskCard") &&
        ["DIV", "SPAN"].includes(event.target.tagName) &&
        event.target.style.backgroundColor !== "transparent" &&
        event.target.className !== "MuiIconButton-label" &&
        !["決定", "キャンセル"].includes(event.target.innerText) &&
        event.target.style.opacity !== "0"
      ) {
        setGlobalState((globalState: any) => {
          // クリックされたタスクだけisSelectedをtrueにする
          Object.values(globalState.todoLists).map(
            (column: any, columnI: number) => {
              column.items.map((item: any, itemI: number) => {
                if (columnI === columnIndex && itemI === taskIndex) {
                  item.isSelected = true;
                } else {
                  item.isSelected = false;
                }
                return item;
              });
              return column;
            }
          );
          props.updateTodoLists({ ...globalState.todoLists });
          return { ...globalState };
        });
        if (
          globalState.isConnected &&
          globalState.isInRoom &&
          globalState.isTimerOn
        ) {
          props.sendMessage();
        }
      }
    };

    /**
     * 取り消しボタンがクリックされたときの処理です。
     */
    const onUndoButtonClick = () => {
      if (Object.values(previousTodoLists).length > 0) {
        setPreviousTodoLists((previousTodoLists) => {
          setGlobalState((globalState: any) => {
            const newTodoLists = { ...previousTodoLists };
            props.updateTodoLists(newTodoLists);
            return { ...globalState, todoLists: newTodoLists };
          });
        });
        setPreviousTodoLists({});
        setSimpleSnackbarMessage("操作を元に戻しました");
      } else {
        setSimpleSnackbarMessage("操作を元に戻せませんでした");
      }
      setUndoSnackbarOpen(false);
      setSimpleSnackbarOpen(true);
    };

    /**
     * クリップボードボタンがクリックされたときの処理です。
     */
    const onClipboardButtonClick = (index: number) => {
      if (
        globalState.settings.timeFormatToClipboard === "HH時間MM分SS秒" &&
        // @ts-ignore
        copyTasksToClipboard_ja(
          // @ts-ignore
          Object.values(globalState.todoLists)[index].items
        )
      ) {
        setSimpleSnackbarMessage("タスクをコピーしました！");
        setSimpleSnackbarOpen(true);
      } else if (
        globalState.settings.timeFormatToClipboard === "BuildUp" &&
        copyTasksToClipboard_BuildUp(
          // @ts-ignore
          Object.values(globalState.todoLists)[index].items
        )
      ) {
        setSimpleSnackbarMessage("タスクをコピーしました！");
        setSimpleSnackbarOpen(true);
      } else if (
        // @ts-ignore
        copyTasksToClipboard(Object.values(globalState.todoLists)[index].items)
      ) {
        setSimpleSnackbarMessage("タスクをコピーしました！");
        setSimpleSnackbarOpen(true);
      }
    };

    /**
     * アラームアイコンがクリックされたときの処理です。
     */
    const onAlarmIconClick = (columnIndex: number, taskIndex: number) => {
      if (
        // @ts-ignore
        Object.values(globalState.todoLists)[columnIndex].items[taskIndex]
          .spentSecond <
        // @ts-ignore
        Object.values(globalState.todoLists)[columnIndex].items[taskIndex]
          .estimatedSecond
      ) {
        setGlobalState((globalState: any) => {
          // @ts-ignore
          Object.values(globalState.todoLists)[columnIndex].items[
            taskIndex
          ].achievedThenStop =
            // @ts-ignore
            !Object.values(globalState.todoLists)[columnIndex].items[taskIndex]
              .achievedThenStop;
          props.updateTodoLists(globalState.todoLists);
          return { ...globalState };
        });
      }
    };

    /**
     * ToDoリストを追加するボタンがクリックされたときの処理です。
     */
    const onAddListButtonClick = () => {
      setGlobalState((globalState: any) => {
        const newTodoLists = {
          ...globalState.todoLists,
          [uuid()]: {
            name: "リスト" + (Object.keys(globalState.todoLists).length + 1),
            items: [],
          },
        };
        props.updateTodoLists(newTodoLists);
        return { ...globalState, todoLists: newTodoLists };
      });
    };

    /**
     * ツイートボタンがクリックされたときの処理です。
     */
    const onTweetButtonClick = (index: number) => {
      const url =
        "https://twitter.com/intent/tweet?text=" +
        taskItemsToBuildUp(
          // @ts-ignore
          Object.values(globalState.todoLists)[index].items
        ).replaceAll("\r\n", "%0A") +
        "%0A%0A" +
        globalState.settings.tweetTemplate.replaceAll("#", "%23");
      window.open(url);
    };

    return (
      <div className={classes.root}>
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, globalState.todoLists, globalState.setTodoLists)
          }
        >
          {Object.entries(globalState.todoLists).map(
            // @ts-ignore
            ([columnId, column], columnIndex: number) => {
              return (
                <div className={classes.column} key={columnId}>
                  {/* ToDoリストのヘッダー */}
                  <div
                    style={{
                      color: theme.palette.type === "light" ? "black" : "white",
                      backgroundColor:
                        // @ts-ignore
                        column.items.filter((item: any) => {
                          return item.isSelected;
                        }).length > 0
                          ? theme.palette.type === "light"
                            ? "#ebecf0"
                            : "#424242"
                          : theme.palette.type === "light"
                          ? "#fafafa"
                          : "#555",
                      padding: 4,
                      width: "100%",
                      marginBottom: "-0.2rem",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* @ts-ignore */}
                      <div style={{ flexGrow: "1", marginLeft: "0.5rem" }}>
                        {/* @ts-ignore */}
                        <Typography>{column.name}</Typography>
                      </div>
                      {globalState.settings.isTweetButtonEnabled && (
                        <Tooltip title="ツイートする" placement="top">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onTweetButtonClick(columnIndex)}
                          >
                            <TwitterIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip
                        // @ts-ignore
                        title={column.name + "をクリップボードにコピー"}
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => {
                            onClipboardButtonClick(columnIndex);
                          }}
                        >
                          <AssignmentOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      {/* Todoリストメニュー */}
                      <TodoListMenu
                        index={columnIndex}
                        column={column}
                        setPreviousTodoLists={setPreviousTodoLists}
                        setUndoSnackbarOpen={setUndoSnackbarOpen}
                        setUndoSnackbarMessage={setUndoSnackbarMessage}
                        updateTodoLists={props.updateTodoLists}
                      />
                    </div>
                  </div>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <Card
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            paddingTop: "0.5rem",
                            borderRadius: 0,
                            background: snapshot.isDraggingOver
                              ? theme.palette.type === "light"
                                ? "lightblue"
                                : theme.palette.primary.dark
                              : //@ts-ignore
                              column.items.filter((item: any) => {
                                  return item.isSelected;
                                }).length > 0
                              ? theme.palette.type === "light"
                                ? "#ebecf0"
                                : "#666"
                              : theme.palette.type === "light"
                              ? "#fafafa"
                              : "#666",
                          }}
                          className={classes.columnCard}
                        >
                          {/* タスクカード */}
                          {/* @ts-ignore */}
                          {column.items.map((item: any, index: number) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Card
                                      id="taskCard"
                                      color="primary"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={classes.taskCard}
                                      style={{
                                        backgroundColor:
                                          item.isSelected &&
                                          globalState.isTimerOn &&
                                          (!globalState.settings
                                            .isPomodoroEnabled ||
                                            globalState.pomodoroTimerType !==
                                              "break")
                                            ? theme.palette.primary.main
                                            : snapshot.isDragging
                                            ? theme.palette.type === "light"
                                              ? "#F8F8F8"
                                              : "#555"
                                            : theme.palette.type === "light"
                                            ? "#FFF"
                                            : "#424242",
                                        color:
                                          item.isSelected &&
                                          globalState.isTimerOn &&
                                          (!globalState.settings
                                            .isPomodoroEnabled ||
                                            globalState.pomodoroTimerType !==
                                              "break")
                                            ? "#FFF"
                                            : snapshot.isDragging
                                            ? theme.palette.type === "light"
                                              ? "#000"
                                              : "#FFF"
                                            : theme.palette.type === "light"
                                            ? "#000"
                                            : "#FFF",
                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={(event) =>
                                        onItemClick(event, columnIndex, index)
                                      }
                                    >
                                      <div style={{ display: "flex" }}>
                                        <IconButton
                                          size="small"
                                          color="inherit"
                                          style={{
                                            marginLeft: "-0.75rem",
                                            marginRight: "0.25rem",
                                            // @ts-ignore
                                            visibility: item.isSelected
                                              ? ""
                                              : "hidden",
                                          }}
                                          onClick={() =>
                                            props.onPlayButtonClick("task")
                                          }
                                        >
                                          {/* タイマーがオフのときは再生アイコン */}
                                          {!globalState.isTimerOn && (
                                            <PlayArrowIcon />
                                          )}
                                          {/* 停止アイコン */}
                                          {(!globalState.settings
                                            .isPomodoroEnabled ||
                                            globalState.pomodoroTimerType !==
                                              "break") &&
                                            globalState.isTimerOn && (
                                              <StopIcon />
                                            )}
                                          {/* コーヒーアイコン */}
                                          {globalState.settings
                                            .isPomodoroEnabled &&
                                            globalState.pomodoroTimerType ===
                                              "break" &&
                                            globalState.isTimerOn && (
                                              <FreeBreakfastOutlinedIcon />
                                            )}
                                        </IconButton>
                                        {/* タスク名と経過時間エリア */}
                                        <div
                                          style={{
                                            // @ts-ignore
                                            flexGrow: "1",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                          }}
                                        >
                                          <div>
                                            {item.category !== "" && (
                                              <Tooltip
                                                title={item.category}
                                                placement="top"
                                              >
                                                <Chip
                                                  label={item.category}
                                                  size="small"
                                                  style={{
                                                    marginTop: "-0.2rem",
                                                    marginRight: "0.3rem",
                                                    paddingBottom: "0.1rem",
                                                    fontSize: "0.75rem",
                                                    height: "1.2rem",
                                                    maxWidth: "4rem",
                                                    backgroundColor:
                                                      theme.palette.type ===
                                                      "light"
                                                        ? "#ebecf0"
                                                        : "#555",
                                                  }}
                                                />
                                              </Tooltip>
                                            )}
                                            {item.content}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: "0.8rem",
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {secondToHHMMSS(item.spentSecond)}
                                            {item.estimatedSecond !== 0 && (
                                              <span
                                                style={{
                                                  color: item.achievedThenStop
                                                    ? ""
                                                    : "#BBB",
                                                  margin: "0 0.3rem",
                                                }}
                                              >
                                                {" / "}
                                                {secondToHHMMSS(
                                                  item.estimatedSecond
                                                )}
                                              </span>
                                            )}
                                            {item.estimatedSecond >
                                              item.spentSecond && (
                                              <Tooltip title="目標時間のアラーム">
                                                <IconButton
                                                  size="small"
                                                  style={{
                                                    color: item.achievedThenStop
                                                      ? "inherit"
                                                      : "#BBB",
                                                    marginTop: "-3px",
                                                    marginBottom: "-3px",
                                                  }}
                                                  onClick={() =>
                                                    onAlarmIconClick(
                                                      columnIndex,
                                                      index
                                                    )
                                                  }
                                                >
                                                  <AlarmIcon
                                                    style={{
                                                      display:
                                                        item.achievedThenStop
                                                          ? ""
                                                          : "none",
                                                      pointerEvents: "none",
                                                    }}
                                                  />
                                                  <AlarmOffIcon
                                                    style={{
                                                      display:
                                                        item.achievedThenStop
                                                          ? "none"
                                                          : "",
                                                      pointerEvents: "none",
                                                    }}
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            )}
                                          </div>
                                        </div>
                                        {/* タスクメニュー */}
                                        <TaskMenu
                                          index={index}
                                          columnIndex={columnIndex}
                                          setPreviousTodoLists={
                                            setPreviousTodoLists
                                          }
                                          setUndoSnackbarOpen={
                                            setUndoSnackbarOpen
                                          }
                                          setUndoSnackbarMessage={
                                            setUndoSnackbarMessage
                                          }
                                          sendMessage={props.sendMessage}
                                          updateTodoLists={
                                            props.updateTodoLists
                                          }
                                        />
                                      </div>
                                      {item.estimatedSecond > 0 && (
                                        <LinearDeterminate
                                          progress={
                                            (item.spentSecond /
                                              item.estimatedSecond) *
                                            100
                                          }
                                          color={
                                            item.spentSecond <
                                            item.estimatedSecond
                                              ? "secondary"
                                              : "primary"
                                          }
                                          thickness={5}
                                        />
                                      )}
                                    </Card>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Card>
                      );
                    }}
                  </Droppable>
                  {/* タスク追加の入力欄 */}
                  <div
                    id="addInputArea"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor:
                        // @ts-ignore
                        column.items.filter((item: any) => {
                          return item.isSelected;
                        }).length > 0
                          ? theme.palette.type === "light"
                            ? "#ebecf0"
                            : "#424242"
                          : theme.palette.type === "light"
                          ? "#fafafa"
                          : "#555",
                      width: "100%",
                      marginTop: "-2px",
                      paddingLeft: "0.5rem",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                    }}
                  >
                    <TaskAddInput
                      updateTodoLists={props.updateTodoLists}
                      setIsInputFocused={setIsInputFocused}
                      index={columnIndex}
                      style={{
                        width: "105%",
                        marginTop: "0.25rem",
                        marginLeft: "0.2rem",
                        backgroundColor:
                          isInputFocused === columnIndex
                            ? theme.palette.type === "light"
                              ? "white"
                              : "#424242"
                            : // @ts-ignore
                            column.items.filter((item: any) => {
                                return item.isSelected;
                              }).length > 0
                            ? theme.palette.type === "light"
                              ? "#ebecf0"
                              : "#424242"
                            : theme.palette.type === "light"
                            ? "#fafafa"
                            : "#555",
                        borderRadius: "4px",
                        height: "2.5rem",
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </DragDropContext>
        {/* ToDoリストを追加 */}
        {/* @ts-ignore */}
        {Object.keys(globalState.todoLists).length < NUMBER_OF_LISTS_MAX && (
          <Tooltip
            title="ToDoリストを追加"
            onMouseMove={(e) =>
              // @ts-ignore
              setAddListTooltipPosition({ x: e.pageX, y: e.pageY + 10 })
            }
            PopperProps={{
              anchorEl: {
                clientHeight: 0,
                clientWidth: 0,
                // @ts-ignore
                getBoundingClientRect: () => ({
                  // @ts-ignore
                  top: addListTooltipPosition.y,
                  // @ts-ignore
                  left: addListTooltipPosition.x,
                  // @ts-ignore
                  right: addListTooltipPosition.x,
                  // @ts-ignore
                  bottom: addListTooltipPosition.y,
                  width: 0,
                  height: 0,
                }),
              },
            }}
          >
            <IconButton onClick={onAddListButtonClick}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
        <Snackbar
          open={undoSnackbarOpen}
          onClose={() => setUndoSnackbarOpen(false)}
          autoHideDuration={6000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          style={{ bottom: useMediaQueryThemeBreakpointsDownXs ? "5rem" : "" }}
          message={undoSnackbarMessage}
          action={
            <>
              <Button
                size="small"
                style={{ color: "skyblue" }}
                onClick={() => onUndoButtonClick()}
              >
                取消
              </Button>
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  setUndoSnackbarOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Snackbar
          open={simpleSnackbarOpen}
          onClose={() => setSimpleSnackbarOpen(false)}
          autoHideDuration={6000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          style={{ bottom: useMediaQueryThemeBreakpointsDownXs ? "5rem" : "" }}
          message={simpleSnackbarMessage}
          action={
            <>
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  setSimpleSnackbarOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Link to="/reports" id="linkToReports" />
      </div>
    );
  }
);

export default TodoList;
