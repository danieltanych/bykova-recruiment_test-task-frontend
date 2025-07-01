<script setup lang="ts">
import type { ICurrency } from "@/utils/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  selected: ICurrency[];
  prices: Record<
    string,
    {
      bid: number;
      ask: number;
      bidQty: number;
      askQty: number;
      change24h?: number;
      prevBid?: number;
      lastUpdate?: number;
    }
  >;
  connected: boolean;
  wsError: string | null;
  reconnectAttempts?: number;
  isReconnecting?: boolean;
  parseErrors?: string[];
}>();
</script>
<template>
  <div>
    <div class="ws-status mb-2">
      <div
        v-if="!props.selected.length"
        class="inline-block rounded border border-gray-300 bg-gray-100 px-3 py-1 font-semibold text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
      >
        WebSocket status: not connected (no pairs selected)
      </div>
      <div
        v-else-if="props.isReconnecting"
        class="inline-block rounded border border-blue-400 bg-blue-100 px-3 py-1 font-semibold text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      >
        WebSocket status: reconnecting... (attempt {{ props.reconnectAttempts || 0 }})
      </div>
      <div
        v-else
        :class="
          props.connected
            ? 'border-green-400 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400'
            : 'border-yellow-400 bg-yellow-100 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
        "
        class="inline-block rounded border px-3 py-1 font-semibold"
      >
        WebSocket status: {{ props.connected ? "connected" : "disconnected" }}
        <span v-if="props.reconnectAttempts && props.reconnectAttempts > 0" class="ml-2 text-xs">
          ({{ props.reconnectAttempts }} reconnect attempts)
        </span>
      </div>
    </div>

    <div v-if="props.wsError" class="mb-2">
      <div
        class="inline-block rounded border border-red-400 bg-red-100 px-3 py-2 font-medium text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400"
      >
        <span class="font-semibold">Connection Error:</span> {{ props.wsError }}
      </div>
    </div>

    <div v-if="props.parseErrors && props.parseErrors.length > 0" class="mb-2">
      <div
        class="inline-block rounded border border-orange-400 bg-orange-100 px-3 py-2 font-medium text-orange-700 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
      >
        <span class="font-semibold">Parse Errors ({{ props.parseErrors.length }}):</span>
        <ul class="mt-1 text-sm">
          <li v-for="error in props.parseErrors.slice(0, 3)" :key="error" class="ml-2">
            {{ error }}
          </li>
          <li v-if="props.parseErrors.length > 3" class="ml-2 text-xs">
            ... and {{ props.parseErrors.length - 3 }} more
          </li>
        </ul>
      </div>
    </div>

    <div>
      <div v-if="props.selected.length" class="mt-4">
        <h3 class="mb-2 font-bold text-gray-900 dark:text-gray-100">
          {{ t("Current Information") }}
        </h3>
        <ul>
          <SelectedPairInfoItem
            v-for="currency in props.selected"
            :key="currency.value"
            :currency="currency"
            :price="props.prices[currency.value] || {}"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
