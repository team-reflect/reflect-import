import remarkFrontmatter from 'remark-frontmatter'
import {gfmAutolinkLiteralFromMarkdown} from 'mdast-util-gfm-autolink-literal'
import {gfmAutolinkLiteral} from 'micromark-extension-gfm-autolink-literal'
import pipeToHtml from 'rehype-stringify'
import pipeToMarkdown from 'remark-parse'
import pipeToRehype from 'remark-rehype'
import wikiLinkPlugin from 'remark-wiki-link'
import {unified} from 'unified'
import {buildBacklinkUrl} from './backlink'
import {parseNoteIdSubject} from '../convertors/roam/roam-helpers'
import {load as loadYaml} from 'js-yaml'

export const markdownToHtml = (
  content: string,
  options: {graphId: string; linkHost: string; constructsToDisable?: string[]},
) => {
  const {constructsToDisable = []} = options

  const processor = unified()
    .data('micromarkExtensions', [
      gfmAutolinkLiteral,
      {disable: {null: constructsToDisable}},
    ])
    .data('fromMarkdownExtensions', [gfmAutolinkLiteralFromMarkdown])
    .use(pipeToMarkdown)
    .use(wikiLinkPlugin, {
      wikiLinkClassName: 'backlink',
      hrefTemplate: (link: string) => {
        // This helper is only used to convert Markdown -> HTML -> ProseMirror.
        // So the real values of linkHost and graphId are not important, it will
        // ultimately be lost anyway.
        return buildBacklinkUrl({
          ...options,
          noteId: parseNoteIdSubject(link),
        })
      },
      pageResolver: (name: string) => {
        // This is called whenever we're trying to resolve target page name such
        // as [[another note]]. We use the same helper here as when we import
        // Roam notes. The resulting page ID in this case is `anothernote`
        return [parseNoteIdSubject(name)]
      },
    })
    .use(remarkFrontmatter, ['yaml'])
    .use(() => {
      return (tree, file) => {
        const frontMatter = tree.children.find((node) => node.type === 'yaml') as any

        if (frontMatter?.value) {
          const data = loadYaml(frontMatter.value) as any
          file.data = {...file.data, ...data}
        }
      }
    })
    .use(pipeToRehype)
    .use(pipeToHtml)
    .processSync(content)

  return {
    html: processor.toString(),
    data: processor.data,
  }
}
