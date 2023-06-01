import {DOM, domArrayToHtml, domToHtml} from 'helpers/dom'
import {header1, list, listItem} from 'helpers/generators'
import {markdownToHtml} from 'helpers/markdown'
import {validateNotes} from 'helpers/validate'

import {tryParseTime, toLogseqId, assertsLogseqNoteBlock} from './logseq-helpers'
import {logseqPropertiesToMarkdown} from './logseq-properties'
import {exportSchema} from './schema'
import {LogseqBlock, LogseqConversionError, LogseqExport, LogseqNote} from './types'
import {Convertor} from '../../convertor'
import {Backlink, ConvertedNote, ConvertOptions, ConvertResponse} from '../../types'

export class LogseqConvertor extends Convertor {
  static accept = {'application/json': ['.json']}
  static description = 'Logseq JSON'

  noteIds: Record<string, string> = {}

  async convert({data}: ConvertOptions): Promise<ConvertResponse> {
    const parsed: LogseqExport = JSON.parse(data)
    const validated = await exportSchema.parseAsync(parsed)

    // Create a map of page names to ids.  We use this for the link resolver and adding
    // ids to backlinks.
    this.noteIds = validated.blocks.reduce(
      (acc, note) => ({
        ...acc,
        [note['page-name']]: toLogseqId(note.id, note['page-name']),
      }),
      {},
    )

    // Convert all notes except for whiteboard pages
    const convertedNotes = validated.blocks.flatMap((note) => {
      if (note?.properties?.['ls-type'] === 'whiteboard-page') {
        return []
      }
      return [this.convertLogseqNote(note)]
    })

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
      id: toLogseqId(this.noteIds[b.label], b.label),
    }))

    return {
      id: toLogseqId(id, subject),
      html: domArrayToHtml([header1(subject), html]),
      subject,
      backlinks: updatedBacklinks,
      dailyAt: tryParseTime(subject),
    }
  }

  /**
   * Converts a list of logseq blocks into HTML.  This is a recursive through the
   * makeHtml function.  Each block is an li in a ul with the block's content in the
   * li.
   */
  private parseBlocks(blocks: LogseqBlock[]): {html: string; backlinks: Backlink[]} {
    const blockItems: DOM[] = []
    const backlinkCollection: Backlink[] = []

    // Get the HTML and backlinks for each block
    for (const block of blocks) {
      const {html, backlinks} = this.makeHtml(block)
      blockItems.push(listItem(html))
      backlinkCollection.push(...backlinks)
    }

    return {
      html: domToHtml(list(blockItems)),
      backlinks: backlinkCollection,
    }
  }

  /**
   * Converts a single logseq block's content into HTML.  This will recursively
   * call parseBlocks if the block has children.
   */
  private makeHtml(block: LogseqBlock): {html: string; backlinks: Backlink[]} {
    assertsLogseqNoteBlock(block)
    // Logseq supports markdown and org.  I think doing the org conversion will be
    // more difficult.  So I'm going to start with markdown.
    if (block.format !== 'markdown') {
      throw new LogseqConversionError(
        'Logseq importer is only able to import markdown blocks',
      )
    }

    // If the block has content then we use that.
    let blockContent = block.content
    // If a block does not have content then it might have properties and we'll
    // convert those properties to markdown.  In the case of frontmatter it will
    // have both.  But we will ignore the properties and just use the frontmatter
    // as markdown.
    if (!blockContent && block.properties) {
      blockContent = logseqPropertiesToMarkdown(block.properties, this.noteIds)
    }

    // Get the data for the current block
    let {html, backlinks} = markdownToHtml(blockContent || '', {
      graphId: this.graphId,
      linkHost: this.linkHost,
      pageResolver: (pageName) => toLogseqId(this.noteIds[pageName], pageName),
    })

    // If the block has children then we need to get the html for the children
    if (block.children.length) {
      const {html: childHtml, backlinks: childBacklinks} = this.parseBlocks(
        block.children,
      )
      // We just append the child html to this current block HTML
      html = domArrayToHtml([html, childHtml])
      backlinks = [...backlinks, ...childBacklinks]
    }

    return {
      html,
      backlinks,
    }
  }
}
