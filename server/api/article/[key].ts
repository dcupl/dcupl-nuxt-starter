import { useDcuplServerInstance } from "#dcupl/server";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  const dcupl = await useDcuplServerInstance(event);

  const article = key ? dcupl.query.one({ modelKey: "Article", itemKey: key }) : undefined;
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }
  return article;
});
