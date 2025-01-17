"use client";

import { Suspense, useEffect, useState } from "react";
import TokenChart from "./TokenChart";
import { getTweetOne, getTickerOne } from "@/api"
import { useParams } from 'next/navigation'
import { Tweet, PriceHistory } from "@/types"
import toast from 'react-hot-toast';
// async function getTokenData(ticker: string) {
//   try {
//     const [priceRes, tweetsRes] = await Promise.all([
//       fetch(
//         `https://the1-target-asset-5lx7id43eq-uc.a.run.app/get-ticker-history?ticker_name=${ticker}`,
//         { cache: "no-store" }
//       ),
//       fetch(
//         `https://the1-target-asset-5lx7id43eq-uc.a.run.app/get-ticker-tweet?ticker_name=${ticker}`,
//         { cache: "no-store" }
//       ),
//     ]);

//     const [priceData, tweetsData] = await Promise.all([
//       priceRes.json(),
//       tweetsRes.json(),
//     ]);

//     return {
//       priceHistory: priceData.history || [],
//       tweets: tweetsData.tweets || [],
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return { priceHistory: [], tweets: [] };
//   }
// }
type Params = {
  ticker: string
}


export default function TokenPage() {
  const [data, setData] = useState<{
    priceHistory: PriceHistory[]
    tweets: Tweet[]
  }>({
    priceHistory: [],
    tweets: [],
  })
  const { ticker } = useParams<Params>()

  useEffect(() => {
    const getfetchData = async () => {
      if (ticker) {
        try {
          const [priceRes, tweetsRes] = await Promise.all([getTickerOne(ticker), getTweetOne(ticker)])
          setData({
            priceHistory: priceRes.history, // 根据接口返回的结构调整
            tweets: tweetsRes.tweets,     // 根据接口返回的结构调整
          });
        } catch(error) {
          toast.error(error instanceof Error ? error.message : "error");
        }
      }
    }
    getfetchData()
  }, [ticker])


  // const data = await getTokenData(ticker);

  // const hhh = async() =>{
  // let res = await getTickerOne(ticker)
  // console.log(res,'ooo');
  // }


  // console.log(data,'88888');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">${ticker.toUpperCase()}</h1>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        <TokenChart initialData={data} />
      </Suspense>
    </div>
  );
}
