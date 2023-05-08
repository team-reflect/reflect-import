import {z} from 'zod'

import {markdownToHtml} from 'helpers/markdown'
import {validateNotes} from 'helpers/validate'

import {backlinkToMemId, getDailyDate, parseTimestamp, toMemId} from './mem-helpers'
import {MemExport, MemExportNote} from './types'
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

  async convert({data}: ConvertOptions): Promise<ConvertResponse> {
    // 1. Parse JSON
    const exportNotes = await this.parse(data)

    // 2. Convert markdown to html
    const notes = exportNotes.map((note) => this.convertNote(note))

    return validateNotes(notes)
  }

  private convertNote(memNote: MemExportNote): ConvertedNote {
    const {
      html,
      backlinks: markdownBacklinks,
      tags: markdownTags,
    } = markdownToHtml(memNote.markdown, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      pageResolver: toMemId,
    })

    const dailyDate = getDailyDate(memNote)

    const updatedAt = parseTimestamp(memNote.updated)
    const createdAt = parseTimestamp(memNote.created)

    // Combine unique tags from markdown and mem
    const tags = [...new Set([...markdownTags, ...memNote.tags])]

    // Convert backlinks to mem ids
    const backlinks = markdownBacklinks.map(backlinkToMemId)

    const note: ConvertedNote = {
      id: toMemId(memNote.id),
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

  private noteSchema = z.object({
    id: z.string().min(1),
    title: z.string(),
    markdown: z.string(),
    tags: z.array(z.string()),
    created: z.string().min(1),
    updated: z.string().min(1),
  })

  private exportSchema = z.array(this.noteSchema)

  private parse(data: string) {
    const json = JSON.parse(data) as MemExport

    return this.exportSchema.parseAsync(json)
  }
}
