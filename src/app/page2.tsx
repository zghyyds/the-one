"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticker {
  name: string;
  address: string;
  id: string;
  volume: number;
}

export default function Home() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Add copy function
  const copyToClipboard = async (text: string, tickerId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(tickerId);
      setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const fetchTickers = async () => { 
      try {
        const response = await fetch(
          "https://the1-target-asset-5lx7id43eq-uc.a.run.app/get-tickers"
        );
        const data = await response.json();

        const tickerMap = new Map();
        data.tickers.forEach((ticker: string[]) => {
          const key = `${ticker[0]}_${ticker[1]}`;
          const volume = Number(ticker[2]) || 0;

          if (!tickerMap.has(key) || volume > tickerMap.get(key).volume) {
            tickerMap.set(key, {
              name: ticker[0],
              address: ticker[1],
              id: key,
              volume: volume,
            });
          }
        });

        // Sort by volume in descending order (highest volume first)
        const sortedTickers = Array.from(tickerMap.values()).sort(
          (a, b) => b.volume - a.volume // Higher volume will be at the top
        );

        setTickers(sortedTickers);
      } catch (error) {
        console.error("Error fetching tickers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Token Analytics</h1>
      <div className="flex flex-col gap-2">
        {tickers.map((ticker) => (
          <div
            key={ticker.id}
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors flex flex-col gap-2"
          >
            <Link
              href={`/token/${ticker.name.toLowerCase()}`}
              className="flex items-center justify-between"
            >
              <span className="text-lg font-bold text-white">
                ${ticker.name}
              </span>
              <div className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
            <div className="flex items-center gap-2 group">
              <span className="text-sm text-gray-400 font-mono break-all">
                {ticker.address}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(ticker.address, ticker.id);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {copiedAddress === ticker.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400 hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
