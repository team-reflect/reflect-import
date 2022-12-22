import {first} from 'lodash-es'

import {assertString} from 'helpers/assert'

import {DOM, domArrayToHtml, domToHtml} from '../../helpers/dom'
import {header1, list, listItem, taskListItem} from '../../helpers/generators'
import {markdownToHtml} from '../../helpers/markdown'
import {Backlink, REFLECT_HOSTNAME} from '../../types'
import {RoamBacklinks} from './roam-backlinks'
import {
  convertBlockrefsToBacklinks,
  normalizeNoteString,
  parseDateFromSubject,
  toRoamId,
  validateTime,
} from './roam-helpers'
import {RoamConvertedNote, RoamNote, RoamNoteString} from './types'

// Private class for the RoamConvertor to use
export class RoamNoteConvertor {
  graphId: string
  linkHost: string
  note: RoamNote
  backlinks: RoamBacklinks

  constructor({
    graphId,
    note,
    backlinks,
    linkHost = REFLECT_HOSTNAME,
  }: {
    graphId: string
    note: RoamNote
    backlinks: RoamBacklinks
    linkHost?: string
  }) {
    this.graphId = graphId
    this.linkHost = linkHost
    this.note = note
    this.backlinks = backlinks
  }

  convert(): RoamConvertedNote {
    assertString(this.note.uid, 'Roam note must have a uid')

    const {html, backlinks} = this.extractHtmlAndBacklinks()

    const updated = this.note['edit-time']
    const minChildCreated = first(
      (this.note.children ?? []).map((child) => child['create-time']).sort(),
    )
    const titleDate = parseDateFromSubject(this.note.title)

    return {
      id: toRoamId(this.note.uid),
      html,
      subject: this.note.title,
      backlinks,
      dailyAt: validateTime(titleDate?.getTime()),
      createdAt: validateTime(titleDate?.getTime() ?? minChildCreated),
      updatedAt: validateTime(updated),
    }
  }

  private extractHtmlAndBacklinks() {
    let dom = list()
    const aggregBacklinkNoteIds = new Set<string>()

    if (this.note.children) {
      const listItems: DOM[] = []

      // Create a map of backlinks to noteIds which we can use to resolve the backlinks

      for (const child of this.note.children) {
        const {html, backlinkNoteIds} = this.parseListItem(child)

        listItems.push(html)
        backlinkNoteIds.forEach((id) => aggregBacklinkNoteIds.add(id))
      }

      dom = list(listItems)
    }

    const backlinks: Backlink[] = Array.from(aggregBacklinkNoteIds).map((id) => ({
      id,
      label: this.backlinks.getNoteTitle(id) ?? id,
    }))

    return {
      html: domArrayToHtml([header1(this.note.title), dom]),
      backlinks,
    }
  }

  private backlinkResolver(pageName: string) {
    return this.backlinks.getNoteId(pageName) ?? pageName
  }

  private parseListItem(
    noteString: RoamNoteString,
    aggregateBacklinkNoteIds = new Set<string>(),
  ) {
    let markdown = noteString.string

    // Convert ((blockrefs)) to [[backlinks]] (Reflect doesn't support blockrefs)
    markdown = convertBlockrefsToBacklinks(
      markdown,
      (blockRef) => this.backlinks.getNoteTitle(blockRef) ?? blockRef,
    )

    // Parse out todos and tags
    const {markdown: normalizedMarkdown, checked} = normalizeNoteString(markdown)

    // Generate the html
    const {html: itemContent, backlinks} = markdownToHtml(normalizedMarkdown, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
      pageResolver: (pageName) => this.backlinkResolver(pageName),
    })

    // Go through the backlinks extracted from the markdown and add them to the
    // aggregate list of backlinks
    backlinks.forEach((backlink) => aggregateBacklinkNoteIds.add(backlink.id))

    let itemChildren: DOM = ''

    if (noteString.children) {
      const listItems = noteString.children.map((child) => {
        const {html} = this.parseListItem(child, aggregateBacklinkNoteIds)
        return html
      })
      itemChildren = list(listItems)
    }

    const dom =
      checked === undefined
        ? listItem(domArrayToHtml([itemContent, itemChildren]))
        : taskListItem(domArrayToHtml([itemContent, itemChildren]), {
            checked,
          })

    return {
      html: domToHtml(dom),
      backlinkNoteIds: Array.from(aggregateBacklinkNoteIds),
    }
  }
}
