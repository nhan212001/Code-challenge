import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";

type PriceData = {
  currency: string;
  date: string;
  price: number;
};

type CurrencyState = {
  currency: string;
  amount: number;
};

function App() {
  // ...existing code...
  const [loading, setLoading] = useState<boolean>(false);
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const [fromCurrency, setFromCurrency] = useState<CurrencyState>({
    currency: "",
    amount: 1,
  });
  const [toCurrency, setToCurrency] = useState<CurrencyState>({
    currency: "",
    amount: 1,
  });

  const fetchPriceData = async (): Promise<Record<string, PriceData>> => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://interview.switcheo.com/prices.json"
      );
      // Simulate network delay for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data: PriceData[] = await response.json();
      const filteredData: Record<string, PriceData> = {};
      data.forEach((item: PriceData) => {
        if (filteredData[item.currency]) {
          if (
            new Date(item.date) > new Date(filteredData[item.currency].date)
          ) {
            filteredData[item.currency] = item;
          }
        } else {
          filteredData[item.currency] = item;
        }
      });

      if (fromCurrency.currency === "" && toCurrency.currency === "") {
        setFromCurrency({
          currency: Object.keys(filteredData)[0] || "",
          amount: 1,
        });
        setToCurrency({
          currency: Object.keys(filteredData)[0] || "",
          amount: 1,
        });
      }
      setPriceData(filteredData);
      setLoading(false);
      return filteredData;
    } catch (error) {
      alert(`Error fetching price data: ${error}`);
      setLoading(false);
      return {};
    }
  };

  const handleSubmit = async () => {
    if (fromCurrency.currency && toCurrency.currency && fromCurrency.amount) {
      const filteredData = await fetchPriceData();
      const fromPrice = filteredData[fromCurrency.currency]?.price || 0;
      const toPrice = filteredData[toCurrency.currency]?.price || 0;
      const convertedAmount = (fromCurrency.amount * fromPrice) / toPrice;
      setToCurrency({ currency: toCurrency.currency, amount: convertedAmount });
    }
  };

  const validateNumberInput = (value: string): boolean => {
    const regex = /^\d*\.?\d*$/;
    return regex.test(value);
  };

  useEffect(() => {
    fetchPriceData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center relative min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg px-8 py-6 flex flex-col items-center shadow-lg">
            <ClipLoader color="#3b82f6" size={48} className="mb-3" />
            <span className="text-gray-700 font-semibold">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <div className="flex bg-gray-800 rounded-lg overflow-hidden">
          <input
            // type="number"
            value={fromCurrency.amount}
            disabled={loading}
            // min={0}
            onChange={(e) => {
              const val = e.target.value;
              if (validateNumberInput(val) && Number(val) >= 0) {
                setFromCurrency({
                  currency: fromCurrency.currency,
                  amount: Number(val),
                });
              }
            }}
            placeholder="0"
            className="flex-1 px-3 py-2 bg-transparent text-lg outline-none"
          />
          <select
            value={fromCurrency.currency}
            disabled={loading}
            onChange={(e) =>
              setFromCurrency({
                currency: e.target.value,
                amount: fromCurrency.amount,
              })
            }
            className="bg-gray-700 px-3 py-2 text-lg outline-none"
          >
            {Object.keys(priceData).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            Exchange
          </button>
        </div>

        <div className="flex bg-gray-800 rounded-lg overflow-hidden">
          <input
            // type="number"
            value={toCurrency.amount}
            readOnly
            placeholder="0"
            className="flex-1 px-3 py-2 bg-transparent text-lg outline-none"
          />
          <select
            value={toCurrency.currency}
            disabled={loading}
            onChange={(e) =>
              setToCurrency({
                currency: e.target.value,
                amount: toCurrency.amount,
              })
            }
            className="bg-gray-700 px-3 py-2 text-lg outline-none"
          >
            {Object.keys(priceData).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
