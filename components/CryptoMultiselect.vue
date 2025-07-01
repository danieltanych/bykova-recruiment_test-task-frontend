<template>
  <div class="flex items-center gap-2">
    <span v-if="!loading" class="font-medium text-gray-800 dark:text-white">Choose</span>
    <div class="relative w-full min-w-[220px]">
      <div v-if="loading" class="flex items-center gap-2 px-4 py-2">
        <svg
          class="h-5 w-5 animate-spin text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span>Завантаження...</span>
      </div>
      <Multiselect
        v-else
        v-model="selected"
        :options="options"
        :multiple="true"
        placeholder="Оберіть..."
        class="min-w-[200px]"
        label="label"
        track-by="value"
      >
        <template #option="{ option }">
          <div class="flex items-center gap-2 text-gray-800 dark:text-white">
            <img :src="option.icon" :alt="option.label" class="h-4 w-4" />
            <span>{{ option.label }}</span>
          </div>
        </template>
        <template #tag="{ option, remove }">
          <span
            class="mb-1 mr-1 flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <img :src="option.icon" :alt="option.label" class="h-3 w-3" />
            <span>{{ option.label }}</span>
            <span
              class="ml-1 cursor-pointer text-green-600 hover:text-red-500"
              @click.stop="remove(option)"
              >&times;</span
            >
          </span>
        </template>
      </Multiselect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import type { ICurrency } from "@/utils/types";

const props = defineProps<{ options: ICurrency[]; loading?: boolean; modelValue: ICurrency[] }>();
const emit = defineEmits<{ (e: "update:modelValue", value: ICurrency[]): void }>();

const selected = ref<ICurrency[]>(props.modelValue);

watch(
  () => props.modelValue,
  (val: ICurrency[]) => {
    selected.value = val;
  }
);

watch(selected, (val: ICurrency[]) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
:deep(.multiselect) {
  @apply w-full min-w-[220px] rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-150 focus-within:ring-2 focus-within:ring-green-400 dark:border-slate-700 dark:bg-slate-800;
}
:deep(.multiselect__tags) {
  @apply flex min-h-[40px] flex-wrap gap-1 rounded-lg bg-transparent px-2 py-1;
}
:deep(.multiselect__tags-wrap) {
  @apply flex;
}
:deep(.multiselect__tag) {
  @apply mb-1 flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200;
}
:deep(.multiselect__tag-icon) {
  @apply ml-1 cursor-pointer text-green-600 hover:text-red-500;
}
:deep(.multiselect__input) {
  @apply border-none bg-transparent px-1 py-1 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-400;
}
:deep(.multiselect__placeholder) {
  @apply px-1 text-gray-400 dark:text-slate-400;
}
:deep(.multiselect__content-wrapper) {
  @apply z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800;
}
:deep(.multiselect__content) {
  @apply max-h-60 overflow-y-auto py-1;
}
:deep(.multiselect__option) {
  @apply cursor-pointer rounded px-4 py-2 text-gray-800 transition-colors hover:bg-green-100 dark:text-white dark:hover:bg-green-900;
}
:deep(.multiselect__option--highlight) {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}
:deep(.multiselect__option--selected) {
  @apply bg-green-50 font-semibold text-green-700 dark:bg-green-950 dark:text-green-200;
}
:deep(.multiselect__option--disabled) {
  @apply cursor-not-allowed text-gray-300 dark:text-slate-600;
}
:deep(.multiselect__spinner) {
  @apply ml-2 animate-spin text-green-500;
}
:deep(.multiselect__select) {
  @apply text-gray-400 transition-colors hover:text-green-500 dark:text-slate-400;
}
:deep(.multiselect__single) {
  @apply px-2 py-1 text-gray-900 dark:text-white;
}
</style>
