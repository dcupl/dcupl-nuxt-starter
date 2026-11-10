<template>
  <div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-10 xl:px-12">
    <div class="mb-6 max-w-3xl sm:mb-8">
      <h1 class="text-xl font-semibold">Article Catalog</h1>
      <p class="mt-1 text-sm text-black-600">
        This starter loads data from a public dcupl starter project. Check it out at
        <a
          href="https://console.dcupl.com"
          target="_blank"
          rel="noopener"
          class="border-b border-current text-black-50 transition-colors hover:text-blue-300"
          >console.dcupl.com</a
        >. The server renders the first page with the dcupl instance its API routes use; after
        hydration the browser loads its own and filters on the client.
      </p>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
      <aside aria-labelledby="filters-title" class="overflow-hidden rounded-xl border border-black-200">
        <h2
          id="filters-title"
          class="flex h-14 items-center bg-black-100 px-4 text-xs tracking-[0.12em] text-black-700 uppercase sm:px-6"
        >
          Filters
        </h2>
        <div class="divide-y divide-black-200">
          <div class="p-4 sm:p-6">
            <text-filter attribute="productName" label="Product name" :list="articleList" />
          </div>
          <div class="p-4 sm:p-6">
            <select-filter attribute="category" label="Category" :list="articleList" />
          </div>
        </div>
      </aside>

      <section aria-labelledby="results-title" class="min-w-0 overflow-hidden rounded-xl border border-black-200">
        <div class="flex h-14 items-center justify-between gap-3 bg-black-100 px-4 sm:px-6">
          <h2 id="results-title" class="text-xs tracking-[0.12em] text-black-700 uppercase">Articles</h2>
          <p class="text-xs text-black-700 tabular-nums" aria-live="polite">
            <span class="font-semibold text-black-50">{{ meta.currentSize }}</span>
            / {{ meta.initialSize }} results
          </p>
        </div>

        <!-- the right edge fades out, so columns that continue off-card read as "scroll for more" -->
        <div
          v-if="articles.length"
          class="overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)] focus-visible:outline-offset-[-2px]! focus-visible:[mask-image:none]"
          role="region"
          aria-labelledby="results-title"
          tabindex="0"
        >
          <table class="w-max min-w-full border-separate border-spacing-0 text-base">
            <thead>
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.attribute"
                  scope="col"
                  class="border-b border-black-200 px-3 py-2.5 text-xs font-normal tracking-wide whitespace-nowrap text-black-600 first:pl-4 last:pr-10 sm:first:pl-6"
                  :class="column.numeric ? 'text-right' : 'text-left'"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="tabular-nums">
              <tr v-for="article in articles" :key="article.key" class="odd:bg-black-100">
                <td class="px-3 py-2 align-top first:pl-4 sm:first:pl-6">
                  <NuxtLink
                    :to="`/articles/${article.key}`"
                    class="border-b border-current transition-colors hover:text-blue-300"
                  >
                    {{ article.key }}
                  </NuxtLink>
                </td>
                <!-- from sm up, long values wrap at 300px like the console's fixed table cells -->
                <td class="px-3 py-2 align-top">
                  <div class="whitespace-nowrap sm:max-w-[300px] sm:whitespace-normal">{{ article.productName }}</div>
                </td>
                <td class="px-3 py-2 align-top">
                  <div class="whitespace-nowrap sm:max-w-[300px] sm:whitespace-normal">{{ article.category }}</div>
                </td>
                <td class="px-3 py-2 pr-10 text-right align-top whitespace-nowrap">{{ article.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-6 py-16 text-center">
          <p class="text-sm font-semibold">No articles match these filters</p>
          <p class="mt-1 text-sm text-black-600">Change the product name or the category.</p>
        </div>

        <nav
          aria-label="Pagination"
          class="flex items-center justify-between gap-3 border-t border-black-200 px-4 py-3 sm:px-6"
        >
          <p class="text-sm text-black-600 tabular-nums">
            Page <span class="font-semibold text-black-50">{{ page }}</span> of {{ pageCount }}
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              class="dcu-button dcu-button-outline pl-2"
              :disabled="previousDisabled"
              @click="previous"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" class="size-4 fill-none stroke-current stroke-[1.5]">
                <path d="M10 4 6 8l4 4" />
              </svg>
              Previous
            </button>
            <button
              type="button"
              class="dcu-button dcu-button-outline pr-2"
              :disabled="nextDisabled"
              @click="next"
            >
              Next
              <svg viewBox="0 0 16 16" aria-hidden="true" class="size-4 fill-none stroke-current stroke-[1.5]">
                <path d="m6 4 4 4-4 4" />
              </svg>
            </button>
          </div>
        </nav>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ListMetadata } from "@dcupl/common";
import { PAGE_SIZE, usePaging } from "~/composables/usePaging";

type Article = { key: string; productName: string; category: string; price: number };

const columns = [
  { attribute: "key", label: "Id" },
  { attribute: "productName", label: "Name" },
  { attribute: "category", label: "Category" },
  { attribute: "price", label: "Price", numeric: true },
];

const dcupl = useDcupl();

// a DcuplList holds the model's data and keeps the applied filters, sorting and paging
const articleList = dcupl.lists.create({ modelKey: "Article" });
articleList.catalog.query.applyOptions({
  start: 0,
  count: PAGE_SIZE,
  projection: { $: true, vendorId: { $: true } },
});

const articles = ref(articleList.catalog.query.items<Article>());
const meta = ref<ListMetadata>(articleList.catalog.fn.metadata());

// follow the list when filters or paging change
const stopFollowing = articleList.onResultChange(() => {
  articles.value = articleList.catalog.query.items<Article>();
  meta.value = articleList.catalog.fn.metadata();
});

const { page, pageCount, previousDisabled, nextDisabled, previous, next } = usePaging(articleList, meta);

// on the server the module destroys the list after the request
onBeforeUnmount(() => {
  stopFollowing();
  articleList.destroy();
});
</script>
