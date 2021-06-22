import React, { useContext, useState } from "react";
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
import startedAudio from "audio/notification_simple-01.mp3";
import stoppedAudio from "audio/notification_simple-02.mp3";
import tickAudio from "audio/tick.mp3";
import achievedAudio from "audio/sound02.mp3";
import TaskMenu from "./TaskMenu";
import ColumnMenu from "./ColumnMenu";
import AddIcon from "@material-ui/icons/Add";
import TagsInput from "./TagsInput";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { copyTasksToClipboard } from "utils/export";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { Link } from "react-router-dom";
import AlarmIcon from "@material-ui/icons/Alarm";

/** タスクの最大数 */
const NUMBER_OF_ITEMS_MAX = 32;

/** 一度にカウントする秒数 */
const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
const COUNT_INTERVAL = 1000;
/** setTimeoutのID */
let timeoutId = null;

/** タイマーを開始した時刻 */
let startedAt = null;
/** 最後にカウントした時刻 */
let lastCountedAt = null;

/** デフォルトタイトル */
const defaultTitle = document.title;

/** タイマー開始の効果音 */
const startedSound = new Audio(startedAudio);
/** タイマー停止の効果音 */
const stoppedSound = new Audio(stoppedAudio);
/** タイマーのチクタク音 */
const tickSound = new Audio(tickAudio);
tickSound.volume = 1;
const achievedSound = new Audio(achievedAudio);

const itemsFrom = [
  {
    id: uuid(),
    category: "",
    content: "予習",
    spentSecond: 0,
    estimatedSecond: 3 * 60,
    isSelected: true,
    achievedThenStop: false,
  },
  {
    id: uuid(),
    category: "",
    content: "復習",
    spentSecond: 0,
    estimatedSecond: 3,
    isSelected: false,
    achievedThenStop: true,
  },
  {
    id: uuid(),
    category: "Java",
    content: "JUnitのテストコードを書く",
    spentSecond: 0,
    estimatedSecond: 15 * 60,
    isSelected: false,
    achievedThenStop: true,
  },
  {
    id: uuid(),
    category: "",
    content: "ふりかえり",
    spentSecond: 0,
    estimatedSecond: 60 * 60,
    isSelected: false,
    achievedThenStop: false,
  },
  {
    id: uuid(),
    category: "カテゴリ",
    content: "課題",
    spentSecond: 0,
    estimatedSecond: 60 * 60,
    isSelected: false,
    achievedThenStop: true,
  },
];

const columnsFrom = {
  [uuid()]: {
    name: "タスク",
    items: itemsFrom,
  },
};

