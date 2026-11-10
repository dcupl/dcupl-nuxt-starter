<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-black-700">
      {{ label }}
      <span class="font-normal text-black-600 tabular-nums">({{ facets.length }})</span>
    </label>
    <select
      :id="inputId"
      class="block h-9 w-full cursor-pointer rounded border-black-500 bg-white-50 py-0 pl-2.5 text-sm hover:border-black-50 focus:border-black-50 focus:ring-0"
      @change="updateFilter"
    >
      <option value="">All</option>
      <option v-for="facet in facets" :key="facet.key" :value="facet.key">
        {{ facet.key }} ({{ facet.size }})
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import type { DcuplFacet } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";

const inputId = useId();

const props = defineProps<{
  list: DcuplList;
  attribute: string;
  label: string;
}>();

const facets = ref<DcuplFacet[]>([]);

const initFacets = () => {
  facets.value = props.list.catalog.fn.facets({
    attribute: props.attribute,
    excludeZeros: true,
  });
};

// the options are in the server-rendered HTML; the browser keeps them in sync with the other filters
initFacets();
onMounted(() => {
  props.list.on((msg) => {
    if (msg.action === "update") {
      initFacets();
    }
  });
});

const updateFilter = (event: Event) => {
  const filterValue = (event.target as HTMLSelectElement).value;

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
        value: filterValue,
      },
      {
        mode: "set",
      }
    );
  }
};
</script>
