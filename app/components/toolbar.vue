<template>
  <header
    class="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-black-200 bg-white-50 pr-2 pl-4 sm:pr-4 sm:pl-6"
  >
    <NuxtLink to="/" class="-mx-1 flex min-w-0 items-center gap-2 rounded px-1">
      <img src="/dcupl-logo.svg" alt="" width="26" height="28" class="h-6 w-auto shrink-0" />
      <span class="truncate text-base font-semibold">dcupl Nuxt Starter</span>
    </NuxtLink>
    <nav aria-label="dcupl" class="flex shrink-0 items-center gap-1">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener"
        class="dcu-button dcu-button-clear px-2 text-sm sm:px-2.5"
      >
        {{ link.label }}
        <svg viewBox="0 0 16 16" aria-hidden="true" class="hidden size-3.5 fill-none stroke-current stroke-[1.5] sm:block">
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    </nav>
  </header>
</template>
<script setup lang="ts">
const links = [
  { label: "Console", href: "https://console.dcupl.com" },
  { label: "Docs", href: "https://docs.dcupl.com" },
];
</script>
