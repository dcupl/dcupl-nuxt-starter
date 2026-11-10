<template>
  <div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-10 xl:px-12">
    <NuxtLink to="/" class="dcu-button dcu-button-clear mb-4 -ml-2 pr-2.5 pl-1 text-sm">
      <svg viewBox="0 0 16 16" aria-hidden="true" class="size-4 fill-none stroke-current stroke-[1.5]">
        <path d="M10 4 6 8l4 4" />
      </svg>
      All articles
    </NuxtLink>

    <div class="mb-6 max-w-3xl sm:mb-8">
      <h1 class="text-xl font-semibold">Article {{ route.params.key }}</h1>
      <p class="mt-1 text-sm text-dcu-black-600">
        What <code class="font-mono text-[0.8125rem] text-dcu-black-50">dcupl.query.one()</code> returns for this
        key, with the referenced vendor resolved. The API route serves the article without the vendor
        details at
        <a
          :href="`/api/article/${route.params.key}`"
          class="border-b border-current text-dcu-black-50 transition-colors hover:text-dcu-blue-300"
          >/api/article/{{ route.params.key }}</a
        >.
      </p>
    </div>

    <section aria-labelledby="article-title" class="dcu-panel max-w-3xl">
      <div class="dcu-panel-header">
        <h2 id="article-title" class="tracking-[0.12em] uppercase">Article</h2>
        <p class="truncate">{{ article?.productName }}</p>
      </div>
      <pre
        class="dcu-scroll-x p-4 pr-10 font-mono text-sm leading-6 sm:p-6 sm:pr-10"
        role="region"
        aria-labelledby="article-title"
        tabindex="0"
      ><code>{{ JSON.stringify(article, null, 2) }}</code></pre>
    </section>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();

const dcupl = useDcupl();

const article = computed(() =>
  dcupl.query.one({
    modelKey: "Article",
    itemKey: String(route.params.key),
    projection: {
      $: true,
      vendorId: {
        $: true, // also returns the details of the referenced vendor model
      },
    },
  }),
);

const notFound = { statusCode: 404, statusMessage: "Article not found" };
if (!article.value) {
  throw createError({ ...notFound, fatal: import.meta.client });
}
watch(article, (value) => {
  if (!value) showError(notFound);
});
</script>
