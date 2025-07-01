<script setup lang="ts">
import { computed } from "vue";

enum ThemeColor {
  Light = "light",
  Dark = "dark",
}

enum ThemeIcon {
  Light = "ph:sun",
  Dark = "ph:moon",
}

const colorMode = useColorMode();

const isDark = computed(() => colorMode.preference === ThemeColor.Dark);

const toggleTheme = () => {
  colorMode.preference = isDark.value ? ThemeColor.Light : ThemeColor.Dark;
};

const iconName = computed(() => (isDark.value ? ThemeIcon.Dark : ThemeIcon.Light));
</script>

<template>
  <ClientOnly>
    <button
      v-bind="$attrs"
      class="flex h-10 w-10 cursor-pointer items-center justify-center"
      @click="toggleTheme"
      aria-label="Toggle color mode"
    >
      <Icon :name="iconName" size="24" />
    </button>
  </ClientOnly>
</template>
