import { ref, watch, onUnmounted } from "vue";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/stream";
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;
const HEARTBEAT_INTERVAL = 30000;

export function useBinanceWebSocketCore(streams: () => string[]) {
  const connected = ref(false);
  const error = ref<string | null>(null);
  const reconnectAttempts = ref(0);
  const isReconnecting = ref(false);

  let ws: WebSocket | null = null;
  let onMessageHandler: ((data: any) => void) | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let heartbeatTimer: NodeJS.Timeout | null = null;
  let lastHeartbeat = Date.now();

  function clearTimers() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function startHeartbeat() {
    heartbeatTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ method: "ping" }));
        lastHeartbeat = Date.now();
      }
    }, HEARTBEAT_INTERVAL);
  }

  function validateStreams(streamList: string[]): boolean {
    if (!Array.isArray(streamList)) return false;
    if (streamList.length === 0) return true;

    const validStreamTypes = ["bookTicker", "ticker", "miniTicker", "depth", "kline"];
    return streamList.every((stream) => {
      const parts = stream.split("@");
      return parts.length === 2 && parts[0].length > 0 && validStreamTypes.includes(parts[1]);
    });
  }

  function connect() {
    disconnect();

    const streamList = streams();
    if (!validateStreams(streamList)) {
      error.value = "Invalid stream format";
      return;
    }

    if (!streamList.length) {
      connected.value = false;
      error.value = null;
      return;
    }

    try {
      const streamParam = streamList.join("/");
      const url = `${BINANCE_WS_URL}?streams=${streamParam}`;

      ws = new WebSocket(url);

      ws.onopen = () => {
        connected.value = true;
        error.value = null;
        reconnectAttempts.value = 0;
        isReconnecting.value = false;
        startHeartbeat();
        console.log("WebSocket connected to Binance");
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        error.value = "WebSocket connection error";
        connected.value = false;
      };

      ws.onclose = (event) => {
        connected.value = false;
        clearTimers();

        console.log("WebSocket closed:", event.code, event.reason);

        if (event.code === 1000 || event.code === 1001) {
          return;
        }

        if (streamList.length > 0 && reconnectAttempts.value < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        } else if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
          error.value = `Failed to reconnect after ${MAX_RECONNECT_ATTEMPTS} attempts`;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.pong) {
            lastHeartbeat = Date.now();
            return;
          }

          if (onMessageHandler) {
            onMessageHandler(data);
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
          error.value = "Failed to parse incoming data";
        }
      };
    } catch (e) {
      console.error("Failed to create WebSocket connection:", e);
      error.value = "Failed to establish connection";
      connected.value = false;
    }
  }

  function scheduleReconnect() {
    if (isReconnecting.value) return;

    isReconnecting.value = true;
    reconnectAttempts.value++;

    const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts.value - 1), 30000);

    console.log(`Scheduling reconnect attempt ${reconnectAttempts.value} in ${delay}ms`);

    reconnectTimer = setTimeout(() => {
      isReconnecting.value = false;
      connect();
    }, delay);
  }

  function disconnect() {
    clearTimers();

    if (ws) {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, "Normal closure");
      }
      ws = null;
    }

    connected.value = false;
    isReconnecting.value = false;
  }

  function onMessage(cb: (data: any) => void) {
    onMessageHandler = cb;
  }

  function reconnect() {
    reconnectAttempts.value = 0;
    connect();
  }

  function getConnectionStatus() {
    if (!ws) return "disconnected";
    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }

  watch(
    streams,
    (newVal, oldVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        console.log("Streams changed, reconnecting...");
        reconnect();
      }
    },
    { immediate: true, deep: true }
  );

  onUnmounted(() => {
    disconnect();
  });

  return {
    connected,
    error,
    onMessage,
    reconnect,
    reconnectAttempts,
    isReconnecting,
    getConnectionStatus,
  };
}
