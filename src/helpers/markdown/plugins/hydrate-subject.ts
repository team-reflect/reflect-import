import {toString} from 'mdast-util-to-string'
import {Root} from 'mdast'
import {Plugin} from 'unified'

export const hydrateSubject: Plugin<[], Root> = () => {
  return (tree, file) => {
    const header = tree.children.find((node) => node.type === 'heading')

    // Try and parse out the subject from the first header
    if (header?.type === 'heading' && header.children.length) {
      const data = {subject: toString(header)}
      file.data = {...file.data, ...data}
    }
  }
}
