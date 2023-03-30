import {markdownToHtml} from 'helpers/markdown'
import {toDailyNoteId} from 'helpers/to-id'
import {validateNotes} from 'helpers/validate'

import {dailyDateFromFilename, filenameToId, filenameToSubject} from './markdown-helpers'
import {
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'

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

  convert({
    data,
    filename,
    lastModified,
  }: ConvertOptions & {filename: string}): ConvertResponse {
    const {
      html,
      subject: markdownSubject,
      backlinks,
    } = markdownToHtml(data, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    // Filename matches yyyy-MM-dd.md
    const dailyDate = dailyDateFromFilename(filename)
    const id = dailyDate ? toDailyNoteId(dailyDate) : filenameToId(filename)

    const subject = markdownSubject || filenameToSubject(filename)

    const note: ConvertedNote = {
      id,
      html,
      subject,
      dailyAt: dailyDate?.getTime(),
      backlinks,
      updatedAt: lastModified,
    }

    return validateNotes([note])
  }
}
