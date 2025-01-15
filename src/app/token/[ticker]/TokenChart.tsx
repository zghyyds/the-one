"use client";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";

type Granularity = "1H" | "1D" | "1W";
type FollowerRange = "0-5k" | "5k-10k" | "10k-50k" | "50k+";

interface Tweet {
  created_at: string;
  followers_count: number;
  id: number;
  impact: number;
  pair_name_1: string;
  profile_image_url: string;
  screen_name: string;
  text: string;
  tweet_id: number;
  user: string;
}

interface PriceHistory {
  close: string;
  download_time: string;
  name: string;
  volume: string;
}

export default function TokenChart({
  initialData,
}: {
  initialData: { priceHistory: PriceHistory[]; tweets: Tweet[] };
}) {
  const [granularity, setGranularity] = useState<Granularity>("1H");
  const [followerRange, setFollowerRange] = useState<FollowerRange[]>([]);

  const processedChartData = useMemo(() => {
    let data = [...initialData.priceHistory];

    if (granularity !== "1H") {
      const groupedData = new Map<string, number[]>();

      data.forEach((item) => {
        const date = new Date(item.download_time);
        let key: string;

        if (granularity === "1D") {
          key = date.toISOString().split("T")[0]; // Group by day
        } else {
          // 1W - Group by week
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toISOString().split("T")[0];
        }

        if (!groupedData.has(key)) {
          groupedData.set(key, []);
        }
        groupedData.get(key)?.push(parseFloat(item.close));
      });

      // Calculate average price for each period
      data = Array.from(groupedData.entries()).map(([time, prices]) => ({
        download_time: time,
        close: (prices.reduce((a, b) => a + b, 0) / prices.length).toString(),
        name: initialData.priceHistory[0].name,
        volume: "0", // Volume not used in display
      }));
    }

    return data.map((item) => ({
      time: new Date(item.download_time),
      price: parseFloat(item.close),
      volume: parseFloat(item.volume),
    }));
  }, [initialData.priceHistory, granularity]);

  const filteredTweets = initialData.tweets.filter((tweet) => {
    if (followerRange.length === 0) return true;
    const followers = tweet.followers_count;
    return followerRange.some((range) => {
      switch (range) {
        case "0-5k":
          return followers < 5000;
        case "5k-10k":
          return followers >= 5000 && followers < 10000;
        case "10k-50k":
          return followers >= 10000 && followers < 50000;
        case "50k+":
          return followers >= 50000;
        default:
          return false;
      }
    });
  });

  const tweetMarkers = filteredTweets.map((tweet) => ({
    time: new Date(tweet.created_at),
    data: tweet,
  }));

  const formatTime = (date: Date, gran: Granularity) => {
    if (gran === "1H") {
      return date.toLocaleString([], {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
    } else if (gran === "1D") {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Time Interval</label>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
            className="bg-gray-800 text-white border border-gray-700 rounded p-2"
          >
            <option value="1H">1 Hour</option>
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Filter by Followers</label>
          <div className="flex gap-2 flex-wrap">
            {(["0-5k", "5k-10k", "10k-50k", "50k+"] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setFollowerRange((prev) =>
                    prev.includes(range)
                      ? prev.filter((r) => r !== range)
                      : [...prev, range]
                  );
                }}
                className={`px-3 py-1 text-sm rounded ${
                  followerRange.includes(range)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedChartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={(time) => formatTime(time, granularity)}
              stroke="#666"
              tick={{ fill: "#666" }}
            />
            <YAxis stroke="#666" tick={{ fill: "#666" }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {tweetMarkers.map((marker, index) => {
          if (!processedChartData.length) return null;

          const markerTime = marker.time.getTime();
          const firstTime = processedChartData[0].time.getTime();
          const lastTime =
            processedChartData[processedChartData.length - 1].time.getTime();
          const timeRange = lastTime - firstTime;
          const xPercent = ((markerTime - firstTime) / timeRange) * 100;

          const price = processedChartData.find(
            (d) => Math.abs(d.time.getTime() - markerTime) < 3600000
          )?.price;

          if (!price) return null;

          const minPrice = Math.min(...processedChartData.map((d) => d.price));
          const maxPrice = Math.max(...processedChartData.map((d) => d.price));
          const priceRange = maxPrice - minPrice;
          const yPercent = ((price - minPrice) / priceRange) * 100;

          return (
            <Tooltip
              key={index}
              content={
                <div className="bg-gray-900 rounded-lg shadow-lg max-w-sm text-white">
                  <div className="flex items-center gap-3 p-3 border-b border-gray-800">
                    <Image
                      src={marker.data.profile_image_url}
                      alt={marker.data.user}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">
                          {marker.data.user}
                        </span>
                        <span className="text-sm text-gray-400">
                          @{marker.data.screen_name} ·{" "}
                          {marker.data.followers_count.toLocaleString()}{" "}
                          followers
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 border-b border-gray-800">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Price at Post
                        </span>
                        <span className="font-mono text-white">
                          ${price.toFixed(4)}
                        </span>
                      </div>
                      {(() => {
                        // Find highest price after the post
                        const laterPrices = processedChartData.filter(
                          (d) => d.time.getTime() > markerTime
                        );
                        if (laterPrices.length === 0) return null;

                        const highestPrice = Math.max(
                          ...laterPrices.map((d) => d.price)
                        );
                        const priceChange =
                          ((highestPrice - price) / price) * 100;
                        const isProfit = priceChange > 0;

                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                Highest After
                              </span>
                              <span className="font-mono text-white">
                                ${highestPrice.toFixed(4)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                Max Impact After Post
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  isProfit ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {isProfit ? "+" : ""}
                                {priceChange.toFixed(2)}%
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-sm text-gray-300">{marker.data.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(marker.data.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              }
              classNames={{
                base: "shadow-xl rounded-lg bg-gray-900",
                arrow: "bg-gray-900",
              }}
            >
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${xPercent}%`,
                  top: `${92 - yPercent}%`,
                }}
              >
                <Image
                  src={marker.data.profile_image_url}
                  alt={marker.data.user}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white hover:border-blue-500 transition-all"
                />
              </div>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
