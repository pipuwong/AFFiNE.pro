import rehypePrism from 'rehype-prism-plus'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import rehypeSlug from 'rehype-slug'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'hast'

// Custom plugin to add loading="lazy" to images
const rehypeLazyLoading: Plugin<[], Root> = () => {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
      }
    })
  }
}

export async function renderHTML(md: string): Promise<string> {
  const html = (
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, {
        allowDangerousHtml: true
      })
      .use(rehypeRaw) // Add this to handle HTML elements
      .use(rehypeSlug, { prefix: 't' })
      .use(rehypeLazyLoading) // Add our custom plugin
      .use(rehypePrism)
      .use(rehypeStringify, {
        allowDangerousHtml: true
      })
      .process(md)
  ).toString()

  return html
}