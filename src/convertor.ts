import {EvernoteConvertor} from './convertors/evernote'
import {HtmlConvertor} from './convertors/html'
import {MarkdownConvertor} from './convertors/markdown'
import {RoamConvertor} from './convertors/roam'
import {Convertor} from './types'

export type Format = 'evernote' | 'html' | 'markdown' | 'roam'

export const FORMATS: Format[] = ['evernote', 'html', 'markdown', 'roam']

export const FORMAT_LABELS: Record<Format, string> = {
  markdown: 'Markdown',
  html: 'HTML',
  evernote: 'Evernote ENEX',
  roam: 'Roam JSON',
}

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
      return new EvernoteConvertor({graphId})
    case 'markdown':
      return new MarkdownConvertor({graphId})
    case 'html':
      return new HtmlConvertor({graphId})
    default:
      throw new Error('Unknown import format')
  }
}
