import React, { createContext, useState } from "react";

export const TodoListsContext = createContext([{}, () => {}]);

/**
 * ToDoリストのグローバルstateを提供します。
 * @param {*} props
 */
export function TodoListsContextProvider(props) {
  const [todoLists, setTodoLists] = useState({});

  return (
    <TodoListsContext.Provider value={[todoLists, setTodoLists]}>
      {props.children}
    </TodoListsContext.Provider>
  );
}
