import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IconButton, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import uuid from "uuid/v4";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const itemsFrom = [
  { id: uuid(), content: "予習", isSelected: true },
  { id: uuid(), content: "復習", isSelected: false },
  { id: uuid(), content: "テスト", isSelected: false },
  { id: uuid(), content: "ふりかえり", isSelected: false },
  { id: uuid(), content: "課題", isSelected: false },
];

const columnsFrom = {
  [uuid()]: {
    name: "タスク",
    items: itemsFrom,
  },
};

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

const useStyles = makeStyles((theme) => ({}));

const TodoList = () => {
  const classes = useStyles();
  const [columns, setColumns] = useState(columnsFrom);

  const onItemClick = (index, event) => {
    setColumns((columns) => {
      console.log(columns);
      // columns.forEach((column) => {
      //   column.items.forEach((item) => {
      //     item.isSelected = false;
      //   });
      // });
      // columns[0].items[index].isSelected = true;
      return columns;
    });
  };

  return (
    // <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
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
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          minWidth: 300,
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
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#2498b3"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={(event) =>
                                      onItemClick(index, event)
                                    }
                                  >
                                    <IconButton
                                      size="small"
                                      color="inherit"
                                      style={{
                                        visibility: item.isSelected
                                          ? ""
                                          : "hidden",
                                      }}
                                    >
                                      <PlayArrowIcon />
                                    </IconButton>
                                    {item.content}
                                  </Card>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
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
