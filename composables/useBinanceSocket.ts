import { ref, unref } from "vue";
import type { ICurrency } from "@/utils/types";
import type { Ref, ComputedRef } from "vue";
import { useBinanceWebSocketCore } from "./useBinanceWebSocketCore";

interface TickerInfo {
  bid: number;
  ask: number;
  bidQty: number;
  askQty: number;
  change24h?: number;
  prevBid?: number;
  lastUpdate?: number;
}

type PriceMap = Record<string, TickerInfo>;

interface BookTickerPayload {
  u: number;
  s: string;
  b: string;
  B: string;
  a: string;
  A: string;
}

interface Ticker24hPayload {
  e: string;
  E: number;
  s: string;
  P: string;
}

type BinancePayload = Partial<BookTickerPayload & Ticker24hPayload> & { [key: string]: any };

export function useBinanceSocket(
  selected: Ref<ICurrency[] | string[]> | ComputedRef<ICurrency[] | string[]>
) {
  const prices = ref<PriceMap>({});
  const parseErrors = ref<string[]>([]);

  function getSymbols(): string[] {
    const sel = unref(selected) || [];
    if (!sel.length) return [];
    if (typeof sel[0] === "string") return sel as string[];
    return (sel as ICurrency[]).map((c) => (c as ICurrency).value.toLowerCase());
  }

  const streams = () => {
    const symbols = getSymbols();
    if (!symbols.length) return [];
    return [
      ...symbols.map((s) => `${s.toLowerCase()}@bookTicker`),
      ...symbols.map((s) => `${s.toLowerCase()}@ticker`),
    ];
  };

  const { connected, error, onMessage, reconnectAttempts, isReconnecting, getConnectionStatus } =
    useBinanceWebSocketCore(streams);

  function validateBookTickerPayload(payload: any): payload is BookTickerPayload {
    return (
      payload &&
      typeof payload.s === "string" &&
      typeof payload.b === "string" &&
      typeof payload.a === "string" &&
      typeof payload.B === "string" &&
      typeof payload.A === "string" &&
      !isNaN(parseFloat(payload.b)) &&
      !isNaN(parseFloat(payload.a)) &&
      !isNaN(parseFloat(payload.B)) &&
      !isNaN(parseFloat(payload.A))
    );
  }

  function validateTicker24hPayload(payload: any): payload is Ticker24hPayload {
    return (
      payload &&
      typeof payload.s === "string" &&
      typeof payload.P === "string" &&
      !isNaN(parseFloat(payload.P))
    );
  }

  function parseBookTicker(payload: BookTickerPayload) {
    try {
      const symbol = payload.s;
      const prev = prices.value[symbol]?.bid;

      const newPrice: TickerInfo = {
        ...prices.value[symbol],
        prevBid: prev,
        bid: parseFloat(payload.b),
        ask: parseFloat(payload.a),
        bidQty: parseFloat(payload.B),
        askQty: parseFloat(payload.A),
        lastUpdate: Date.now(),
      };

      if (newPrice.bid <= 0 || newPrice.ask <= 0 || newPrice.bidQty < 0 || newPrice.askQty < 0) {
        console.warn(`Invalid price data for ${symbol}:`, newPrice);
        return;
      }

      const spread = ((newPrice.ask - newPrice.bid) / newPrice.bid) * 100;
      if (spread > 10) {
        console.warn(`Unusual price spread for ${symbol}: ${spread.toFixed(2)}%`);
      }

      prices.value[symbol] = newPrice;
    } catch (e) {
      console.error("Error parsing book ticker:", e);
      parseErrors.value.push(`Book ticker parse error: ${e}`);
    }
  }

  function parse24hTicker(payload: Ticker24hPayload) {
    try {
      const symbol = payload.s;
      const change24h = parseFloat(payload.P);

      if (change24h < -100 || change24h > 1000) {
        console.warn(`Unusual 24h change for ${symbol}: ${change24h}%`);
      }

      prices.value[symbol] = {
        ...prices.value[symbol],
        change24h,
        lastUpdate: Date.now(),
      };
    } catch (e) {
      console.error("Error parsing 24h ticker:", e);
      parseErrors.value.push(`24h ticker parse error: ${e}`);
    }
  }

  function clearParseErrors() {
    parseErrors.value = [];
  }

  function getStalePrices(thresholdMs: number = 60000): string[] {
    const now = Date.now();
    return Object.entries(prices.value)
      .filter(([_, price]) => !price.lastUpdate || now - price.lastUpdate > thresholdMs)
      .map(([symbol, _]) => symbol);
  }

  onMessage((data: { data: BinancePayload }) => {
    const payload = data.data;
    if (!payload || !payload.s) {
      console.warn("Received invalid payload:", payload);
      return;
    }

    if (validateBookTickerPayload(payload)) {
      parseBookTicker(payload);
    }

    if (validateTicker24hPayload(payload)) {
      parse24hTicker(payload);
    }
  });

  return {
    prices,
    connected,
    error,
    reconnectAttempts,
    isReconnecting,
    getConnectionStatus,
    parseErrors,
    clearParseErrors,
    getStalePrices,
  };
}
