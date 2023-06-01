import {markdownToHtml} from 'helpers/markdown'
import {toDailyNoteId} from 'helpers/to-id'
import {validateNotes} from 'helpers/validate'

import {dailyDateFromFilename, filenameToId, filenameToSubject} from './markdown-helpers'
import {Convertor} from '../../convertor'
import {ConvertedNote, ConvertOptions, ConvertResponse} from '../../types'

export class MarkdownConvertor extends Convertor {
  static accept = {'text/markdown': ['.md']}
  static description = 'Markdown files'

  async convert({
    data,
    filename,
    lastModified,
  }: ConvertOptions & {filename: string}): Promise<ConvertResponse> {
    const {
      html,
      subject: markdownSubject,
      backlinks,
      tags,
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
      tags,
      updatedAt: lastModified,
    }

    return validateNotes([note])
  }
}
