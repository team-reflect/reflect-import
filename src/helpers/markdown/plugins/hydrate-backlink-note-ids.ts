import 'urlpattern-polyfill'
import {Root} from 'mdast'
import {toString} from 'mdast-util-to-string'
import {Plugin} from 'unified'
import {visit} from 'unist-util-visit'

import {buildBacklinkParser} from '../../../helpers/backlink'
import {Backlink} from '../../../types'

type HydrateBacklinkOptions = {
  graphId: string
  linkHost: string
}
export const hydrateBacklinks: Plugin<[HydrateBacklinkOptions], Root> = (
  options: HydrateBacklinkOptions,
) => {
  const backlinkMatcher = buildBacklinkParser(options)

  return (tree, file) => {
    const backlinks = new Set<Backlink>()

    visit(tree, (node: any) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties.href) {
        const noteId = backlinkMatcher(node.properties.href)

        if (noteId) {
          backlinks.add({
            id: noteId,
            label: toString(node),
          })
        }
      }
    })

    const data = {backlinks: Array.from(backlinks)}
    file.data = {...file.data, ...data}
  }
}
