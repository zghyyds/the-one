'use client';

import { useEffect } from 'react';
import { getKols, getTickers } from '@/api'; // 请确保导入正确的API函数

export default function CacheUpdater() {
  useEffect(() => {
    const updateCache = async () => {
      try {
        const [kols, ticks] = await Promise.all([getKols(), getTickers()]);
        const filterList = Array.from(
          new Map(ticks.tickers.map(([name, address, num]) => [
            address,
            { name, address, num }
          ])).values()
        );
        
        localStorage.setItem("kolsList", JSON.stringify(kols.tickers));
        localStorage.setItem("tokenList", JSON.stringify(filterList));
      } catch (error) {
        console.error('缓存更新失败:', error);
      }
    };

    // 立即执行一次
    updateCache();

    // 设置30分钟的定时器
    const interval = setInterval(updateCache, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}