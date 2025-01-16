import { Suspense } from "react";
import TokenChart from "./TokenChart";

async function getTokenData(ticker: string) {
  try {
    const [priceRes, tweetsRes] = await Promise.all([
      fetch(
        `https://the1-target-asset-5lx7id43eq-uc.a.run.app/get-ticker-history?ticker_name=${ticker}`,
        { cache: "no-store" }
      ),
      fetch(
        `https://the1-target-asset-5lx7id43eq-uc.a.run.app/get-ticker-tweet?ticker_name=${ticker}`,
        { cache: "no-store" }
      ),
    ]);

    const [priceData, tweetsData] = await Promise.all([
      priceRes.json(),
      tweetsRes.json(),
    ]);

    return {
      priceHistory: priceData.history || [],
      tweets: tweetsData.tweets || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { priceHistory: [], tweets: [] };
  }
}

export default async function TokenPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const ticker = (await params).ticker;
  const data = await getTokenData(ticker);

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
