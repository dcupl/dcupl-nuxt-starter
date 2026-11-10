import { escapeRegExp } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";
import { startAtFirstPage } from "./paging";

/**
 * Keeps the items whose `attribute` contains `text`, ignoring case; empty text removes the filter.
 * The text is escaped, so `(` or `.` match themselves instead of acting as regex syntax.
 */
export function setTextFilter(list: DcuplList, attribute: string, text: string): void {
  startAtFirstPage(list);
  if (!text) {
    list.catalog.query.removeGroup(attribute);
    return;
  }
  list.catalog.query.setCondition({
    attribute,
    operator: "find",
    value: `/${escapeRegExp(text)}/`,
    options: { transform: ["lowercase"] },
  });
}

/** Keeps the items whose `attribute` equals `value`; an empty value removes the filter. */
export function setSelectFilter(list: DcuplList, attribute: string, value: string): void {
  startAtFirstPage(list);
  if (!value) {
    list.catalog.query.removeGroup(attribute);
    return;
  }
  list.catalog.query.setCondition({ attribute, operator: "eq", value });
}
