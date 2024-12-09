import { PATH } from '~/utils/constants';

export const getTemplateCateMeta = (meta: Omit<TemplateContentFileMeta, 'md'>) => {
  if (!meta) return;

  const title = meta.cateTitle
    ? meta.cateTitle + ' | AFFiNE'
    : 'Templates | AFFiNE';
  const desc =
    meta.description ||
    'There can be more than Notion and Miro. AFFiNE is a next-gen knowledge base that brings planning, sorting and creating all together.';
  const url = `${PATH.SHARE_HOST}/templates/category-${meta.cateSlug}`;
  const image = meta.cover + '.webp' || 'https://affine.pro/og.jpeg';

  return [
    { name: 'twitter:title', content: title },
    { name: 'twitter:url', content: url },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: image },

    { name: 'description', content: desc },

    { name: 'og:title', content: title },
    { name: 'og:url', content: url },
    { name: 'og:description', content: desc },
    { name: 'og:image', content: image },
  ];
};

export const getTemplateCateSchema = (meta: Omit<TemplateContentFileMeta, 'md'>) => {
  if (!meta) return {};

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Categories',
        item: 'https://affine.pro/templates/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: meta.cateName,
        item: `https://affine.pro/templates/category-${meta.cateSlug}/`,
      },
    ],
  };
};
