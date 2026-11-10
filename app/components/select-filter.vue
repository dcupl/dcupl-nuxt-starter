<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-black-700">
      {{ label }}
      <span class="font-normal text-black-600 tabular-nums">({{ options.length }})</span>
    </label>
    <select
      :id="inputId"
      v-model="selected"
      class="block h-9 w-full cursor-pointer rounded border-black-500 bg-white-50 py-0 pl-2.5 text-sm hover:border-black-50 focus:border-black-50 focus:ring-0"
      @change="updateFilter"
    >
      <option value="">All</option>
      <option v-for="option in options" :key="option.key" :value="option.key">
        {{ option.key }} ({{ option.size }})
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import type { DcuplFacet } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";
import { selectFilterOptions } from "~/utils/select-filter-options";

const inputId = useId();

const props = defineProps<{
  list: DcuplList;
  attribute: string;
  label: string;
}>();

const facets = ref<DcuplFacet[]>([]);
const selected = ref("");

// the selected value stays an option, with (0), when the other filters leave it no matches;
// otherwise the select would show "All" while its condition is still applied
const options = computed(() => selectFilterOptions(facets.value, selected.value));

const initFacets = () => {
  facets.value = props.list.catalog.fn.facets({
    attribute: props.attribute,
    excludeZeros: false,
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
