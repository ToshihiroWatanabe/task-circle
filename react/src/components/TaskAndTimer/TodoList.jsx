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
} from "@material-ui/core";
import uuid from "uuid/v4";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import LinearDeterminate from "components/TaskAndTimer/LinearDeterminate";
import "components/TaskAndTimer/TodoList.css";
import { Context } from "contexts/Context";
import StopIcon from "@material-ui/icons/Stop";
import { secondToHHMMSS } from "utils/convert";
import startedAudio from "audio/notification_simple-01.mp3";
import stoppedAudio from "audio/notification_simple-02.mp3";
import tickAudio from "audio/tick.mp3";
import TaskMenu from "./TaskMenu";
import AddIcon from "@material-ui/icons/Add";
import TagsInput from "./TagsInput";

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

const itemsFrom = [
  {
    id: uuid(),
    category: "",
    content: "予習",
    spentSecond: 0,
    estimatedSecond: 3 * 60,
    isSelected: true,
  },
  {
    id: uuid(),
    category: "",
    content: "復習",
    spentSecond: 0,
    estimatedSecond: 60 * 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "Java",
    content: "JUnitのテストコードを書く",
    spentSecond: 0,
    estimatedSecond: 15 * 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "",
    content: "ふりかえり",
    spentSecond: 0,
    estimatedSecond: 60 * 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "カテゴリ",
    content: "課題",
    spentSecond: 0,
    estimatedSecond: 60 * 60,
    isSelected: false,
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
    minWidth: 320,
    width: 320,
  },
  taskCardArea: {
    minHeight: "calc(100% - 5rem)",
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
  const [state, setState] = useContext(Context);
  const [columns, setColumns] = useState(columnsFrom);
  const [categoryInput, setCategoryInput] = useState([]);
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [helperText, setHelperText] = useState("");

  /**
   * タスクがクリックされたときの処理です。
   */
  const onItemClick = (event, index) => {
    if (
      ["DIV", "SPAN"].includes(event.target.tagName) &&
      event.target.style.backgroundColor !== "transparent"
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
      content + " (" + secondToHHMMSS(spentSecond) + ") " + defaultTitle;
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

  const handleSelecetedTags = (category) => {
    setCategoryInput(category);
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
                      <Typography>{column.name}</Typography>
                      <Divider style={{ margin: "0.25rem 0" }} />
                      {/* タスクカード */}
                      <div className={classes.taskCardArea}>
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
                                        ? "#254C86"
                                        : item.isSelected && state.isTimerOn
                                        ? "#2498b3"
                                        : "#456C86",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={(event) =>
                                      onItemClick(event, index)
                                    }
                                    onDrag={(e) => {
                                      console.log(e);
                                    }}
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
                                          }}
                                        >
                                          {secondToHHMMSS(item.spentSecond)}
                                          {item.estimatedSecond !== 0 && (
                                            <span style={{ color: "#AAA" }}>
                                              {" / "}
                                              {secondToHHMMSS(
                                                item.estimatedSecond
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {/* タスクメニュー */}
                                      <TaskMenu
                                        index={index}
                                        columns={columns}
                                        setColumns={setColumns}
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
                                      />
                                    )}
                                  </Card>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </div>
                      {provided.placeholder}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          height: helperText ? "4rem" : "",
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
                            backgroundColor: isTagsInputFocused
                              ? "white"
                              : "lightgrey",
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
                    </Card>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default TodoList;
