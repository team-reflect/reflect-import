import {gfmAutolinkLiteralFromMarkdown} from 'mdast-util-gfm-autolink-literal'
import {gfmAutolinkLiteral} from 'micromark-extension-gfm-autolink-literal'
import html from 'rehype-stringify'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import wikiLinkPlugin from 'remark-wiki-link'
import {unified} from 'unified'
import {buildBacklinkUrl} from '../../helpers/backlink'

import {parseNoteIdSubject} from './roam-helpers'

export const roamMarkdownToHtml = (
  content: string,
  options: {graphId: string; linkHost: string},
) => {
  // Disable certain constructs from Micromark.
  // All constructs: https://github.com/micromark/micromark/blob/116bfa56b90b6bbc1facddfd0886a7e127a6b03f/packages/micromark-core-commonmark/dev/index.js
  // Related discussion: https://github.com/micromark/micromark/discussions/63
  const constructsToDisable = ['thematicBreak', 'list', 'headingAtx']

  const processor = unified()
    .data('micromarkExtensions', [
      gfmAutolinkLiteral,
      {disable: {null: constructsToDisable}},
    ])
    .data('fromMarkdownExtensions', [gfmAutolinkLiteralFromMarkdown])
    .use(markdown)
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
    .use(remark2rehype)
    .use(html)
    .processSync(content)

  return processor.toString()
}
