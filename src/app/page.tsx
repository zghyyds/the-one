"use client";
import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { demoData } from "@/configs/demoData";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";

type Granularity = "1H" | "1D" | "1W";
type FollowerRange = "0-5k" | "5k-10k" | "10k-50k" | "50k+";

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

interface KolMarker {
  x: number;
  y: number;
  data: (typeof demoData.social)[0];
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<Granularity>("1H");
  const [followerFilter, setFollowerFilter] = useState<FollowerRange[]>([]);

  // 处理数据，将价格数据和社交数据结合
  const chartData = useMemo(() => {
    const priceMap = new Map(
      demoData.price.map((item) => [item.utc_time, item])
    );

    // 根据粒度处理数据
    let processedPrices = [...demoData.price];
    if (granularity !== "1H") {
      const groupedData = new Map<string, number[]>();

      demoData.price.forEach((item) => {
        const date = new Date(item.utc_time);
        let key: string;

        if (granularity === "1D") {
          key = date.toISOString().split("T")[0];
        } else {
          // 1W
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toISOString().split("T")[0];
        }

        if (!groupedData.has(key)) {
          groupedData.set(key, []);
        }
        groupedData.get(key)?.push(item.close);
      });

      processedPrices = Array.from(groupedData.entries()).map(
        ([date, prices]) => ({
          utc_time: date,
          close: prices.reduce((a, b) => a + b) / prices.length,
        })
      );
    }

    // 将社交数据映射到价格时间点
    const kolMarkers: KolMarker[] = demoData.social
      .filter((social) => {
        if (followerFilter.length === 0) return true;
        const followers = social.followers_count;
        return followerFilter.some((range) => {
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
      })
      .map((social) => {
        const pricePoint = priceMap.get(social.created_at);
        if (!pricePoint) return null;

        return {
          x: processedPrices.findIndex((p) =>
            granularity === "1H"
              ? p.utc_time === social.created_at
              : new Date(p.utc_time).toISOString().split("T")[0] ===
                new Date(social.created_at).toISOString().split("T")[0]
          ),
          y: pricePoint.close,
          data: social,
        };
      })
      .filter(Boolean) as KolMarker[];

    return {
      prices: processedPrices.map((item) => ({
        ...item,
        time: formatTime(new Date(item.utc_time), granularity),
      })),
      kolMarkers,
    };
  }, [granularity, followerFilter]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen p-8 bg-black text-white">
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Price Chart with KOL Activities
          </h2>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-400 text-right">
                Filter by KOL Followers
              </div>
              <div className="flex gap-2">
                {(["0-5k", "5k-10k", "10k-50k", "50k+"] as const).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setFollowerFilter((prev) =>
                          prev.includes(range)
                            ? prev.filter((r) => r !== range)
                            : [...prev, range]
                        );
                      }}
                      className={`px-3 py-1 text-sm rounded ${
                        followerFilter.includes(range)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {range === "0-5k" && "< 5K"}
                      {range === "5k-10k" && "5K - 10K"}
                      {range === "10k-50k" && "10K - 50K"}
                      {range === "50k+" && "> 50K"}
                    </button>
                  )
                )}
                {followerFilter.length > 0 && (
                  <button
                    onClick={() => setFollowerFilter([])}
                    className="px-3 py-1 text-sm rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="border-l border-gray-600 pl-4 flex flex-col gap-2">
              <div className="text-sm text-gray-400 text-right">
                Time Interval
              </div>
              <div className="flex gap-2">
                {(["1H", "1D", "1W"] as const).map((gran) => (
                  <button
                    key={gran}
                    onClick={() => setGranularity(gran)}
                    className={`px-3 py-1 text-sm rounded ${
                      granularity === gran
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {gran === "1H" && "1 Hour"}
                    {gran === "1D" && "1 Day"}
                    {gran === "1W" && "1 Week"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[600px] w-full px-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.prices}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#666"
                tick={{ fill: "#666" }}
                tickLine={{ stroke: "#666" }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#666" }}
                tickLine={{ stroke: "#666" }}
              />
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
                dataKey="close"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorClose)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* KOL Markers with NextUI Tooltip */}
          {chartData.kolMarkers.map((marker, index) => {
            const xPercent = (marker.x / chartData.prices.length) * 100;
            const yPercent =
              ((marker.y - Math.min(...chartData.prices.map((p) => p.close))) /
                (Math.max(...chartData.prices.map((p) => p.close)) -
                  Math.min(...chartData.prices.map((p) => p.close)))) *
              100;

            return (
              <Tooltip
                key={index}
                showArrow
                placement="top"
                content={
                  <div className="max-w-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={marker.data.profile_image_url}
                        alt={marker.data.user}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{marker.data.user}</h3>
                        <p className="text-sm text-gray-400">
                          {marker.data.followers_count.toLocaleString()}{" "}
                          followers
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg mb-3">
                      {(() => {
                        const shillPrice = marker.y;
                        const currentPrice =
                          chartData.prices[chartData.prices.length - 1].close;
                        const priceChange =
                          ((currentPrice - shillPrice) / shillPrice) * 100;
                        const isProfit = priceChange > 0;

                        return (
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-400">
                              Price Impact
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">
                                ${shillPrice.toFixed(4)} → $
                                {currentPrice.toFixed(4)}
                              </span>
                              <span
                                className={`font-bold ${
                                  isProfit ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {isProfit ? "+" : ""}
                                {priceChange.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <p className="text-sm">{marker.data.text}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(marker.data.created_at).toLocaleString()}
                    </p>
                  </div>
                }
              >
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${xPercent}%`,
                    top: `${100 - yPercent}%`,
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
    </div>
  );
}
