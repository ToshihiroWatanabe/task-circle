import React, { createContext, memo, useState } from "react";

export const SessionsContext = createContext(
  {} as {
    sessions: any;
    setSessions: React.Dispatch<React.SetStateAction<any>>;
  }
);

/**
 * セッションのグローバルstateを提供します。
 * @param {*} props
 */
export const SessionsContextProvider = memo((props) => {
  const [sessions, setSessions] = useState([]);

  return (
    <SessionsContext.Provider value={{ sessions, setSessions }}>
      {props.children}
    </SessionsContext.Provider>
  );
});
