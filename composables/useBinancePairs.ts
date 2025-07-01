import { ref } from "vue";
import type { ICurrency } from "@/utils/types";

export function useBinancePairs() {
  const pairs = ref<ICurrency[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPairs = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
      if (!res.ok) throw new Error("Failed to fetch Binance pairs");
      const data = await res.json();
      pairs.value = data.symbols
        .filter((s: any) => s.status === "TRADING")
        .map((s: any) => ({
          label: `${s.baseAsset}/${s.quoteAsset}`,
          value: s.symbol,
          icon: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${s.baseAsset.toLowerCase()}.png`,
        }));
    } catch (e: any) {
      error.value = e.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return {
    pairs,
    loading,
    error,
    fetchPairs,
  };
}
