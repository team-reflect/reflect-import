import {markdownToHtml} from 'helpers/markdown'
import {validateNotes} from 'helpers/validate'

import {tryParseDate} from './logseq-helpers'
import {LogseqBlock, LogseqConversionError, LogseqNote} from './types'
import {
  Backlink,
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'

export class LogseqConvertor implements Convertor {
  graphId: string
  linkHost: string
  noteIds: Record<string, string> = {}

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
    const parsed = JSON.parse(data)

    if (parsed.version !== 1) {
      throw new LogseqConversionError('Only able to convert Logseq file version 1')
    }

    const notes = parsed.blocks as LogseqNote[]
    // Create a map of page names to ids.  We use this for the link resolver and adding
    // ids to backlinks.
    this.noteIds = notes.reduce(
      (acc, note) => ({...acc, [note['page-name']]: note.id}),
      {},
    )

    const convertedNotes = notes.map((note) => this.convertLogseqNote(note))

    return validateNotes(convertedNotes)
  }

  /**
   * Converts an individual logseq note into a ConvertedNote.  A logseq note has
   * the page name and the blocks (children).  We convert all the children to HTML
   * and then add the page name as an H1 to the top of the note.
   */
  private convertLogseqNote(note: LogseqNote): ConvertedNote {
    const {id, children} = note
    const subject = note['page-name']

    // Get all the HTML and backlinks for the current note
    const {html, backlinks} = this.parseBlocks(children)
    // Update the backlinks with the note ids from the page name to id map
    const updatedBacklinks = backlinks.map((b) => ({
      label: b.label,
      id: this.noteIds[b.label],
    }))

    return {
      id,
      html: `<h1>${subject}</h1>${html}`,
      subject,
      backlinks: updatedBacklinks,
      dailyAt: tryParseDate(subject),
    }
  }

  /**
   * Converts a list of logseq blocks into HTML.  This is a recursive through the
   * makeHtml function.  Each block is an li in a ul with the block's content in the
   * li.
   */
  private parseBlocks(blocks: LogseqBlock[]): {html: string; backlinks: Backlink[]} {
    const blockHtmls: string[] = []
    const backlinkCollection: Backlink[] = []

    // Get the HTML and backlinks for each block
    for (const block of blocks) {
      const {html, backlinks} = this.makeHtml(block)
      blockHtmls.push(`<li>${html}</li>`)
      backlinkCollection.push(...backlinks)
    }

    return {
      html: `<ul>${blockHtmls.join('')}</ul>`,
      backlinks: backlinkCollection,
    }
  }

  /**
   * Converts a single logseq block's content into HTML.  This will recursively
   * call parseBlocks if the block has children.
   */
  private makeHtml(block: LogseqBlock): {html: string; backlinks: Backlink[]} {
    // Logseq supports markdown and org.  I think doing the org conversion will be
    // more difficult.  So I'm going to start with markdown.
    if (block.format !== 'markdown') {
      throw new LogseqConversionError(
        'Logseq importer is only able to import markdown blocks',
      )
    }

    // Get the data for the current block
    const {html, backlinks} = markdownToHtml(block.content, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      pageResolver: (pageName) => this.noteIds[pageName] ?? pageName,
    })

    // If the block has children then we need to get the html for the children
    let childHtml = ''
    let childBacklinks: Backlink[] = []
    if (block.children) {
      const childBlocks = this.parseBlocks(block.children)
      childHtml = childBlocks.html
      childBacklinks = childBlocks.backlinks
    }

    // We just append the child html to this current block HTML
    return {
      html: `${html}${childHtml}`,
      backlinks: [...backlinks, ...childBacklinks],
    }
  }
}
