import type { DcuplFacet } from "@dcupl/common";

export type SelectFilterOption = Pick<DcuplFacet, "key" | "size">;

/**
 * The options of a select filter: every value the other filters leave with
 * matches, plus the selected value even when it has none left. Without it the
 * selected option would drop out and the select would show "All" while its
 * condition is still applied.
 */
export function selectFilterOptions(facets: SelectFilterOption[], selected: string): SelectFilterOption[] {
  const options = facets
    .filter((facet) => facet.size > 0 || facet.key === selected)
    .map(({ key, size }) => ({ key, size }));

  if (selected && !options.some((option) => option.key === selected)) {
    options.push({ key: selected, size: 0 });
  }

  return options;
}
