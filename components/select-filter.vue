<template lang="">
  <div class="w-full">
    <label class="block text-sm font-medium leading-6 text-gray-900">
      {{ attribute }}
    </label>
    <select
      class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
      @change="updateFilter"
    >
      <option value="">Choose {{ attribute }}</option>
      <option v-for="facet in facets" :value="facet.key" :key="facet.key">
        {{ facet.key }} - ({{ facet.size }})
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import type { DcuplFacet } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";

const props = defineProps<{
  list: DcuplList;
  attribute: string;
}>();

const facets = ref<DcuplFacet[]>([]);

onMounted(() => {
  init();
});

const init = () => {
  facets.value = props.list.catalog.fn.facets({
    attribute: props.attribute,
    excludeZeros: true,
  });
};

const updateFilter = (event: any) => {
  const filterValue = event.target.value;

  // reset paging
  props.list.catalog.query.applyOptions(
    {
      start: 0,
    },
    { skipProcessing: true }
  );

  if (!filterValue) {
    props.list.catalog.query.remove({ groupKey: props.attribute });
  } else {
    props.list.catalog.query.apply(
      {
        attribute: props.attribute,
        operator: "eq",
        value: `${event.target.value}`,
      },
      {
        mode: "set",
      }
    );
  }
};
</script>
<style lang=""></style>
