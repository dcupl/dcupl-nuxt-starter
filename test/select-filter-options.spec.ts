import { describe, expect, it } from "vitest";
import { selectFilterOptions } from "../app/utils/select-filter-options";

describe("selectFilterOptions", () => {
  const facets = [
    { key: "Ball", size: 3 },
    { key: "Shoes", size: 0 },
    { key: "Yoga", size: 2 },
  ];

  it("lists the values with matches when nothing is selected", () => {
    expect(selectFilterOptions(facets, "")).toEqual([
      { key: "Ball", size: 3 },
      { key: "Yoga", size: 2 },
    ]);
  });

  it("keeps the selected value in place with a count of 0 when the other filters leave it no matches", () => {
    expect(selectFilterOptions(facets, "Shoes")).toEqual([
      { key: "Ball", size: 3 },
      { key: "Shoes", size: 0 },
      { key: "Yoga", size: 2 },
    ]);
  });

  it("adds the selected value with a count of 0 when the facets leave it out entirely", () => {
    expect(selectFilterOptions([{ key: "Ball", size: 3 }], "Shoes")).toEqual([
      { key: "Ball", size: 3 },
      { key: "Shoes", size: 0 },
    ]);
  });
});
