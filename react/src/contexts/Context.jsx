import React, { createContext, useState } from "react";

export const Context = createContext([{}, () => {}]);

/**
 * グローバルstateを提供します。
 * @param {*} props
 * @returns
 */
export function ContextProvider(props) {
  /** グローバルstate */
  const [state, setState] = useState({
    slackUserName: "",
    slackWebhookUrl: "",
    userId: "",
    password: "",
    reportId: "",
    reportUpdatedAt: "",
    reports: [],
  });

  return (
    <Context.Provider value={[state, setState]}>
      {props.children}
    </Context.Provider>
  );
}
