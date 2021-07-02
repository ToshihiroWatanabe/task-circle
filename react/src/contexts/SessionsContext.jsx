import React, { createContext, useState } from "react";

export const SessionsContext = createContext([{}, () => {}]);

/**
 * セッションのグローバルstateを提供します。
 * @param {*} props
 */
export function SessionsContextProvider(props) {
  const [sessions, setSessions] = useState([]);

  return (
    <SessionsContext.Provider value={[sessions, setSessions]}>
      {props.children}
    </SessionsContext.Provider>
  );
}
