<template>
  <div class="flex min-h-dvh flex-col">
    <Toolbar />
    <main class="flex-1">
      <div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-10 xl:px-12">
        <!-- 404: an unknown article key or address -->
        <div v-if="notFound" class="max-w-xl rounded-xl border border-black-200 p-5 sm:p-6">
          <h1 class="text-xl font-semibold">{{ error.statusMessage || "Page not found" }}</h1>
          <p class="mt-1 text-sm text-black-600">
            Error 404: there is nothing at this address.
            {{ articleNotFound ? "Check the article key, or go back to the list." : "Go back to the article list." }}
          </p>
          <button type="button" class="dcu-button dcu-button-black mt-5" @click="clearError({ redirect: '/' })">
            Back to articles
          </button>
        </div>

        <!-- anything else, for example the dcupl project could not be loaded -->
        <div v-else role="alert" class="max-w-xl rounded-xl border border-red-200 bg-red-100 p-5 sm:p-6">
          <h1 class="text-base font-semibold">Could not load data</h1>
          <p class="mt-1 text-sm break-words text-black-700">Error {{ error.statusCode }}: {{ error.message }}</p>
          <button type="button" class="dcu-button dcu-button-black mt-4" @click="reloadNuxtApp()">Retry</button>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const notFound = computed(() => props.error.statusCode === 404);
const articleNotFound = computed(() => props.error.statusMessage === "Article not found");
</script>
