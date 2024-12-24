import fs from "fs-extra";
import path from "node:path";
import { rootDir } from "./utils";
import { WorkspacePage, WorkspacePageContent } from "affine-reader/blog";

export async function loadContents(dir: 'blog' | 'templates') {
  const existingBlogMetas = new Map<string, WorkspacePageContent>();
  const files = await fs.readdir(path.join(rootDir, "content", dir));
  for (const file of files) {
    const content = await fs.readJson(path.join(rootDir, "content", dir, file), "utf8");
    existingBlogMetas.set(content.id, content);
  }
  return existingBlogMetas;
}

export async function loadPageMetas(): Promise<WorkspacePage[]> {
  try {
    const pageMetas = await fs.readJson(path.join(rootDir, "content", "page-metas.json"), "utf8");
    return pageMetas;
  } catch (e) {
    return [];
  }
}

export async function savePageMetas(pageMetas: WorkspacePage[]) {
  await fs.writeJson(path.join(rootDir, "content", "page-metas.json"), pageMetas, {
    spaces: "  ",
    encoding: "utf8",
  });
}
