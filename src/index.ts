import {HtmlConvertor} from 'convertors/html'
import {LogseqConvertor} from 'convertors/logseq'
import {MemConvertor} from 'convertors/mem/mem-convertor'
import {OpmlConvertor} from 'convertors/opml'

import {Convertor} from './convertor'
import {EvernoteConvertor} from './convertors/evernote'
import {MarkdownConvertor} from './convertors/markdown'
import {RoamConvertor} from './convertors/roam'

export * from './types'
export * from './convertor'
export * from './convertors/evernote'
export * from './convertors/markdown'
export * from './convertors/roam'

export type Format = 'evernote' | 'html' | 'logseq' | 'markdown' | 'mem' | 'opml' | 'roam'

export const convertors: Record<Format, typeof Convertor> = {
  evernote: EvernoteConvertor,
  html: HtmlConvertor,
  logseq: LogseqConvertor,
  markdown: MarkdownConvertor,
  mem: MemConvertor,
  opml: OpmlConvertor,
  roam: RoamConvertor,
}
