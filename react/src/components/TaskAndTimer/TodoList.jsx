import React, { useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Chip, IconButton, makeStyles, Card } from "@material-ui/core";
import uuid from "uuid/v4";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LinearDeterminate from "components/TaskAndTimer/LinearDeterminate";
import "components/TaskAndTimer/TodoList.css";
import { Context } from "contexts/Context";
import StopIcon from "@material-ui/icons/Stop";
import { secondToHHMMSS } from "utils/convert";
import startedAudio from "audio/notification_simple-01.mp3";
import stoppedAudio from "audio/notification_simple-02.mp3";
import tickAudio from "audio/tick.mp3";
import TaskMenu from "./TaskMenu";

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
    estimatedMinute: 3,
    isSelected: true,
  },
  {
    id: uuid(),
    category: "",
    content: "復習",
    spentSecond: 0,
    estimatedMinute: 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "Java",
    content: "JUnitのテストコードを書く",
    spentSecond: 0,
    estimatedMinute: 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "",
    content: "ふりかえり",
    spentSecond: 0,
    estimatedMinute: 60,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "カテゴリ",
    content: "課題",
    spentSecond: 0,
    estimatedMinute: 60,
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
  card: {
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

  /**
   * タスクがクリックされたときの処理です。
   * @param {*} index
   * @param {*} event
   */
  const onItemClick = (index, event) => {
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
        stoppedSound.play();
      }
      return { ...state, isTimerOn: !state.isTimerOn };
    });
  };

  /**
   * 次にタイマーをカウントするまでの時間(ミリ秒)を返します。
   */
  const getTimeout = () => {
    /*
    現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁以上の場合
    → 1000 + 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
    現在時刻(ミリ秒)の下3桁が開始時刻(ミリ秒)の下3桁未満の場合
    → 開始時刻(ミリ秒)の下3桁 - 現在時刻(ミリ秒)の下3桁
    */
    const dateNow = Date.now();
    const timeout =
      dateNow % COUNT_INTERVAL >= startedAt % COUNT_INTERVAL
        ? COUNT_INTERVAL +
          (startedAt % COUNT_INTERVAL) -
          (dateNow % COUNT_INTERVAL)
        : (startedAt % COUNT_INTERVAL) - (dateNow % COUNT_INTERVAL);
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
        tickSound.play();
        lastCountedAt = Date.now();
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
      content + "(" + secondToHHMMSS(spentSecond) + ") " + defaultTitle;
  };

  /**
   * 進行状況の割合を返します。
   */
  const getProgress = (spentSecond, estimatedMinute) => {
    const percentage = (spentSecond / (estimatedMinute * 60)) * 100;
    return percentage;
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
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
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
                          padding: 4,
                          minWidth: 320,
                          width: 320,
                          minHeight: 500,
                        }}
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
                                    className={classes.card}
                                    style={{
                                      backgroundColor: snapshot.isDragging
                                        ? "#254C86"
                                        : item.isSelected && state.isTimerOn
                                        ? "#2498b3"
                                        : "#456C86",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={(event) =>
                                      onItemClick(index, event)
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
                                        onClick={() => onPlayButtonClick(index)}
                                      >
                                        {state.isTimerOn && <StopIcon />}
                                        {!state.isTimerOn && <PlayArrowIcon />}
                                      </IconButton>
                                      <div style={{ flexGrow: "1" }}>
                                        <div style={{ marginBottom: "0.2rem" }}>
                                          {item.category !== "" && (
                                            <Chip
                                              label={item.category}
                                              size="small"
                                              style={{
                                                marginTop: "-0.2rem",
                                                marginRight: "0.3rem",
                                                fontSize: "0.5rem",
                                                height: "1rem",
                                                width: "3.5rem",
                                              }}
                                            />
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
                                          {item.estimatedMinute !== 0 && (
                                            <span style={{ color: "#AAA" }}>
                                              {" / "}
                                              {secondToHHMMSS(
                                                item.estimatedMinute * 60
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {/* タスクメニュー */}
                                      <TaskMenu />
                                    </div>
                                    <LinearDeterminate
                                      progress={getProgress(
                                        item.spentSecond,
                                        item.estimatedMinute
                                      )}
                                      color={
                                        item.spentSecond <
                                        item.estimatedMinute * 60
                                          ? "primary"
                                          : "secondary"
                                      }
                                    />
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
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default TodoList;
