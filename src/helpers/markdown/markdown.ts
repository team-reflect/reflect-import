import {gfmAutolinkLiteralFromMarkdown} from 'mdast-util-gfm-autolink-literal'
import {gfmAutolinkLiteral} from 'micromark-extension-gfm-autolink-literal'
import pipeToHtml from 'rehype-stringify'
import pipeToMarkdown from 'remark-parse'
import pipeToRehype from 'remark-rehype'
import wikiLinkPlugin from 'remark-wiki-link'
import {unified} from 'unified'

import {buildBacklinkUrl} from 'helpers/backlink'

import {toMarkdownNoteId} from './markdown-helpers'
import {hydrateBacklinks} from './plugins/hydrate-backlink-note-ids'
import {hydrateSubject} from './plugins/hydrate-subject'
import {parseTags} from './plugins/parse-tags'
import {type Backlink} from '../../types'

export const markdownToHtml = (
  content: string,
  options: {
    graphId: string
    linkHost: string
    constructsToDisable?: string[]
    pageResolver?: (pageName: string) => string
  },
) => {
  const {
    constructsToDisable = [],
    graphId,
    linkHost,
    pageResolver = toMarkdownNoteId,
  } = options

  const processor = unified()
    .data('micromarkExtensions', [
      gfmAutolinkLiteral(),
      {disable: {null: constructsToDisable}},
    ])
    .data('fromMarkdownExtensions', [gfmAutolinkLiteralFromMarkdown()])
    .use(pipeToMarkdown)
    .use(wikiLinkPlugin, {
      wikiLinkClassName: 'backlink',
      hrefTemplate: (permalink: string) => {
        return buildBacklinkUrl({
          ...options,
          noteId: pageResolver(permalink),
        })
      },
      pageResolver: (pageName: string) => {
        return [pageResolver(pageName)]
      },
    })
    .use(parseTags, {graphId, linkHost})
    .use(hydrateSubject)
    .use(pipeToRehype)
    .use(hydrateBacklinks, {graphId, linkHost})
    .use(pipeToHtml)
    .processSync(content)

  return {
    html: processor.toString(),
    subject: processor.data.subject as string | undefined,
    backlinks: processor.data.backlinks as Backlink[],
    tags: processor.data.tags as string[],
  }
}
