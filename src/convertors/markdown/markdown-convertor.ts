import {markdownToHtml} from 'helpers/markdown'

import {
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'
import {dailyDateFromFilename, toMarkdownId} from './markdown-helpers'

export class MarkdownConvertor implements Convertor {
  graphId: string
  linkHost: string

  constructor({
    graphId,
    linkHost = REFLECT_HOSTNAME,
  }: {
    graphId: string
    linkHost?: string
  }) {
    this.graphId = graphId
    this.linkHost = linkHost
  }

  accept = {'text/markdown': ['.md']}

  convert({data, filename}: ConvertOptions & {filename: string}): ConvertResponse {
    const {html, subject, backlinks} = markdownToHtml(data, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    // Filename matches yyyy-MM-dd.md
    const dailyDate = dailyDateFromFilename(filename)

    const note: ConvertedNote = {
      id: toMarkdownId(filename),
      html,
      subject,
      dailyAt: dailyDate?.getTime(),
      backlinks,
    }

    return {notes: [note]}
  }
}
