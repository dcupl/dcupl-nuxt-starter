<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-black-700">
      {{ label }}
      <span class="font-normal text-black-600 tabular-nums">({{ options.length }})</span>
    </label>
    <select
      :id="inputId"
      v-model="selected"
      class="block h-9 w-full cursor-pointer rounded border-black-500 bg-white-50 py-0 pl-2.5 text-base hover:border-black-50 focus:border-black-50 focus:ring-0 sm:text-sm"
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
import { setSelectFilter } from "~/utils/filters";
import { selectFilterOptions } from "~/utils/select-filter-options";

const props = defineProps<{
  list: DcuplList;
  attribute: string;
  label: string;
}>();

const inputId = useId();
const facets = ref<DcuplFacet[]>([]);
const selected = ref("");

// the selected value stays an option, with (0), when the other filters leave it no matches;
// otherwise the select would show "All" while its condition is still applied
const options = computed(() => selectFilterOptions(facets.value, selected.value));

const loadFacets = (): void => {
  facets.value = props.list.catalog.fn.facets({ attribute: props.attribute, excludeZeros: false });
};

// the options are in the server-rendered HTML; the browser keeps them in sync with the other filters
loadFacets();
let stopFollowing = (): void => {};
onMounted(() => {
  stopFollowing = props.list.onResultChange(loadFacets);
});
onBeforeUnmount(() => stopFollowing());

const updateFilter = (event: Event): void => {
  setSelectFilter(props.list, props.attribute, (event.target as HTMLSelectElement).value);
};
</script>
