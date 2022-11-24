import 'urlpattern-polyfill'
import {visit} from 'unist-util-visit'
import {Root} from 'mdast'
import {Plugin} from 'unified'
import {buildBacklinkParser} from '../../../helpers/backlink'

type HydrateBacklinkNoteIdsOptions = {
  graphId: string
  linkHost: string
}
export const hydrateBacklinkNoteIds: Plugin<[HydrateBacklinkNoteIdsOptions], Root> = (
  options: HydrateBacklinkNoteIdsOptions,
) => {
  const backlinkMatcher = buildBacklinkParser(options)

  return (tree, file) => {
    const noteIds = new Set<string>()
    visit(tree, (node: any) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties.href) {
        const url = backlinkMatcher(node.properties.href)

        if (url) {
          noteIds.add(url)
        }
      }
    })

    const data = {backlinkNoteIds: Array.from(noteIds)}
    file.data = {...file.data, ...data}
  }
}
