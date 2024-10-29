import { useDcuplServerInstance } from "#dcupl/server";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");

  const dcupl = await useDcuplServerInstance(event);

  return dcupl.query.one({
    modelKey: "Article",
    itemKey: key!,
  });
});
