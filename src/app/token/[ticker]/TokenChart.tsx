"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceDot,
  Brush,
} from "recharts";
import { Tooltip, Avatar, AvatarGroup } from "@nextui-org/react";
import { Tweet, PriceHistory } from "@/types";
import NextLink from "next/link";
import { FaTwitter } from "react-icons/fa";

type FollowerRange = "0-5k" | "5k-10k" | "10k-50k" | "50k+";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
        <p className="text-gray-400 mb-2">
          {new Date(label).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          })}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Price:</span>
          <span className="text-white font-mono">
            ${Number(payload[0].value).toFixed(4)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface CustomDotProps {
  cx: number;
  cy: number;
  payload?: any;
  tweets: Tweet[];
  price: number;
  chartData: Array<{
    time: Date;
    price: number;
  }>;
}

const CustomDot = ({
  cx,
  cy,
  payload,
  tweets,
  price,
  chartData,
}: CustomDotProps) => {
  if (!tweets?.length) return null;

  const calculateImpact = (tweet: Tweet, currentPrice: number) => {
    // Find highest price after the tweet
    const tweetTime = new Date(tweet.created_at).getTime();
    const laterPrices = chartData.filter(
      (d: any) => new Date(d.time).getTime() > tweetTime
    );

    if (laterPrices.length === 0) return null;

    const highestPrice = Math.max(...laterPrices.map((d: any) => d.price));
    const priceChange = ((highestPrice - currentPrice) / currentPrice) * 100;

    return {
      highestPrice,
      priceChange,
    };
  };

  return (
    <foreignObject
      x={cx - 12}
      y={cy - 12}
      width={24}
      height={24}
      style={{ overflow: "visible" }}
    >
      <Tooltip
        content={
          <div className="bg-gray-900 rounded-lg shadow-lg max-w-sm">
            {tweets.map((tweet: Tweet, i) => {
              const impact = calculateImpact(tweet, price);
              return (
                <div
                  key={i}
                  className={`p-3 ${
                    i !== tweets.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <NextLink
                        href={`https://twitter.com/${tweet.screen_name}`}
                        target="_blank"
                      >
                        <Avatar
                          src={tweet.profile_image_url}
                          className="w-8 h-8 cursor-pointer hover:opacity-80"
                        />
                      </NextLink>
                      <div>
                        <NextLink
                          href={`https://twitter.com/${tweet.screen_name}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          <div className="font-bold text-white">
                            {tweet.user}
                          </div>
                          <div className="text-sm text-gray-400">
                            @{tweet.screen_name} ·{" "}
                            {tweet.followers_count.toLocaleString()} followers
                          </div>
                        </NextLink>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <NextLink
                        href={`/detail/${tweet.screen_name}`}
                        className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                      >
                        Profile
                      </NextLink>
                      <NextLink
                        href={`https://twitter.com/intent/follow?screen_name=${tweet.screen_name}`}
                        target="_blank"
                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center gap-1"
                      >
                        <FaTwitter className="text-xs" />
                        Follow
                      </NextLink>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price at Post</span>
                      <span className="font-mono">${price.toFixed(4)}</span>
                    </div>
                    {impact && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Highest After</span>
                          <span className="font-mono">
                            ${impact.highestPrice.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Return After Tweet</span>
                          <span
                            className={`font-mono font-bold ${
                              impact.priceChange >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {impact.priceChange >= 0 ? "+" : ""}
                            {impact.priceChange.toFixed(2)}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-300">{tweet.text}</p>
                </div>
              );
            })}
          </div>
        }
        classNames={{
          base: "shadow-xl rounded-lg",
          content: "p-0",
        }}
      >
        <div className="relative flex items-center scale-75">
          {tweets.length > 1 ? (
            <AvatarGroup isBordered max={10} size="sm" className="!gap-1">
              {tweets.map((tweet: Tweet, i: number) => (
                <NextLink
                  key={i}
                  href={`https://twitter.com/${tweet.screen_name}`}
                  target="_blank"
                >
                  <Avatar
                    src={tweet.profile_image_url}
                    className="w-5 h-5 hover:border-blue-500 hover:z-50 cursor-pointer"
                    classNames={{
                      base: "!w-5 !h-5",
                      icon: "!w-5 !h-5",
                      img: "!w-5 !h-5",
                    }}
                  />
                </NextLink>
              ))}
            </AvatarGroup>
          ) : (
            <NextLink
              href={`https://twitter.com/${tweets[0].screen_name}`}
              target="_blank"
            >
              <Avatar
                src={tweets[0].profile_image_url}
                className="w-5 h-5 border border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
                classNames={{
                  base: "!w-5 !h-5",
                }}
              />
            </NextLink>
          )}
        </div>
      </Tooltip>
    </foreignObject>
  );
};

// Add helper function to check follower range
const getFollowerRange = (followersCount: number): FollowerRange => {
  if (followersCount < 5000) return "0-5k";
  if (followersCount < 10000) return "5k-10k";
  if (followersCount < 50000) return "10k-50k";
  return "50k+";
};

export default function TokenChart({
  initialData,
}: {
  initialData: { priceHistory: PriceHistory[]; tweets: Tweet[] };
}) {
  const [followerRange, setFollowerRange] = useState<FollowerRange[]>([]);

  // Process chart data
  const processedChartData = useMemo(() => {
    return initialData.priceHistory.map((item) => ({
      time: new Date(item.download_time),
      price: parseFloat(item.close),
    }));
  }, [initialData.priceHistory]);

  // Process tweet data and match with prices
  const tweetMarkers = useMemo(() => {
    const markers: { time: Date; price: number; tweets: Tweet[] }[] = [];

    // Filter tweets based on selected follower ranges
    const filteredTweets =
      followerRange.length > 0
        ? initialData.tweets.filter((tweet) =>
            followerRange.includes(getFollowerRange(tweet.followers_count))
          )
        : initialData.tweets;

    filteredTweets.forEach((tweet) => {
      const tweetTime = new Date(tweet.created_at);

      // Find the closest price data point within 1 hour
      const closestPricePoint = processedChartData.find((pricePoint) => {
        const timeDiff = Math.abs(
          pricePoint.time.getTime() - tweetTime.getTime()
        );
        return timeDiff <= 3600000; // Within 1 hour (3600000 ms)
      });

      // Skip if no matching price point found
      if (!closestPricePoint) {
        console.log(`Tweet at ${tweetTime} skipped - no matching price data`);
        return;
      }

      // Group tweets that share the same closest price point
      const existingMarker = markers.find(
        (m) => m.time.getTime() === closestPricePoint.time.getTime()
      );

      if (existingMarker) {
        existingMarker.tweets.push(tweet);
      } else {
        markers.push({
          time: closestPricePoint.time,
          price: closestPricePoint.price,
          tweets: [tweet],
        });
      }
    });

    return markers;
  }, [initialData.tweets, processedChartData, followerRange]);

  const formatTime = (date: Date) => {
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  };

  console.log("tweetMarkers", tweetMarkers);
  console.log("processedChartData", processedChartData);
  console.log(processedChartData[0]?.time.getTime());
  console.log(tweetMarkers[0]?.time.getTime());
  return (
    <section className="mb-8">
      <div className="flex gap-4 mb-4 sm:flex-row">
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
          <AreaChart data={processedChartData} >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="#666"
              tick={{ fill: "#666" }}
            />
            <YAxis stroke="#666" tick={{ fill: "#666" }} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {tweetMarkers.map((marker, index) => (
              <ReferenceDot
                key={index}
                x={marker.time.getTime()}
                y={marker.price}
                r={0}
                shape={(props) => (
                  <CustomDot
                    {...props}
                    tweets={marker.tweets}
                    price={marker.price}
                    chartData={processedChartData}
                  />
                )}
              />
            ))}
            <Brush
              dataKey="time"
              height={30}
              stroke="#8884d8"
              fill="#1f1f1f"
              tickFormatter={formatTime}
            >
              <AreaChart>
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </Brush>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
