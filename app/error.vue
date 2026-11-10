<template>
  <div class="flex min-h-dvh flex-col">
    <Toolbar />
    <main class="flex-1">
      <div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-10 xl:px-12">
        <div class="max-w-xl rounded-xl border border-black-200 p-5 sm:p-6">
          <h1 class="text-xl font-semibold">{{ title }}</h1>
          <p class="mt-1 text-sm break-words text-black-600">{{ description }}</p>
          <button type="button" class="dcu-button dcu-button-black mt-5" @click="clearError({ redirect: '/' })">
            Back to articles
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const notFound = computed(() => props.error.statusCode === 404);
const title = computed(() => (notFound.value ? props.error.statusMessage || "Page not found" : "Something went wrong"));
const description = computed(() =>
  notFound.value
    ? "Error 404: there is nothing at this address. Check the article key, or go back to the list."
    : `Error ${props.error.statusCode}: ${props.error.message}`,
);
</script>
