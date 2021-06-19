import React, { useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Chip, IconButton, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import uuid from "uuid/v4";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LinearDeterminate from "components/TaskAndTimer/LinearDeterminate";
import "components/TaskAndTimer/TodoList.css";
import { Context } from "contexts/Context";
import StopIcon from "@material-ui/icons/Stop";

/** 一度にカウントする秒数 */
const ONCE_COUNT = 1;
/** カウントの間隔(ミリ秒) */
const COUNT_INTERVAL = 1000;

let interval = null;

const itemsFrom = [
  {
    id: uuid(),
    category: "",
    content: "予習",
    spentSecond: 0,
    estimatedMinute: 0,
    isSelected: true,
  },
  {
    id: uuid(),
    category: "",
    content: "復習",
    spentSecond: 0,
    estimatedMinute: 0,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "Java",
    content: "JUnitのテストコードを書く",
    spentSecond: 0,
    estimatedMinute: 0,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "",
    content: "ふりかえり",
    spentSecond: 0,
    estimatedMinute: 0,
    isSelected: false,
  },
  {
    id: uuid(),
    category: "カテゴリ",
    content: "課題",
    spentSecond: 0,
    estimatedMinute: 0,
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
        interval = setInterval(() => {
          spendTime();
        }, COUNT_INTERVAL);
      }
      return { ...state, isTimerOn: !state.isTimerOn };
    });
  };

  /**
   * 選択されているタスクの経過時間を加算します。
   */
  const spendTime = () => {
    setColumns((columns) => {
      Object.values(columns)[0].items.map((item, index) => {
        if (item.isSelected) {
          item.spentSecond += ONCE_COUNT;
        }
        return item;
      });
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
                                                marginRight: "0.5rem",
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
                                          00:00:00
                                        </div>
                                      </div>
                                      <IconButton
                                        size="small"
                                        color="inherit"
                                        style={{ marginRight: "-0.5rem" }}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                    </div>
                                    <LinearDeterminate />
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
