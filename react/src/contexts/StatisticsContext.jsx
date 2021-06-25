import React, { createContext, useState } from "react";

export const StatisticsContext = createContext([{}, () => {}]);

/**
 * 統計のグローバルstateを提供します。
 * @param {*} props
 */
export function StatisticsContextProvider(props) {
  const [statistics, setStatistics] = useState({
    // 本日の経過時間(秒)
    todaySpentSecond: 0,
    // 昨日の経過時間(秒)
    yesterdaySpentSecond: 0,
    // 最終更新
    updatedAt: 0,
  });

  return (
    <StatisticsContext.Provider value={[statistics, setStatistics]}>
      {props.children}
    </StatisticsContext.Provider>
  );
}
