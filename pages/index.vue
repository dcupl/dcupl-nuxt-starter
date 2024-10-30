<template>
  <div class="container mx-auto pt-12">
    <div class="flex gap-5">
      <div class="w-56 flex flex-col flex-shrink-0 gap-3 px-3">
        <text-filter
          :attribute="'productName'"
          :list="articleList"
        ></text-filter>

        <select-filter
          :attribute="'category'"
          :list="articleList"
        ></select-filter>
      </div>
      <div class="w-full bg-white p-3 rounded-md shadow-lg">
        <div>
          <table class="my-0">
            <thead>
              <tr>
                <td>Id</td>
                <td>Name</td>
                <td>Category</td>
                <td>Price</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articles" :key="article.key">
                <td>
                  <NuxtLink :to="`/articles/${article.key}`">
                    {{ article.key }}
                  </NuxtLink>
                </td>

                <td>{{ article.productName }}</td>
                <td>{{ article.category }}</td>
                <td>{{ article.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div class="hidden sm:block">
            <p class="text-sm text-gray-700">
              <span class="font-medium"
                >{{ meta?.currentSize }} / {{ meta?.initialSize }}</span
              >
              results
            </p>
          </div>
          <div class="flex flex-1 justify-between sm:justify-end">
            <button
              @click="previous()"
              :disabled="isPreviousButtonDisabled()"
              class="relative inline-flex items-center disabled:opacity-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Previous
            </button>
            <button
              @click="next()"
              :disabled="isNextButtonDisabled()"
              class="relative ml-3 inline-flex items-center disabled:opacity-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ListMetadata } from "@dcupl/common";

const articles = ref<any>([]);
const meta = ref<ListMetadata | undefined>(undefined);

const dcupl = useDcupl();

// create a new list. A DcuplList contains all your model data and persists the applied queries.
const articleList = dcupl.lists.create({ modelKey: "Article" });

const setInitialQueryOptions = () => {
  articleList.catalog.query.applyOptions(
    {
      start: 0,
      count: 10,
      projection: { $: true, vendorId: { $: true } },
    },
    { skipProcessing: true }
  );
};

const next = () => {
  const currentStart = meta.value?.appliedQuery?.start || 0;
  const currentCount = meta.value?.appliedQuery?.count || 10;

  articleList.catalog.query.applyOptions({
    start: currentStart + currentCount,
  });
};

const previous = () => {
  const currentStart = meta.value?.appliedQuery?.start || 0;
  const currentCount = meta.value?.appliedQuery?.count || 10;

  articleList.catalog.query.applyOptions({
    start: currentStart - currentCount,
  });
};

const isPreviousButtonDisabled = () => {
  const currentStart = meta.value?.appliedQuery?.start || 0;
  return currentStart <= 0;
};

const isNextButtonDisabled = () => {
  const currentStart = meta.value?.appliedQuery?.start || 0;
  const currentCount = meta.value?.appliedQuery?.count || 10;
  const currentSize = meta.value?.currentSize || 0;
  return currentStart + currentCount >= currentSize;
};

const init = () => {
  setInitialQueryOptions();

  // get initial data
  articles.value = articleList.catalog.query.execute();
  meta.value = articleList.catalog.fn.metadata();
  // listen for updates to the list and update the articles
  articleList.on((msg) => {
    console.log(msg);
    if (msg.action === "update") {
      articles.value = articleList.catalog.query.execute();
      meta.value = articleList.catalog.fn.metadata();
    }
  });
};

init();

onBeforeUnmount(() => {
  // cleanup on unmount
  articleList.destroy();
});
</script>
<style lang=""></style>
