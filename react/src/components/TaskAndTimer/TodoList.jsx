import React, { memo, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Chip,
  IconButton,
  makeStyles,
  Card,
  Tooltip,
  Typography,
  Snackbar,
  Button,
  useTheme,
} from "@material-ui/core";
import uuid from "uuid/v4";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import LinearDeterminate from "components/TaskAndTimer/LinearDeterminate";
import "components/TaskAndTimer/TodoList.css";
import { Context } from "contexts/Context";
import StopIcon from "@material-ui/icons/Stop";
import { secondToHHMMSS, taskItemsToBuildUp } from "utils/convert";
import TaskMenu from "./TaskMenu";
import ColumnMenu from "./TodoListMenu";
import TagsInput from "./TagsInput";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import {
  copyTasksToClipboard,
  copyTasksToClipboard_BuildUp,
  copyTasksToClipboard_ja,
} from "utils/export";
import AlarmIcon from "@material-ui/icons/Alarm";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import { SettingsContext } from "contexts/SettingsContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { NUMBER_OF_TASKS_MAX } from "utils/constant";
import TwitterIcon from "@material-ui/icons/Twitter";

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
    maxHeight: "calc(100vh - 13.5rem)",
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
const TodoList = memo((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [settings] = useContext(SettingsContext);
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(-1);
  const [previousColumns, setPreviousColumns] = useState({});
  const [undoSnackbarOpen, setUndoSnackbarOpen] = useState(false);
  const [undoSnackbarMessage, setUndoSnackbarMessage] = useState("");
  const [simpleSnackbarOpen, setSimpleSnackbarOpen] = useState(false);
  const [simpleSnackbarMessage, setSimpleSnackbarMessage] = useState("");
  const [addListTooltipPosition, setAddListTooltipPosition] = useState({
    x: undefined,
    y: undefined,
  });

  /**
   * ドラッグが終わったときの処理です。
   * @param {*} result
   * @param {*} columns
   * @param {*} props.setColumns
   * @returns
   */
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // 違うカラムに移動したとき
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
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
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      setColumns(newColumns);
      localStorage.setItem("columns", JSON.stringify(newColumns));
    } else {
      // 同じカラムでの移動だったとき
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns(newColumns);
      localStorage.setItem("columns", JSON.stringify(newColumns));
    }
  };

  /**
   * タスクがクリックされたときの処理です。
   */
  const onItemClick = (event, columnIndex, taskIndex) => {
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
      props.setColumns((columns) => {
        // クリックされたタスクだけisSelectedをtrueにする
        Object.values(columns).map((column, columnI) => {
          column.items.map((item, itemI) => {
            if (columnI === columnIndex && itemI === taskIndex) {
              item.isSelected = true;
            } else {
              item.isSelected = false;
            }
            return item;
          });
          return column;
        });
        localStorage.setItem("columns", JSON.stringify({ ...columns }));
        return { ...columns };
      });
    }
  };

  /**
   * 取り消しボタンがクリックされたときの処理です。
   */
  const onUndoButtonClick = () => {
    if (Object.values(previousColumns).length > 0) {
      setPreviousColumns((previousColumns) => {
        props.setColumns((columns) => {
          const newColumns = { ...previousColumns };
          localStorage.setItem("columns", JSON.stringify(newColumns));
          return newColumns;
        });
      });
      setPreviousColumns({});
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
  const onClipboardButtonClick = (index) => {
    if (
      settings.timeFormatToClipboard === "HH時間MM分SS秒" &&
      copyTasksToClipboard_ja(Object.values(props.columns)[index].items)
    ) {
      setSimpleSnackbarMessage("タスクをコピーしました！");
      setSimpleSnackbarOpen(true);
    } else if (
      settings.timeFormatToClipboard === "BuildUp" &&
      copyTasksToClipboard_BuildUp(Object.values(props.columns)[index].items)
    ) {
      setSimpleSnackbarMessage("タスクをコピーしました！");
      setSimpleSnackbarOpen(true);
    } else if (
      copyTasksToClipboard(Object.values(props.columns)[index].items)
    ) {
      setSimpleSnackbarMessage("タスクをコピーしました！");
      setSimpleSnackbarOpen(true);
    }
  };

  /**
   * アラームアイコンがクリックされたときの処理です。
   */
  const onAlarmIconClick = (columnIndex, taskIndex) => {
    if (
      Object.values(props.columns)[columnIndex].items[taskIndex].spentSecond <
      Object.values(props.columns)[columnIndex].items[taskIndex].estimatedSecond
    ) {
      props.setColumns((columns) => {
        Object.values(columns)[columnIndex].items[taskIndex].achievedThenStop =
          !Object.values(columns)[columnIndex].items[taskIndex]
            .achievedThenStop;
        localStorage.setItem("columns", JSON.stringify(columns));
        return { ...columns };
      });
    }
  };

  /**
   * ToDoリストを追加するボタンがクリックされたときの処理です。
   */
  const onAddListButtonClick = () => {
    props.setColumns((columns) => {
      return {
        ...columns,
        [uuid()]: {
          name: "リスト" + (Object.keys(columns).length + 1),
          items: [],
        },
      };
    });
  };

  /**
   * ツイートボタンがクリックされたときの処理です。
   */
  const onTweetButtonClick = (index) => {
    console.log(settings.tweetTemplate);
    let url =
      "https://twitter.com/intent/tweet?text=" +
      taskItemsToBuildUp(Object.values(props.columns)[index].items).replaceAll(
        "\r\n",
        "%0A"
      ) +
      "%0A%0A" +
      settings.tweetTemplate.replaceAll("#", "%23");
    window.open(url);
  };

  return (
    <div className={classes.root}>
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(result, props.columns, props.setColumns)
        }
      >
        {Object.entries(props.columns).map(
          ([columnId, column], columnIndex) => {
            return (
              <div className={classes.column} key={columnId}>
                {/* ToDoリストのヘッダー */}
                <div
                  style={{
                    backgroundColor:
                      column.items.filter((item) => {
                        return item.isSelected;
                      }).length > 0
                        ? theme.palette.type === "light"
                          ? "#ebecf0"
                          : "#525252"
                        : theme.palette.type === "light"
                        ? "#fafafa"
                        : "#323232",
                    padding: 4,
                    width: "100%",
                    marginBottom: "-0.2rem",
                    borderRadius: "4px",
                    boxShadow:
                      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: "1", marginLeft: "0.5rem" }}>
                      <Typography>{column.name}</Typography>
                    </div>
                    {settings.isTweetButtonEnabled && (
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
                      title="タスクをクリップボードにコピー"
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
                    {/* カラムメニュー */}
                    <ColumnMenu
                      index={columnIndex}
                      columns={props.columns}
                      column={column}
                      setColumns={props.setColumns}
                      setPreviousColumns={setPreviousColumns}
                      setUndoSnackbarOpen={setUndoSnackbarOpen}
                      setUndoSnackbarMessage={setUndoSnackbarMessage}
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
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : column.items.filter((item) => {
                                return item.isSelected;
                              }).length > 0
                            ? "#ebecf0"
                            : "#fafafa",
                        }}
                        className={classes.columnCard}
                      >
                        {/* タスクカード */}
                        {column.items.map((item, index) => {
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
                                        state.isTimerOn &&
                                        (!settings.isPomodoroEnabled ||
                                          state.pomodoroTimerType !== "break")
                                          ? theme.palette.primary.main
                                          : snapshot.isDragging
                                          ? theme.palette.type === "light"
                                            ? "#F8F8F8"
                                            : "#2F2F2F"
                                          : theme.palette.type === "light"
                                          ? "#FFF"
                                          : "#1F1F1F",
                                      color:
                                        item.isSelected &&
                                        state.isTimerOn &&
                                        (!settings.isPomodoroEnabled ||
                                          state.pomodoroTimerType !== "break")
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
                                          visibility: item.isSelected
                                            ? ""
                                            : "hidden",
                                        }}
                                        onClick={() =>
                                          props.onPlayButtonClick("task")
                                        }
                                      >
                                        {/* タイマーがオフのときは再生アイコン */}
                                        {!state.isTimerOn && <PlayArrowIcon />}
                                        {/* 停止アイコン */}
                                        {(!settings.isPomodoroEnabled ||
                                          state.pomodoroTimerType !==
                                            "break") &&
                                          state.isTimerOn && <StopIcon />}
                                        {/* コーヒーアイコン */}
                                        {settings.isPomodoroEnabled &&
                                          state.pomodoroTimerType === "break" &&
                                          state.isTimerOn && (
                                            <FreeBreakfastOutlinedIcon />
                                          )}
                                      </IconButton>
                                      {/* </BootstrapTooltip> */}
                                      <div style={{ flexGrow: "1" }}>
                                        <div style={{ marginBottom: "0.2rem" }}>
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
                                                  backgroundColor: "#ebecf0",
                                                }}
                                              />
                                            </Tooltip>
                                          )}
                                          {item.content}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "0.75rem",
                                            marginTop: "0.5rem",
                                            marginBottom: "-0.2rem",
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
                                                margin: "0 0.2rem",
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
                                        columns={props.columns}
                                        setColumns={props.setColumns}
                                        setPreviousColumns={setPreviousColumns}
                                        setUndoSnackbarOpen={
                                          setUndoSnackbarOpen
                                        }
                                        setUndoSnackbarMessage={
                                          setUndoSnackbarMessage
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
                      column.items.filter((item) => {
                        return item.isSelected;
                      }).length > 0
                        ? theme.palette.type === "light"
                          ? "#ebecf0"
                          : "#626262"
                        : theme.palette.type === "light"
                        ? "#fafafa"
                        : "#303030",
                    width: "100%",
                    marginTop: "-2px",
                    paddingLeft: "0.5rem",
                    borderRadius: "4px",
                    boxShadow:
                      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                  }}
                >
                  <TagsInput
                    fullWidth
                    variant="outlined"
                    name="tags"
                    size="small"
                    placeholder="タスクを追加"
                    isTagsInputFocused={isTagsInputFocused}
                    setIsTagsInputFocused={setIsTagsInputFocused}
                    columns={props.columns}
                    setColumns={props.setColumns}
                    index={columnIndex}
                    style={{
                      width: "105%",
                      marginTop: "0.25rem",
                      marginLeft: "0.2rem",
                      backgroundColor:
                        isTagsInputFocused === columnIndex
                          ? theme.palette.type === "light"
                            ? "white"
                            : "black"
                          : column.items.filter((item) => {
                              return item.isSelected;
                            }).length > 0
                          ? theme.palette.type === "light"
                            ? "#ebecf0"
                            : "#626262"
                          : theme.palette.type === "light"
                          ? "#fafafa"
                          : "#303030",
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
      {Object.keys(props.columns).length < 4 && (
        <Tooltip
          title="ToDoリストを追加"
          onMouseMove={(e) =>
            setAddListTooltipPosition({ x: e.pageX, y: e.pageY + 10 })
          }
          PopperProps={{
            anchorEl: {
              clientHeight: 0,
              clientWidth: 0,
              getBoundingClientRect: () => ({
                top: addListTooltipPosition.y,
                left: addListTooltipPosition.x,
                right: addListTooltipPosition.x,
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
});

export default TodoList;