/**
 * ドラッグが終わったときの処理です。
 * @param {*} result
 * @param {*} columns
 * @param {*} setColumns
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
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const useStyles = makeStyles((theme) => ({
  columnCard: {
    padding: 4,
    width: 320,
    maxHeight: "75vh",
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
const TodoList = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [columns, setColumns] = useState(columnsFrom);
  const [categoryInput, setCategoryInput] = useState([]);
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [helperText, setHelperText] = useState("");
  const [lastActivity, setLastActivity] = useState({});
  const [undoSnackbarOpen, setUndoSnackbarOpen] = useState(false);
  const [undoSnackbarMessage, setUndoSnackbarMessage] = useState("");
  const [simpleSnackbarOpen, setSimpleSnackbarOpen] = useState(false);
  const [simpleSnackbarMessage, setSimpleSnackbarMessage] = useState("");

  /**
   * タスクがクリックされたときの処理です。
   */
  const onItemClick = (event, index) => {
    if (
      ["DIV", "SPAN"].includes(event.target.tagName) &&
      event.target.style.backgroundColor !== "transparent" &&
      event.target.className !== "MuiIconButton-label"
    ) {
      setColumns((columns) => {
        Object.values(columns)[0].items.map((item, i) => {
          if (i === index) {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
          return item;
        });
        return { ...columns };
      });
    }
  };

  /**
   * タイマーの開始・停止ボタンがクリックされたときの処理です。
   * @param {*} index
   */
  const onPlayButtonClick = (index) => {
    setState((state) => {
      if (!state.isTimerOn) {
        startedAt = Date.now();
        lastCountedAt = Date.now();
        timeoutId = setTimeout(timerCount, getTimeout());
        startedSound.play();
      } else {
        document.title = defaultTitle;
        stoppedSound.play();
      }
      return { ...state, isTimerOn: !state.isTimerOn };
    });
  };

  /**
   * 次にタイマーをカウントするまでの時間(ミリ秒)を返します。
   */
  const getTimeout = () => {
    const dateNow = Date.now();
    const timeout =
      // 現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁以上の場合
      // → 1000 + 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
      dateNow % COUNT_INTERVAL >= startedAt % COUNT_INTERVAL
        ? COUNT_INTERVAL +
          (startedAt % COUNT_INTERVAL) -
          (dateNow % COUNT_INTERVAL)
        : // 現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁未満の場合
          // → 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
          (startedAt % COUNT_INTERVAL) - (dateNow % COUNT_INTERVAL);
    return timeout;
  };

  /**
   * タイマーのカウント処理です。
   */
  const timerCount = () => {
    setState((state) => {
      if (state.isTimerOn) {
        timeoutId = setTimeout(timerCount, getTimeout());
        // 前回のカウントから1.5秒以上経っていると一度にカウントする量が増える
        const dateNow = Date.now();
        let count = 0;
        for (
          let i = 0;
          i <= dateNow - lastCountedAt - COUNT_INTERVAL / 2;
          i += COUNT_INTERVAL
        ) {
          count++;
        }
        spendTime(count);
        lastCountedAt = Date.now();
        // 目標時間を超えたとき
        if (
          Object.values(columns)[0].items.filter((item, index) => {
            return item.isSelected;
          })[0].spentSecond >=
            Object.values(columns)[0].items.filter((item, index) => {
              return item.isSelected;
            })[0].estimatedSecond &&
          Object.values(columns)[0].items.filter((item, index) => {
            return item.isSelected;
          })[0].achievedThenStop
        ) {
          Object.values(columns)[0].items.map((item, index) => {
            if (item.isSelected && item.achievedThenStop) {
              item.achievedThenStop = false;
            }
            return item;
          });
          setState({ ...state, isTimerOn: false });
          clearTimeout(timeoutId);
          achievedSound.play();
        }
        tickSound.play();
      }
      if (!state.isTimerOn) {
        clearTimeout(timeoutId);
      }
      return state;
    });
  };

  /**
   * 選択されているタスクの経過時間を加算します。
   */
  const spendTime = (count) => {
    setColumns((columns) => {
      Object.values(columns)[0].items.map((item, index) => {
        if (item.isSelected) {
          item.spentSecond += ONCE_COUNT * count;
          refreshTitle(item.content, item.spentSecond);
        }
        return item;
      });
      return { ...columns };
    });
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = (content, spentSecond) => {
    document.title =
      content + " (" + secondToHHMMSS(spentSecond) + ") | " + defaultTitle;
  };

  /**
   * 追加ボタンがクリックされたときの処理です。
   */
  const onAddButtonClick = () => {
    if (validate()) {
      const retrievedInputValue = retrieveEstimatedSecond(inputValue.trim());
      setColumns((columns) => {
        Object.values(columns)[0].items.push({
          id: uuid(),
          category: categoryInput.length > 0 ? categoryInput[0] : "",
          content: retrievedInputValue.content,
          spentSecond: 0,
          estimatedSecond: retrievedInputValue.estimatedSecond,
          isSelected: false,
          achievedThenStop: false,
        });
        return { ...columns };
      });
      setCategoryInput([]);
      setInputValue("");
    }
  };

  /**
   * 入力された値を検証します。
   */
  const validate = () => {
    if (Object.values(columns)[0].items.length > NUMBER_OF_ITEMS_MAX) {
      setHelperText("これ以上タスクを追加できません");
      return false;
    }
    if (inputValue.trim().length < 1) {
      setHelperText("タスク名を入力してください");
      return false;
    }
    if (inputValue.trim().length > 45) {
      setHelperText("タスク名は45文字以内にしてください");
      return false;
    }
    if (categoryInput.length > 0 && categoryInput[0].trim().length > 45) {
      setHelperText("カテゴリー名は45文字以内にしてください");
      return false;
    }
    return true;
  };

  /**
   * 入力された文字列を、文字列と目標時間に分割します。
   * @param {*} input
   * @returns
   */
  const retrieveEstimatedSecond = (input) => {
    const matched = input.match(/\d+:[0-5]*[0-9]:[0-5]*[0-9]/);
    if (matched) {
      let matchedSplit = matched[0].split(":");
      let estimatedSecond =
        parseInt(matchedSplit[0]) * 3600 +
        parseInt(matchedSplit[1]) * 60 +
        parseInt(matchedSplit[2]);
      return {
        content: input.split(matched[0])[0],
        estimatedSecond: estimatedSecond,
      };
    }
    return { content: input, estimatedSecond: 0 };
  };

  /**
   * カテゴリーの入力を反映させます。
   */
  const handleSelecetedTags = (category) => {
    setCategoryInput(category);
  };

  /**
   * 取り消しボタンがクリックされたときの処理です。
   */
  const onUndoButtonClick = () => {
    // タスクの削除を取り消す
    if (lastActivity.type === "itemDelete") {
      setColumns((columns) => {
        Object.values(columns)[0].items.splice(
          lastActivity.index,
          0,
          lastActivity.item
        );
        return {
          [Object.keys(columns)[0]]: {
            ...Object.values(columns)[0],
            items: Object.values(columns)[0].items,
          },
        };
      });
      setLastActivity({});
      setSimpleSnackbarMessage("削除を取り消しました");
      // 経過時間のリセットを取り消す
    } else if (lastActivity.type === "resetSpentSecond") {
      setColumns((columns) => {
        return {
          [Object.keys(columns)[0]]: {
            ...Object.values(columns)[0],
            items: Object.values(columns)[0].items.map((item, index) => {
              if (index === lastActivity.index) {
                item.spentSecond = lastActivity.spentSecond;
              }
              return item;
            }),
          },
        };
      });
      setLastActivity({});
      setSimpleSnackbarMessage("経過時間のリセットを取り消しました");
      // 全て削除を取り消す
    } else if (lastActivity.type === "deleteAll") {
      setColumns((columns) => {
        return {
          [Object.keys(columns)[0]]: {
            ...Object.values(columns)[0],
            items: lastActivity.items,
          },
        };
      });
      setLastActivity({});
      setSimpleSnackbarMessage("削除を取り消しました");
      // 全ての時間をリセットを取り消す
    } else if (lastActivity.type === "resetAllTime") {
      console.log(lastActivity.items);
      setColumns((columns) => {
        return {
          [Object.keys(columns)[0]]: {
            ...Object.values(columns)[0],
            items: lastActivity.items,
          },
        };
      });
      setLastActivity({});
      setSimpleSnackbarMessage("時間のリセットを取り消しました");
    } else {
      setSimpleSnackbarMessage("操作を元に戻せませんでした");
    }
    setUndoSnackbarOpen(false);
    setSimpleSnackbarOpen(true);
  };

  /**
   * クリップボードボタンがクリックされたときの処理です。
   */
  const onClipboardButtonClick = () => {
    if (copyTasksToClipboard(Object.values(columns)[0].items)) {
      setSimpleSnackbarMessage("タスクをコピーしました！");
      setSimpleSnackbarOpen(true);
    }
  };

  /**
   * タスクから日報を作成するボタンがクリックされたときの処理です。
   */
  const onCreateReportButtonClick = () => {
    const report = taskItemsToReport(Object.values(columns)[0].items);
    setState({ ...state, waitingReport: report });
    setTimeout(() => {
      document.getElementById("linkToReports").click();
    }, 1);
  };

  /**
   * アラームアイコンがクリックされたときの処理です。
   */
  const onAlarmIconClick = (index) => {
    setColumns((columns) => {
      Object.values(columns)[0].items[index].achievedThenStop =
        !Object.values(columns)[0].items[index].achievedThenStop;
      return { ...columns };
    });
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: 8,
              }}
              key={columnId}
            >
              <div
                style={{
                  backgroundColor: "lightgrey",
                  padding: 4,
                  width: 320,
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
                        onCreateReportButtonClick();
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
                        onClipboardButtonClick();
                      }}
                    >
                      <AssignmentOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  {/* カラムメニュー */}
                  <ColumnMenu
                    index={index}
                    columns={columns}
                    setColumns={setColumns}
                    setLastActivity={setLastActivity}
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
                          : "lightgrey",
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
                                  color="primary"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={classes.taskCard}
                                  style={{
                                    backgroundColor: snapshot.isDragging
                                      ? theme.palette.primary.dark
                                      : item.isSelected && state.isTimerOn
                                      ? theme.palette.primary.main
                                      : "#FFF",
                                    color: snapshot.isDragging
                                      ? "#FFF"
                                      : item.isSelected && state.isTimerOn
                                      ? "#FFF"
                                      : "#000",
                                    ...provided.draggableProps.style,
                                  }}
                                  onClick={(event) => onItemClick(event, index)}
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
                                      onClick={() => onPlayButtonClick(index)}
                                    >
                                      {state.isTimerOn && <StopIcon />}
                                      {!state.isTimerOn && <PlayArrowIcon />}
                                    </IconButton>
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
                                        {item.estimatedSecond > 0 && (
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
                                        )}
                                      </div>
                                    </div>
                                    {/* タスクメニュー */}
                                    <TaskMenu
                                      index={index}
                                      columns={columns}
                                      setColumns={setColumns}
                                      setLastActivity={setLastActivity}
                                      setUndoSnackbarOpen={setUndoSnackbarOpen}
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
                                        item.spentSecond < item.estimatedSecond
                                          ? "primary"
                                          : "secondary"
                                      }
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "lightgray",
                  width: 320,
                  marginTop: "-2px",
                  paddingLeft: "0.5rem",
                  paddingTop: helperText !== "" ? "0" : "0.5rem",
                  paddingBottom: helperText !== "" ? "0" : "0.5rem",
                  borderRadius: "4px",
                  height: helperText ? "4rem" : "",
                  boxShadow:
                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                }}
              >
                <TagsInput
                  error={helperText !== "" ? true : false}
                  helperText={helperText}
                  setHelperText={setHelperText}
                  selectedTags={handleSelecetedTags}
                  fullWidth
                  variant="outlined"
                  name="tags"
                  size="small"
                  placeholder="タスクを追加"
                  categoryInput={categoryInput}
                  setCategoryInput={setCategoryInput}
                  isTagsInputFocused={isTagsInputFocused}
                  setIsTagsInputFocused={setIsTagsInputFocused}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onAddButtonClick={onAddButtonClick}
                  style={{
                    width: "105%",
                    marginTop: "0.25rem",
                    marginLeft: "0.2rem",
                    backgroundColor: isTagsInputFocused ? "white" : "lightgrey",
                    borderRadius: "4px",
                    height: "2.5rem",
                  }}
                />
                <IconButton
                  onClick={onAddButtonClick}
                  style={{ marginLeft: "1rem" }}
                >
                  <AddIcon />
                </IconButton>
              </div>
            </div>
          );
        })}
      </DragDropContext>
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
};

export default TodoList;
