import React, { memo, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Chip,
  IconButton,
  makeStyles,
  Card,
  Tooltip,
  Typography,
  Divider,
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
import { secondToHHMMSS, taskItemsToReport } from "utils/convert";
import TaskMenu from "./TaskMenu";
import ColumnMenu from "./ColumnMenu";
import TagsInput from "./TagsInput";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { copyTasksToClipboard } from "utils/export";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import AlarmIcon from "@material-ui/icons/Alarm";
import FreeBreakfastOutlinedIcon from "@material-ui/icons/FreeBreakfastOutlined";
import { SettingsContext } from "contexts/SettingsContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

/** タイマー再生ボタンにカーソルが合っているかどうか */
let isPlayButtonFocused = false;

/** 最後にマウスが動いた時刻 */
let lastMouseMoved = Date.now();
let playArrowIconTooltipOpenTimeout = null;

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

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
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

/** Bootstrap風ツールチップのスタイル */
const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    top: "-1rem",
  },
}));

/**
 * Bootstrap風ツールチップのコンポーネントです。
 */
function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

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
    maxHeight: "70vh",
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
  const [playArrowIconTooltipOpen, setPlayArrowIconTooltipOpen] =
    useState(false);
  const location = useLocation();

  /**
   * 再生アイコンのツールチップを扱います。
   */
  const handlePlayArrowIconTooltip = () => {
    if (
      location.pathname === "/" &&
      !state.isTimerOn &&
      Date.now() - lastMouseMoved > 4000
    ) {
      setPlayArrowIconTooltipOpen(true);
    } else {
      setTimeout(handlePlayArrowIconTooltip, 5000);
    }
  };

  // マウスが動いたとき
  window.addEventListener("mousemove", (e) => {
    handleOperation();
  });

  // タッチされたとき
  window.addEventListener("touchstart", () => {
    handleOperation();
  });

  // キーが押されたとき
  window.addEventListener("keypress", () => {
    handleOperation();
  });

  /**
   * 操作されたときの処理です。
   */
  const handleOperation = () => {
    lastMouseMoved = Date.now();
    if (isPlayButtonFocused) {
      if (!playArrowIconTooltipOpen) {
        setPlayArrowIconTooltipOpen(true);
      }
    } else {
      setPlayArrowIconTooltipOpen(false);
      clearTimeout(playArrowIconTooltipOpenTimeout);
      playArrowIconTooltipOpenTimeout = setTimeout(
        handlePlayArrowIconTooltip,
        5000
      );
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
    if (copyTasksToClipboard(Object.values(props.columns)[index].items)) {
      setSimpleSnackbarMessage("タスクをコピーしました！");
      setSimpleSnackbarOpen(true);
    }
  };

  /**
   * タスクから日報を作成するボタンがクリックされたときの処理です。
   */
  const onCreateReportButtonClick = (index) => {
    const report = taskItemsToReport(Object.values(props.columns)[index].items);
    setState({ ...state, waitingReport: report });
    setTimeout(() => {
      document.getElementById("linkToReports").click();
    }, 1);
  };

  /**
   * アラームアイコンがクリックされたときの処理です。
   */
  const onAlarmIconClick = (index) => {
    if (
      Object.values(props.columns)[0].items[index].spentSecond <
      Object.values(props.columns)[0].items[index].estimatedSecond
    ) {
      props.setColumns((columns) => {
        Object.values(columns)[0].items[index].achievedThenStop =
          !Object.values(columns)[0].items[index].achievedThenStop;
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
          name: "タスク" + (Object.keys(columns).length + 1),
          items: [],
        },
      };
    });
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
                <div
                  style={{
                    backgroundColor: "#ebecf0",
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
                    <Tooltip title="タスクから日報を作成" placement="top">
                      <IconButton
                        disabled={state.isTimerOn}
                        size="small"
                        color="inherit"
                        onClick={() => {
                          onCreateReportButtonClick(columnIndex);
                        }}
                      >
                        <NoteAddOutlinedIcon />
                      </IconButton>
                    </Tooltip>
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
                      setColumns={props.setColumns}
                      setPreviousColumns={setPreviousColumns}
                      setUndoSnackbarOpen={setUndoSnackbarOpen}
                      setUndoSnackbarMessage={setUndoSnackbarMessage}
                    />
                  </div>
                  <Divider style={{ margin: "0.25rem 0" }} />
                </div>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <Card
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#ebecf0",
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
                                          ? "#ebecf0"
                                          : "#FFF",
                                      color:
                                        item.isSelected &&
                                        state.isTimerOn &&
                                        (!settings.isPomodoroEnabled ||
                                          state.pomodoroTimerType !== "break")
                                          ? "#FFF"
                                          : snapshot.isDragging
                                          ? "#000"
                                          : "#000",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={(event) =>
                                      onItemClick(event, columnIndex, index)
                                    }
                                  >
                                    <div style={{ display: "flex" }}>
                                      <BootstrapTooltip
                                        title="タイマーを開始"
                                        open={
                                          location.pathname === "/" &&
                                          playArrowIconTooltipOpen &&
                                          !state.isTimerOn &&
                                          item.isSelected &&
                                          (item.spentSecond === 0 ||
                                            isPlayButtonFocused)
                                        }
                                      >
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
                                          onMouseEnter={(e) => {
                                            isPlayButtonFocused = true;
                                          }}
                                          onMouseLeave={(e) => {
                                            isPlayButtonFocused = false;
                                          }}
                                        >
                                          {/* タイマーがオフのときは再生アイコン */}
                                          {!state.isTimerOn && (
                                            <PlayArrowIcon />
                                          )}
                                          {/* 停止アイコン */}
                                          {(!settings.isPomodoroEnabled ||
                                            state.pomodoroTimerType !==
                                              "break") &&
                                            state.isTimerOn && <StopIcon />}
                                          {/* コーヒーアイコン */}
                                          {settings.isPomodoroEnabled &&
                                            state.pomodoroTimerType ===
                                              "break" &&
                                            state.isTimerOn && (
                                              <FreeBreakfastOutlinedIcon />
                                            )}
                                        </IconButton>
                                      </BootstrapTooltip>
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
                                                  onAlarmIconClick(index)
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
                                            ? "primary"
                                            : "secondary"
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
                    backgroundColor: "#ebecf0",
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
                          ? "white"
                          : "#ebecf0",
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
        <Tooltip id="addListTooltip" title="ToDoリストを追加" placement="top">
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
