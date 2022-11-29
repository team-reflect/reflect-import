import {EvernoteConvertor} from './convertors/evernote'
import {HtmlConvertor} from './convertors/html'
import {MarkdownConvertor} from './convertors/markdown'
import {OpmlConvertor} from './convertors/opml'
import {RoamConvertor} from './convertors/roam'
import {Convertor} from './types'

export type Format = 'evernote' | 'html' | 'markdown' | 'roam' | 'opml' | 'html'

export const getConvertorForFormat = ({
  graphId,
  format,
}: {
  graphId: string
  format: Format
}): Convertor => {
  switch (format) {
    case 'roam':
      return new RoamConvertor({graphId})
    case 'evernote':
      return new EvernoteConvertor()
    case 'markdown':
      return new MarkdownConvertor({graphId})
    case 'html':
      return new HtmlConvertor()
    case 'opml':
      return new OpmlConvertor()
    default:
      throw new Error('Unknown import format')
  }
}
