import React, { createContext, useState } from "react";
import uuid from "uuid/v4";

export const ColumnsContext = createContext([{}, () => {}]);

/**
 * ToDoリストのグローバルstateを提供します。
 * @param {*} props
 */
export function ColumnsContextProvider(props) {
  const [columns, setColumns] = useState({});

  return (
    <ColumnsContext.Provider value={[columns, setColumns]}>
      {props.children}
    </ColumnsContext.Provider>
  );
}
