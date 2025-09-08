import { useEffect, useState } from "react";

export default function Crypto() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false"
  const fetchCrypto = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,aptos,litecoin,solana,chia&order=market_cap_desc&per_page=5&page=1&sparkline=false"
      );
      const data = await res.json();
      console.log("coins=", coins);
      console.log("data=", data);

      setCoins(data);
      console.log("coins=", coins);
      
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrypto();
  }, []);

  const openCoinGecko = () => {
    window.open("https://www.coingecko.com", "_blank");
  };

  if (loading) {
    return (
      <div className="flex h-full justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200/50 p-4">
      <div className="flex justify-between items-center ">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Crypto Prices
        </h3>
        <div className="flex gap-1">
          <button
            onClick={fetchCrypto}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors duration-200 group"
            title="Refresh"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={openCoinGecko}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors duration-200 group"
            title="View on CoinGecko"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-0.5">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/30 hover:bg-white/90 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 rounded-full shadow-sm"
              />
              <div>
                <div className="font-medium text-slate-800 text-sm">
                  {coin.name}
                </div>
                <div className="text-xs text-slate-500 uppercase">
                  {coin.symbol}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-slate-800 text-sm">
                ${coin.current_price.toLocaleString()}
              </div>
              <div
                className={`text-xs font-medium ${
                  coin.price_change_percentage_24h > 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h > 0 ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
