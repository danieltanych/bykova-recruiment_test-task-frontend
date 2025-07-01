<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useBinancePairs } from "@/composables/useBinancePairs";
import { onMounted, computed } from "vue";
import { useSelectedCurrenciesStore } from "~/stores/selectedCurrencies";
import type { ICurrency } from "@/utils/types";
import { useBinanceSocket } from "@/composables/useBinanceSocket";

const currenciesStore = useSelectedCurrenciesStore();
const { t } = useI18n();
const { pairs, loading, error, fetchPairs } = useBinancePairs();

onMounted(() => {
  currenciesStore.loadFromStorage();
  fetchPairs();
});

const isReady = computed(() => currenciesStore.initialized);

const selected = computed({
  get: () => currenciesStore.selectedCurrencies,
  set: (val: ICurrency[]) => currenciesStore.set(val),
});

const {
  prices,
  connected,
  error: wsError,
  reconnectAttempts,
  isReconnecting,
  parseErrors,
} = useBinanceSocket(selected);
</script>
<template>
  <div class="flex flex-col gap-4">
    <CryptoMultiselect :options="pairs" :loading="loading" v-model="selected" />
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <template v-if="isReady">
      <SelectedPairsInfo
        :selected="selected"
        :prices="prices"
        :connected="connected"
        :wsError="wsError"
        :reconnectAttempts="reconnectAttempts"
        :isReconnecting="isReconnecting"
        :parseErrors="parseErrors"
      />
    </template>
    <div v-else>Loading...</div>
  </div>
</template>
