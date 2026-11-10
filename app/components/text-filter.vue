<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-dcu-black-700">
      {{ label }}
    </label>
    <input
      :id="inputId"
      type="text"
      autocomplete="off"
      class="block h-9 w-full rounded border-dcu-black-500 bg-dcu-white-50 px-2.5 text-base placeholder:text-dcu-black-600 hover:border-dcu-black-50 focus:border-dcu-black-50 focus:ring-0 sm:text-sm"
      placeholder="e.g.: Ball, Yoga, ..."
      @input="updateFilter"
    />
  </div>
</template>
<script setup lang="ts">
import type { DcuplList } from "@dcupl/core";
import { setTextFilter } from "~/utils/filters";

const props = defineProps<{
  list: DcuplList;
  attribute: string;
  label: string;
}>();

const inputId = useId();

const updateFilter = (event: Event): void => {
  setTextFilter(props.list, props.attribute, (event.target as HTMLInputElement).value);
};
</script>
