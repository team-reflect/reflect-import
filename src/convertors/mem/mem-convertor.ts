import {markdownToHtml} from 'helpers/markdown'
import {validateNotes} from 'helpers/validate'

import {getDailyDate, parseTimestamp} from './mem-helpers'
import {MemConversionError, MemExport, MemExportNote} from './types'
import {
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'

export class MemConvertor implements Convertor {
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

  accept = {'application/json': ['.json']}

  convert({data}: ConvertOptions): ConvertResponse {
    // 1. Parse JSON
    const exportNotes = this.parse(data)

    // 2. Convert markdown to html
    const notes = exportNotes.map((note) => this.convertNote(note))

    return validateNotes(notes)
  }

  private convertNote(memNote: MemExportNote): ConvertedNote {
    const {
      html,
      backlinks,
      tags: markdownTags,
    } = markdownToHtml(memNote.markdown, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    const dailyDate = getDailyDate(memNote)

    const updatedAt = parseTimestamp(memNote.updated)
    const createdAt = parseTimestamp(memNote.created)

    // Combine unique tags from markdown and mem
    const tags = [...new Set([...markdownTags, ...memNote.tags])]

    const note: ConvertedNote = {
      id: `mem-${memNote.id}`,
      html,
      subject: memNote.title,
      dailyAt: dailyDate?.getTime(),
      backlinks,
      tags,
      updatedAt: updatedAt?.getTime(),
      createdAt: createdAt?.getTime(),
    }

    return note
  }

  private parse(data: string) {
    const json = JSON.parse(data) as MemExport

    if (!Array.isArray(json)) {
      throw new MemConversionError('Expected array - format invalid')
    }

    for (const note of json) {
      if (typeof note.id !== 'string' || !note.id) {
        throw new MemConversionError('Note id must be a string')
      }

      if (typeof note.title !== 'string') {
        throw new MemConversionError('Note title must be a string')
      }

      if (typeof note.markdown !== 'string') {
        throw new MemConversionError('Note markdown must be a string')
      }

      if (!Array.isArray(note.tags)) {
        throw new MemConversionError('Note tags must be an array')
      }

      if (typeof note.created !== 'string') {
        throw new MemConversionError('Note created must be a string')
      }

      if (typeof note.updated !== 'string') {
        throw new MemConversionError('Note updated must be a string')
      }
    }

    return json
  }
}
