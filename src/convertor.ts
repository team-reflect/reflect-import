import {EvernoteConvertor} from 'convertors/evernote'
import {HtmlConvertor} from 'convertors/html'
import {MarkdownConvertor} from 'convertors/markdown'
import {RoamConvertor} from 'convertors/roam'

export type ImportFormat = 'evernote' | 'markdown' | 'roam' | 'html'

export const getConvertorForFormat = ({
  graphId,
  format,
}: {
  graphId: string
  format: ImportFormat
}) => {
  switch (format) {
    case 'roam':
      return new RoamConvertor({graphId})
    case 'evernote':
      return new EvernoteConvertor({graphId})
    case 'markdown':
      return new MarkdownConvertor({graphId})
    case 'html':
      return new HtmlConvertor({graphId})
    default:
      throw new Error('Unknown import format')
  }
}
