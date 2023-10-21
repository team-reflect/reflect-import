import {type Root, type PhrasingContent} from 'mdast'
import {findAndReplace, type ReplaceFunction} from 'mdast-util-find-and-replace'
import {Plugin} from 'unified'

import {buildTagUrl} from '../../tag'

type ParseTagOptions = {
  graphId: string
  linkHost: string
}

// Don't match any URL reserved character https://en.wikipedia.org/wiki/URL_encoding
const TAG_REGEX = /#([^\s!#$&'"*+,\\/:;=?@%|(){}[\]<>]+)/giu

export const parseTags: Plugin<[ParseTagOptions], Root> = (options: ParseTagOptions) => {
  return (tree, file) => {
    const tags = new Set<string>()

    const replaceTag: ReplaceFunction = (value: string) => {
      value = value.toLocaleLowerCase()
      const tag = value.startsWith('#') ? value.slice(1) : null

      if (!tag) return false

      tags.add(tag)

      const url = buildTagUrl({graphId: options.graphId, linkHost: options.linkHost, tag})

      const node: PhrasingContent = {type: 'text', value}

      return {type: 'link', title: null, url, children: [node]}
    }

    findAndReplace(tree, [[TAG_REGEX, replaceTag]], {ignore: ['link', 'linkReference']})

    const data = {tags: Array.from(tags)}
    file.data = {...file.data, ...data}
  }
}
