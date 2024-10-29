<template>
  <div class="container mx-auto">
    <h3>Home Page</h3>

    <div class="flex gap-5">
      <div
        class="w-300 flex flex-col flex-shrink-0 gap-3 border-r border-gray-500 px-3"
      >
        <text-filter
          :attribute="'productName'"
          :list="articleList"
        ></text-filter>

        <select-filter
          :attribute="'category'"
          :list="articleList"
        ></select-filter>
      </div>
      <div class="w-full">
        <table>
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
    </div>
  </div>
</template>
<script setup lang="ts">
const articles = ref<any>([]);

const dcupl = useDcupl();

// create a new list. A DcuplList contains all your model data and persists the applied queries.
const articleList = dcupl.lists.create({ modelKey: "Article" });
articleList.catalog.query.applyOptions({ count: 10 });

// get initial data
articles.value = articleList.catalog.query.execute();

// listen for updates to the list and update the articles
articleList.on((msg) => {
  if (msg.action === "update") {
    articles.value = articleList.catalog.query.execute();
  }
});

onBeforeUnmount(() => {
  // cleanup on unmount
  articleList.destroy();
});
</script>
<style lang=""></style>
