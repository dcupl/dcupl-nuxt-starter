<template lang="">
  <div>
    <label class="block text-sm font-medium leading-6 text-gray-900">
      {{ attribute }}
    </label>
    <div>
      <input
        type="text"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="ball"
        @keyup="updateFilter"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DcuplList } from "@dcupl/core";

const props = defineProps<{
  list: DcuplList;
  attribute: string;
}>();

const updateFilter = (event: any) => {
  const filterValue = event.target.value;

  // reset paging
  props.list.catalog.query.applyOptions(
    {
      start: 0,
    },
    { skipProcessing: true }
  );

  if (filterValue.length === 0) {
    props.list.catalog.query.remove({ groupKey: props.attribute });
  } else {
    props.list.catalog.query.apply(
      {
        attribute: props.attribute,
        operator: "find",
        value: `/${event.target.value}/`,
        options: {
          transform: ["lowercase"],
        },
      },
      {
        mode: "set",
      }
    );
  }
};
</script>
<style lang=""></style>
