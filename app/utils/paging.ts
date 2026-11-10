import type { DcuplList } from "@dcupl/core";

/** Items per page: the catalog applies it as the list's `count`. */
export const PAGE_SIZE = 10;

/**
 * Call before a filter changes the list's conditions: page 3 of the old result may not exist in the new one.
 * `skipProcessing` only stores `start`; the condition change right after it recomputes the result once, on page 1.
 */
export function startAtFirstPage(list: DcuplList): void {
  list.catalog.query.applyOptions({ start: 0 }, { skipProcessing: true });
}
