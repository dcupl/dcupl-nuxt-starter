<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-black-700">
      {{ label }}
    </label>
    <input
      :id="inputId"
      type="text"
      autocomplete="off"
      class="block h-9 w-full rounded border-black-500 bg-white-50 px-2.5 text-sm placeholder:text-black-600 hover:border-black-50 focus:border-black-50 focus:ring-0"
      placeholder="e.g.: Ball, Yoga, ..."
      @input="updateFilter"
    />
  </div>
</template>
<script setup lang="ts">
import type { DcuplList } from "@dcupl/core";

const inputId = useId();

const props = defineProps<{
  list: DcuplList;
  attribute: string;
  label: string;
}>();

// filters while you type: every input event replaces this attribute's condition
const updateFilter = (event: Event) => {
  const filterValue = (event.target as HTMLInputElement).value;

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
        value: `/${filterValue}/`,
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
