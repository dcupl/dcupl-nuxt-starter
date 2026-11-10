import type { ListMetadata } from "@dcupl/common";
import type { DcuplList } from "@dcupl/core";
import { Dcupl } from "@dcupl/core";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePaging } from "../app/composables/usePaging";
import { setSelectFilter, setTextFilter } from "../app/utils/filters";
import { PAGE_SIZE } from "../app/utils/paging";

// A tiny stand-in for the console project's Article model, held in memory: no network needed.
const articles = [
  { key: "1", productName: "Basketball", category: "Team Sports", price: 25.99 },
  { key: "2", productName: "Soccer Ball", category: "Team Sports", price: 19.99 },
  { key: "3", productName: "Volleyball", category: "Team Sports", price: 22.5 },
  { key: "4", productName: "Hockey Stick", category: "Team Sports", price: 44.99 },
  { key: "5", productName: "Tennis Racket", category: "Tennis", price: 49.99 },
  { key: "6", productName: "Tennis Balls (3 pack)", category: "Tennis", price: 7.99 },
  { key: "7", productName: "Tennis Shoes", category: "Tennis", price: 69.99 },
  { key: "8", productName: "Running Shoes", category: "Running", price: 59.99 },
  { key: "9", productName: "Running Belt", category: "Running", price: 14.99 },
  { key: "10", productName: "Running Jacket", category: "Running", price: 79.99 },
  { key: "11", productName: "Water Bottle 0.5 l", category: "Running", price: 9.99 },
  { key: "12", productName: "Yoga Mat (6 mm)", category: "Yoga", price: 19.99 },
  { key: "13", productName: "Yoga Block", category: "Yoga", price: 9.99 },
  { key: "14", productName: "Yoga Strap", category: "Yoga", price: 6.99 },
  { key: "15", productName: "Meditation Cushion", category: "Yoga", price: 29.99 },
  { key: "16", productName: "Swimming Goggles", category: "Swimming", price: 14.99 },
  { key: "17", productName: "Swim Cap", category: "Swimming", price: 8.99 },
  { key: "18", productName: "Kickboard", category: "Swimming", price: 12.99 },
  { key: "19", productName: "Cycling Helmet", category: "Cycling", price: 29.99 },
  { key: "20", productName: "Bike Light", category: "Cycling", price: 18.99 },
  { key: "21", productName: "Cycling Gloves", category: "Cycling", price: 16.99 },
  { key: "22", productName: "Golf Clubs Set", category: "Golf", price: 249.99 },
  { key: "23", productName: "Golf Balls (12 pack)", category: "Golf", price: 24.99 },
  { key: "24", productName: "Boxing Gloves", category: "Boxing", price: 34.99 },
  { key: "25", productName: "Jump Rope 2.5 m", category: "Boxing", price: 11.99 },
];

let dcupl: Dcupl;

beforeAll(async () => {
  dcupl = new Dcupl();
  dcupl.models.set({
    key: "Article",
    properties: [
      { key: "productName", type: "string", filter: true },
      { key: "category", type: "string", filter: true },
      { key: "price", type: "float" },
    ],
  });
  dcupl.data.set(articles, { model: "Article" });
  await dcupl.init();
});

// the same set-up as app/pages/index.vue: a list, one page of results, and metadata that follows the result
let list: DcuplList;
let paging: ReturnType<typeof usePaging>;

beforeEach(() => {
  list = dcupl.lists.create({ modelKey: "Article" });
  list.catalog.query.applyOptions({ start: 0, count: PAGE_SIZE });
  const meta = ref<ListMetadata>(list.catalog.fn.metadata());
  list.onResultChange(() => {
    meta.value = list.catalog.fn.metadata();
  });
  paging = usePaging(list, meta);
});

afterEach(() => list.destroy());

const keys = (): string[] => list.catalog.query.items().map((article) => article.key);
const names = (): string[] => list.catalog.query.items().map((article) => article.productName);

describe("text filter", () => {
  it("finds the product names that contain the text, ignoring case", () => {
    setTextFilter(list, "productName", "yoga");
    expect(names()).toEqual(["Yoga Mat (6 mm)", "Yoga Block", "Yoga Strap"]);
  });

  it("matches ( and . literally instead of as regex syntax", () => {
    setTextFilter(list, "productName", "(");
    expect(names()).toEqual(["Tennis Balls (3 pack)", "Yoga Mat (6 mm)", "Golf Balls (12 pack)"]);

    setTextFilter(list, "productName", ".");
    expect(names()).toEqual(["Water Bottle 0.5 l", "Jump Rope 2.5 m"]);
  });

  it("removes its condition when the text is cleared", () => {
    setTextFilter(list, "productName", "yoga");
    setTextFilter(list, "productName", "");
    expect(list.catalog.fn.metadata().currentSize).toBe(25);
  });
});

describe("category filter", () => {
  it("keeps one category and combines with the text filter", () => {
    setSelectFilter(list, "category", "Tennis");
    expect(names()).toEqual(["Tennis Racket", "Tennis Balls (3 pack)", "Tennis Shoes"]);

    setTextFilter(list, "productName", "shoes");
    expect(names()).toEqual(["Tennis Shoes"]);

    setSelectFilter(list, "category", "");
    expect(names()).toEqual(["Tennis Shoes", "Running Shoes"]);
  });

  it("counts the items per category for the select's options", () => {
    setTextFilter(list, "productName", "ball");
    const facets = list.catalog.fn.facets({ attribute: "category", excludeZeros: false });
    const sizes = Object.fromEntries(facets.map((facet) => [facet.key, facet.size]));
    expect(sizes).toMatchObject({ "Team Sports": 3, Tennis: 1, Golf: 1, Yoga: 0 });
  });
});

describe("usePaging", () => {
  it("pages through the result PAGE_SIZE items at a time", () => {
    expect(keys()).toHaveLength(PAGE_SIZE);
    expect(paging.page.value).toBe(1);
    expect(paging.pageCount.value).toBe(3);
    expect(paging.previousDisabled.value).toBe(true);

    paging.next();
    expect(paging.page.value).toBe(2);
    expect(keys()[0]).toBe("11");

    paging.next();
    expect(keys()).toEqual(["21", "22", "23", "24", "25"]);
    expect(paging.nextDisabled.value).toBe(true);

    paging.previous();
    expect(paging.page.value).toBe(2);
    expect(paging.previousDisabled.value).toBe(false);
  });

  it("goes back to page 1 when a filter changes", () => {
    paging.next();
    paging.next();
    expect(paging.page.value).toBe(3);

    setSelectFilter(list, "category", "Running");
    expect(paging.page.value).toBe(1);
    expect(paging.pageCount.value).toBe(1);
    expect(names()).toEqual(["Running Shoes", "Running Belt", "Running Jacket", "Water Bottle 0.5 l"]);
  });
});
