<template>
  <header class="absolute right-5 top-5">
    <div class="flex w-full items-center justify-center gap-2">
      <SystemThemeSwitcher
        class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700"
      />
    </div>
  </header>
  <main
    class="flex min-h-64 w-full justify-center border-t-4 border-t-[#56CB82] bg-gradient-to-b from-[#D9F1DF] to-transparent dark:from-[#0D3335]"
  >
    <div class="container m-5 mt-10 max-w-4xl">
      <slot />
    </div>
  </main>
</template>
