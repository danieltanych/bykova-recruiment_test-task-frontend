<script setup lang="ts">
import type { ICurrency } from "@/utils/types";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps<{
  currency: ICurrency;
  price: {
    bid: number;
    ask: number;
    bidQty: number;
    askQty: number;
    change24h?: number;
    prevBid?: number;
  };
}>();

const bidClass = computed(() =>
  [
    "text-gray-900 dark:text-gray-100",
    props.price.bid > props.price.prevBid ? "text-green-600 dark:text-green-400" : "",
    props.price.bid < props.price.prevBid ? "text-red-600 dark:text-red-400" : "",
  ].join(" ")
);

const askClass = computed(() => "text-gray-900 dark:text-gray-100");

const changeClass = computed(() =>
  [
    "text-gray-900 dark:text-gray-100",
    props.price.change24h > 0 ? "text-green-600 dark:text-green-400" : "",
    props.price.change24h < 0 ? "text-red-600 dark:text-red-400" : "",
  ].join(" ")
);

const formattedBid = computed(() => props.price.bid ?? "-");
const formattedAsk = computed(() => props.price.ask ?? "-");
const formattedChange = computed(() =>
  props.price.change24h !== undefined
    ? (props.price.change24h > 0 ? "+" : "") + props.price.change24h.toFixed(2) + "%"
    : "-"
);
</script>
<template>
  <li class="mb-2 flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <img :src="props.currency.icon" :alt="props.currency.label" class="h-5 w-5" />
      <span class="text-gray-900 dark:text-gray-100">{{ props.currency.label }}:</span>
      <transition name="flash-value" mode="out-in">
        <span class="font-mono text-base" :class="bidClass" :key="formattedBid">
          {{ formattedBid }}
        </span>
      </transition>
      <span class="text-xs text-gray-500 dark:text-gray-400">bid</span>
      <span class="mx-1 text-gray-900 dark:text-gray-100">/</span>
      <transition name="flash-value" mode="out-in">
        <span class="font-mono text-base" :class="askClass" :key="formattedAsk">
          {{ formattedAsk }}
        </span>
      </transition>
      <span class="text-xs text-gray-500 dark:text-gray-400">ask</span>
    </div>
    <div class="flex items-center gap-2 text-xs">
      <span class="text-gray-900 dark:text-gray-100">{{ t("24h Change") }}:</span>
      <transition name="flash-value" mode="out-in">
        <span :class="changeClass" :key="formattedChange">
          {{ formattedChange }}
        </span>
      </transition>
    </div>
  </li>
</template>
<style scoped>
.flash-value-enter-active,
.flash-value-leave-active {
  transition:
    background 0.5s,
    transform 0.5s;
}
.flash-value-enter-from {
  background: #fefcbf;
}
.dark .flash-value-enter-from {
  background: #1e293b;
}
.flash-value-enter-to {
  background: transparent;
  transform: scale(1);
}
</style>
