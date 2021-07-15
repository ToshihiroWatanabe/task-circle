import React, { createContext, memo, useState } from "react";

export const StatisticsContext = createContext(
  {} as {
    statistics: any;
    setStatistics: React.Dispatch<React.SetStateAction<any>>;
  }
);

/**
 * 統計のグローバルstateを提供します。
 * @param {*} props
 */
export const StatisticsContextProvider = memo((props) => {
  const [statistics, setStatistics] = useState({
    // 本日の経過時間(秒)
    todaySpentSecond: 0,
    // 昨日の経過時間(秒)
    yesterdaySpentSecond: 0,
    // 最終更新
    updatedAt: 0,
  });

  return (
    <StatisticsContext.Provider value={{ statistics, setStatistics }}>
      {props.children}
    </StatisticsContext.Provider>
  );
});
