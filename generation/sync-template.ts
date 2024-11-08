import { instantiateReader } from "affine-reader/template";
import fs from "fs-extra";
import stringify from "json-stable-stringify";
import path from "node:path";

import { createHash } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { rootDir } from "./utils";

const reader = instantiateReader({
  workspaceId: "qf73AF6vzWphbTJdN7KiX",
  target: "https://app.affine.pro",
});

const clean = async () => {
  await fs.emptyDir(path.join(rootDir, "content", "templates"));
};

const R2_BUCKET = "affine-cdn";
const R2_PREFIX = "template-snapshots";

const uploadTemplateSnapshot = (() => {
  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  return async function upload(key: string, buffer: Buffer) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: `${R2_PREFIX}/${key}.zip`,
      Body: buffer,
      ContentType: "application/zip",
    });
    await r2.send(command);
  };
})();

async function crawlTemplates() {
  const processed = new Map<string, { slug: string; title: string }>();
  const pages = await reader.getDocPageMetas();

  if (!pages) {
    throw new Error("No pages found");
  }

  await fs.ensureDir(path.join(rootDir, "public", "templates", "snapshots"));

  console.log("crawling templates...");

  const templateList = await reader.getTemplateList();

  if (!templateList) {
    throw new Error("No template list found");
  }

  const { categories } = templateList;

  for (const category of categories) {
    for (const [index, template] of category.list.entries()) {
      if (!template.templateId || !template.slug) {
        console.log(`no templateId for ${template.id}`);
        continue;
      }
      // @ts-ignore
      delete template.properties;
      delete template.parsedBlocks;
      delete template.linkedPages;

      const zip = await reader.getDocSnapshot(template.templateId);
      if (!zip) {
        console.log(`no snapshot for ${template.templateId}`);
        continue;
      }
      const buffer = Buffer.from(await zip.arrayBuffer());

      const featured = index === 0;

      const hash = createHash("sha256")
        .update(template.updated?.toString() || "")
        .digest("hex")
        .slice(0, 8);
      const snapshotUrl = `https://cdn.affine.pro/${R2_PREFIX}/${template.templateId}.${hash}.zip`;

      const params = new URLSearchParams({
        workspaceId: reader.workspaceId,
        docId: template.templateId,
        pageId: template.id, // deprecated
        name: template.title || template.id,
        mode: template.templateMode || "page",
        snapshotUrl,
      });

      template.slug = template.slug.replaceAll("/", "");
      processed.set(template.templateId, {
        slug: template.slug,
        title: template.title || "",
      });

      const t = {
        ...template,
        featured,
        cateTitle: category.title,
        cateName: category.category,
        cateSlug: category.slug,
        intro: featured ? category.description : undefined,
        useTemplateUrl: `https://app.affine.pro/template/import?${params.toString()}`,
        previewUrl: `https://app.affine.pro/template/preview?${params.toString()}`,
      };

      console.log(`uploading ${template.templateId}.${hash} to ${R2_BUCKET}`);

      await uploadTemplateSnapshot(`${template.templateId}.${hash}`, buffer);
      await fs.writeFile(
        path.join(rootDir, "content", "templates", `${template.slug}.json`),
        stringify(t, { space: "  " })
      );
      console.log(`saved ${template.slug}`);
    }
  }

  // check if there are duplicate slugs
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
}

async function main() {
  console.log("Sync Template Start");
  await clean();
  await crawlTemplates();
  console.log("Sync Template Done");
  process.exit(0);
}

main();
