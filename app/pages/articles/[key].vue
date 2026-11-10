<template>
  <div class="container mx-auto">
    <h2>Article {{ route.params.key }}</h2>
    <pre><code class="language-json">{{ JSON.stringify(article, null, 2) }}</code></pre>
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
  throw createError({ ...notFound, fatal: true });
}
watch(article, (value) => {
  if (!value) showError(notFound);
});
</script>
