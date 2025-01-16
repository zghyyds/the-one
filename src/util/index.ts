const CHART_COLORS = [
  '#5470c6', // 蓝色
  '#91cc75', // 绿色
  '#fac858', // 黄色
  '#ee6666', // 红色
  '#73c0de', // 浅蓝
  '#3ba272', // 深绿
  '#fc8452', // 橙色
  '#9a60b4', // 紫色
  '#ea7ccc', // 粉色
  '#48b3bd', // 青色
  '#827af3', // 靛蓝
  '#f89588', // 珊瑚色
  '#7cd6cf', // 蓝绿
  '#e587e2', // 玫红
  '#a5e7f0', // 天蓝
  '#ffa39e', // 浅红
  '#4e9ed4', // 深蓝
  '#f8c07c', // 杏色
  '#89d685', // 草绿
  '#c4b5ef'  // 淡紫
];

export const getColorByIndex = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
}


export const processHistory = (
  history: any[],
  filterTime: string | undefined
): Record<string, number>[] => {
  const filteredHistory = history
    .filter((data) => {
      return new Date(filterTime as string).getTime() < new Date(data.download_time as string).getTime();
    })
    .map((value) => ({
      [value.name]: value.close,
    }));

  // 获取最后一个有效项的 close 值
  const lastValidClose =
    filteredHistory.length > 0
      ? parseFloat(Object.values(filteredHistory[filteredHistory.length - 1])[0] as string)
      : 0;

  // 自动补全不足 5 项
  const completedHistory = [...filteredHistory];
  while (completedHistory.length < 5) {
    completedHistory.push({
      [filteredHistory[filteredHistory.length - 1]?.name || "unknown"]: lastValidClose.toString(),
    });
  }

  // 计算增长率
  return completedHistory.slice(0, 5).map((current, index, arr) => {
    const previous = arr[index - 1];
    const key = Object.keys(current)[0];
    const currentValue = parseFloat(Object.values(current)[0] as string);
    const previousValue = previous ? parseFloat(Object.values(previous)[0] as string) : currentValue;

    const growthRate = previous ? ((currentValue - previousValue) / previousValue) * 100 : 0;

    return {
      [key]: parseFloat(growthRate.toFixed(2)),
    };
  });
};



// 动态合并不同数组的相同索引项
export const mergeData = (dataList: Record<string, number>[][]): Record<string, number>[] => {
  return dataList[0].map((_, index) => {
    const mergedEntry: Record<string, number> = {};
    dataList.forEach((subList) => {
      const entry = Object.entries(subList[index])[0]; // 获取当前索引的键值对
      mergedEntry[entry[0]] = entry[1]; // 动态添加到结果对象中
    });
    return mergedEntry;
  });
};