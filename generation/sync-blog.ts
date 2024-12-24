import { instantiateReader, WorkspacePageContent } from "affine-reader/blog";
import fs from "fs-extra";
import stringify from "json-stable-stringify";

import path from "node:path";
import { rootDir } from "./utils";
import { loadContents, loadPageMetas, savePageMetas } from "./sync-utils";

const reader = instantiateReader({
  workspaceId: "qf73AF6vzWphbTJdN7KiX",
  target: "https://app.affine.pro",
});

declare module "affine-reader/blog" {
  interface WorkspacePageContent {
    layout?: string;
    updatedDate?: number;
  }

  interface WorkspacePage {
    updatedDate?: number;
  }
}

async function crawlBlogs() {
  const processed = new Map<string, { slug: string; title: string }>();
  const pages = await reader.getDocPageMetas();

  if (!pages) {
    throw new Error("No pages found");
  }

  const existingPageMetas = await loadPageMetas();
  const existingBlogMetas = await loadContents('blog');

  const visitedSlugs = new Set<string>();

  if (!pages) {
    throw new Error("No pages found");
  }

  for (const [idx, page] of pages.entries()) {
    if (page.trash || !page.title) {
      continue;
    }

    const existingPageMeta = existingPageMetas.find(meta => meta.id === page.id);
    const existingBlogMeta = Array.from(existingBlogMetas.values()).find(meta => meta.id === page.id);

    if (existingPageMeta && existingPageMeta.updatedDate === page.updatedDate) {
      if (existingBlogMeta?.slug) {
        visitedSlugs.add(existingBlogMeta.slug);
      }

      // skip the page that is not updated
      continue;
    }

    console.log(`Crawling "${page.title}" of ${idx}/${pages.length}`);

    const content = await reader.getWorkspacePageContent(page.guid);
    if (
      !content ||
      content.layout !== "blog" ||
      !content.publish ||
      !content.slug
    ) {
      continue;
    }
    content.slug = content.slug.replaceAll("/", "");
    processed.set(page.id, { slug: content.slug, title: page.title });

    const fileDist = path.join(
      rootDir,
      "content",
      "blog",
      content.slug.replaceAll("/", "") + ".json"
    );

    delete content.parsedBlocks;
    delete content.linkedPages;
    // @ts-ignore
    delete content.properties;

    visitedSlugs.add(content.slug);

    await fs.writeFile(fileDist, stringify(content, { space: "  " }));
    console.log(`Saved ${page.id}`);
  }

  // check if there are duplicate slugs and print the title + id
  // slug -> title + id
  const reversedProcessed = Array.from(processed.entries()).reduce(
    (acc, [id, meta]) => {
      acc[meta.slug] ??= [];
      acc[meta.slug].push({ title: meta.title, id });
      return acc;
    },
    {} as Record<string, { title: string; id: string }[]>
  );

  let hasDuplicate = false;
  for (const [slug, metas] of Object.entries(reversedProcessed)) {
    if (metas.length > 1) {
      console.log(
        `Duplicate slug: ${slug} - ${metas
          .map((m) => `${m.title} (${m.id})`)
          .join(", ")}`
      );
      hasDuplicate = true;
    }
  }

  if (hasDuplicate) {
    throw new Error("Duplicate slugs found");
  }


  for (const [id, meta] of existingBlogMetas.entries()) {
    // if the meta is not in the updatedBlogMeta or addedBlogMeta, it is deleted
    if (meta.slug && !visitedSlugs.has(meta.slug)) {
      console.log(`Deleting ${meta.title} (${id})`);
      await fs.unlink(path.join(rootDir, "content", "blog", meta.slug.replaceAll("/", "") + ".json"));
    }
  }

  await savePageMetas(pages);
}

async function main() {
  const start = Date.now();
  console.log("Sync Blog Start");

  await crawlBlogs();

  console.log(`Sync Blog Done in ${Date.now() - start}ms`);
}

main();
