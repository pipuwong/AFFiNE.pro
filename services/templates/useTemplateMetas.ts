function getTags(templateMetas: TemplateContentFileMeta[]) {
  const tagsMap = new Map<string, number>();
  templateMetas.forEach((meta) => {
    meta.tags?.forEach((tag) => {
      if (tagsMap.has(tag)) {
        tagsMap.set(tag, tagsMap.get(tag)! + 1);
      } else {
        tagsMap.set(tag, 1);
      }
    });
  });
  return Array.from(tagsMap);
}

function getCates(templateMetas: TemplateContentFileMeta[]) {
  const catesMap = new Map<string, { slug: string, index: number }>();
  templateMetas.forEach((meta) => {
    const tag = meta.cateName || meta?.tags?.[0]
    if (tag) {
      catesMap.set(tag, { slug: meta.cateSlug, index: meta.cateIndex });
    }
  });
  return Array.from(catesMap, ([title, { slug, index }]) => ({ title, slug, index })).toSorted((a, b) => a.index - b.index);
}

export const useTemplateMetas = (
  templateMetas: TemplateContentFileMeta[],
  query?: { tag: string }
) => {
  const publishedMetas = templateMetas
    .filter(
      (meta) =>
        meta.publish &&
        // meta.cover &&
        meta.title &&
        meta.md &&
        meta.slug
    )
    .toSorted((a, b) => a.cateIndex - b.cateIndex)
    .toSorted((a, b) => a.index - b.index);

  const tags = getTags(publishedMetas);
  const cates = getCates(publishedMetas);
  let filteredMetas = query?.tag
    ? publishedMetas.filter(
      (meta) => meta.tags?.includes(query.tag) || meta.cateSlug === query.tag
    )
    : publishedMetas;

  const featuredMeta = filteredMetas.find((meta) => meta.featured) || filteredMetas[0];

  filteredMetas = filteredMetas.length > 3 ? filteredMetas.filter((meta) => meta.id !== featuredMeta.id) : filteredMetas;
  return {
    templateMetas: publishedMetas,
    tags,
    cates,
    featuredMeta,
    filteredMetas,
  };
};
