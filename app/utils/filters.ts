import type { DcuplList } from "@dcupl/core";
import { goToFirstPage } from "../composables/usePaging";

/** Keeps the items whose `attribute` contains `text`, ignoring case; empty text removes the filter. */
export function setTextFilter(list: DcuplList, attribute: string, text: string): void {
  goToFirstPage(list);
  if (!text) {
    list.catalog.query.removeGroup(attribute);
    return;
  }
  list.catalog.query.setCondition({
    attribute,
    operator: "find",
    value: `/${text}/`,
    options: { transform: ["lowercase"] },
  });
}

/** Keeps the items whose `attribute` equals `value`; an empty value removes the filter. */
export function setSelectFilter(list: DcuplList, attribute: string, value: string): void {
  goToFirstPage(list);
  if (!value) {
    list.catalog.query.removeGroup(attribute);
    return;
  }
  list.catalog.query.setCondition({ attribute, operator: "eq", value });
}
