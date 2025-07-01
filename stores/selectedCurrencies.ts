import { defineStore } from "pinia";
import type { ICurrency } from "@/utils/types";

export const useSelectedCurrenciesStore = defineStore("selectedCurrencies", {
  state: () => ({
    selectedCurrencies: [] as ICurrency[],
    initialized: false,
  }),
  actions: {
    set(currencies: ICurrency[]) {
      this.selectedCurrencies = currencies;
      localStorage.setItem("selectedCurrencies", JSON.stringify(currencies));
    },
    loadFromStorage() {
      const data = localStorage.getItem("selectedCurrencies");
      if (data) {
        try {
          this.selectedCurrencies = JSON.parse(data);
        } catch (e) {
          this.selectedCurrencies = [];
        }
      }
      this.initialized = true;
    },
  },
});
