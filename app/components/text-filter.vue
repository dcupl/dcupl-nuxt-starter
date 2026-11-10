<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs font-semibold text-black-700">
      {{ label }}
    </label>
    <input
      :id="inputId"
      type="text"
      autocomplete="off"
      class="block h-9 w-full rounded border-black-500 bg-white-50 px-2.5 text-base placeholder:text-black-600 hover:border-black-50 focus:border-black-50 focus:ring-0 sm:text-sm"
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
