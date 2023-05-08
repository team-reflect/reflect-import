import {LogseqConvertor} from 'convertors/logseq'
import {MemConvertor} from 'convertors/mem/mem-convertor'

import {EvernoteConvertor} from './convertors/evernote'
import {HtmlConvertor} from './convertors/html'
import {MarkdownConvertor} from './convertors/markdown'
import {OpmlConvertor} from './convertors/opml'
import {RoamConvertor} from './convertors/roam'
import {Convertor} from './types'

export type Format =
  | 'evernote'
  | 'html'
  | 'html'
  | 'logseq'
  | 'markdown'
  | 'mem'
  | 'opml'
  | 'roam'

export const getConvertorForFormat = ({
  graphId,
  format,
}: {
  graphId: string
  format: Format
}): Convertor => {
  switch (format) {
    case 'evernote':
      return new EvernoteConvertor()
    case 'html':
      return new HtmlConvertor()
    case 'logseq':
      return new LogseqConvertor({graphId})
    case 'markdown':
      return new MarkdownConvertor({graphId})
    case 'mem':
      return new MemConvertor({graphId})
    case 'opml':
      return new OpmlConvertor()
    case 'roam':
      return new RoamConvertor({graphId})
    default:
      throw new Error('Unknown import format')
  }
}
