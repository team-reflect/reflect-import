import {EvernoteConvertor} from './convertors/evernote'
import {HtmlConvertor} from './convertors/html'
import {LogseqConvertor} from './convertors/logseq'
import {MarkdownConvertor} from './convertors/markdown'
import {MemConvertor} from './convertors/mem/mem-convertor'
import {OpmlConvertor} from './convertors/opml'
import {RoamConvertor} from './convertors/roam'

export * from './types'
export * from './convertor'
export * from './convertors/evernote'
export * from './convertors/markdown'
export * from './convertors/roam'

export type Format = 'evernote' | 'html' | 'logseq' | 'markdown' | 'mem' | 'opml' | 'roam'

export const convertors = {
  evernote: EvernoteConvertor,
  html: HtmlConvertor,
  logseq: LogseqConvertor,
  markdown: MarkdownConvertor,
  mem: MemConvertor,
  opml: OpmlConvertor,
  roam: RoamConvertor,
}

// Returns something like:
// {
//   "evernote": [
//     {
//       "description": "Evernote ENEX",
//       "accept": {
//         "application/enex": [
//           ".enex"
//         ]
//       }
//     }
//   ],
export const convertorTypes: Record<Format, FilePickerAcceptType[]> = Object.entries(
  convertors,
).reduce((acc, [key, convertor]) => {
  const instance = new convertor({graphId: 'test'})

  return {
    ...acc,
    [key as Format]: [{description: instance.description, accept: instance.accept}],
  }
}, {} as Record<Format, FilePickerAcceptType[]>)
