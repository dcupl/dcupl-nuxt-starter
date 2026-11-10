<template>
  <div class="container mx-auto">
    <h2>Article {{ key }}</h2>
    <pre><code class="language-json">{{ JSON.stringify(article, null, 2) }}</code></pre>
  </div>
</template>
<script setup lang="ts">
const { key } = useRoute().params;

const dcupl = useDcupl();

const article = dcupl.query.one({
  modelKey: "Article",
  itemKey: key as string,
  projection: {
    $: true,
    vendorId: {
      $: true, // also returns the details of the referenced vendor model
    },
  },
});
</script>
<style lang=""></style>
