import 'urlpattern-polyfill'
import {visit} from 'unist-util-visit'
import {Root} from 'mdast'
import {Plugin} from 'unified'

type HydrateBacklinkNoteIdsOptions = {
  graphId: string
  linkHost: string
}
export const hydrateBacklinkNoteIds: Plugin<[HydrateBacklinkNoteIdsOptions], Root> = (
  options: HydrateBacklinkNoteIdsOptions,
) => {
  const backlinkMatcher = new URLPattern({
    protocol: 'http{s}?',
    hostname: options.linkHost,
    pathname: `/g/${options.graphId}/:noteId`,
  })

  return (tree, file) => {
    const noteIds = new Set<string>()
    visit(tree, (node: any) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties.href) {
        const match = backlinkMatcher.exec(node.properties.href)

        if (match && match.pathname.groups.noteId) {
          noteIds.add(match.pathname.groups.noteId)
        }
      }
    })

    const data = {backlinkNoteIds: Array.from(noteIds)}
    file.data = {...file.data, ...data}
  }
}
