import type { ListMetadata } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";
import { computed, type Ref } from "vue";
import { PAGE_SIZE } from "../utils/paging";

/** Previous/next paging over a list, read from the `start` and `count` the list's query applies. */
export function usePaging(list: DcuplList, meta: Ref<ListMetadata>) {
  const start = computed(() => meta.value.appliedQuery.start ?? 0);
  const count = computed(() => meta.value.appliedQuery.count ?? PAGE_SIZE);

  const page = computed(() => Math.floor(start.value / count.value) + 1);
  const pageCount = computed(() => Math.max(1, Math.ceil(meta.value.currentSize / count.value)));
  const previousDisabled = computed(() => start.value <= 0);
  const nextDisabled = computed(() => start.value + count.value >= meta.value.currentSize);

  const previous = (): void => {
    list.catalog.query.applyOptions({ start: start.value - count.value });
  };
  const next = (): void => {
    list.catalog.query.applyOptions({ start: start.value + count.value });
  };

  return { start, count, page, pageCount, previousDisabled, nextDisabled, previous, next };
}
