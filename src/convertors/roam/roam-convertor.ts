import {zip} from 'lodash'
import first from 'lodash/first'

import {DOM, domArrayToHtml, domToHtml} from '../../helpers/dom'
import {header1, list, listItem, taskListItem} from '../../helpers/generators'
import {markdownToHtml} from '../../helpers/markdown'
import {ConvertOptions, Convertor, ConvertResponse, REFLECT_HOSTNAME} from '../../types'
import {
  extractBacklinks,
  parseDateFromSubject,
  parseNoteIdFromSubject,
  toRoamId,
  validateTime,
} from './roam-helpers'
import {RoamConversionError, RoamConvertedNote, RoamNote, RoamNoteString} from './types'

export class RoamConvertor implements Convertor {
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
    const roamNotes = JSON.parse(data) as RoamNote[]

    if (!Array.isArray(roamNotes)) {
      throw new RoamConversionError('Roam export must be an array of notes')
    }

    const notes = roamNotes.map((note) => this.convertRoamNote(note))

    return {notes}
  }

  private convertRoamNote(note: RoamNote): RoamConvertedNote {
    const {html, backlinkNoteIds} = this.extractHtmlAndBacklinks(note)

    const updated = note['edit-time']
    const minChildCreated = first(
      (note.children ?? []).map((child) => child['create-time']).sort(),
    )
    const titleDate = parseDateFromSubject(note.title)

    return {
      id: toRoamId(note.uid),
      html,
      subject: note.title,
      backlinkNoteIds,
      dailyAt: validateTime(titleDate?.getTime()),
      createdAt: validateTime(titleDate?.getTime() ?? minChildCreated),
      updatedAt: validateTime(updated),
    }
  }

  private extractHtmlAndBacklinks(note: RoamNote) {
    let dom = list()
    const aggregBacklinkNoteIds = new Set<string>()

    if (note.children) {
      const listItems: DOM[] = []

      for (const child of note.children) {
        const {html, backlinkNoteIds} = this.parseListItem(child)

        listItems.push(html)
        backlinkNoteIds.forEach((id) => aggregBacklinkNoteIds.add(id))
      }

      dom = list(listItems)
    }

    return {
      html: domArrayToHtml([header1(note.title), dom]),
      backlinkNoteIds: Array.from(aggregBacklinkNoteIds),
    }
  }

  private parseListItem(noteString: RoamNoteString, aggregNoteIds = new Set<string>()) {
    let string = this.convertRoamTagsToBacklinks(noteString.string?.trim() ?? '')

    let taskChecked: boolean | undefined

    string = string.replace(LINKED_TODO_UNFINISHED_STRING, TODO_UNFINISHED_STRING)
    string = string.replace(LINKED_TODO_FINISHED_STRING, TODO_FINISHED_STRING)

    if (string.startsWith(TODO_UNFINISHED_STRING)) {
      string = string.replace(TODO_UNFINISHED_STRING, '')
      taskChecked = false
    } else if (string.startsWith(TODO_FINISHED_STRING)) {
      string = string.replace(TODO_FINISHED_STRING, '')
      taskChecked = true
    }

    // Extract backlinks surrounded by [[ ]]
    const noteBacklinks = extractBacklinks(string)
    const noteRefs = noteString.refs?.map((ref) => ref.uid) ?? []

    // Associate backlinks with their refs
    const backlinksToRefs = Object.fromEntries(zip(noteBacklinks, noteRefs))

    const {html: itemContent, backlinkNoteIds} = markdownToHtml(string, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
      pageResolver: (pageName) => {
        return backlinksToRefs[pageName]
          ? toRoamId(backlinksToRefs[pageName])
          : parseNoteIdFromSubject(pageName)
      },
    })

    // Go through the backlinks extracted from the markdown and add them to the
    // aggregate list of backlinks
    backlinkNoteIds.forEach((id) => aggregNoteIds.add(id))

    let itemChildren: DOM = ''

    if (noteString.children) {
      const listItems = noteString.children.map((child) => {
        const {html} = this.parseListItem(child, aggregNoteIds)
        return html
      })
      itemChildren = list(listItems)
    }

    const dom =
      taskChecked === undefined
        ? listItem(domArrayToHtml([itemContent, itemChildren]))
        : taskListItem(domArrayToHtml([itemContent, itemChildren]), {
            checked: taskChecked,
          })

    return {
      html: domToHtml(dom),
      backlinkNoteIds: Array.from(aggregNoteIds),
    }
  }

  private convertRoamTagsToBacklinks(str: string) {
    return str.replace(/(^|\s)#\[\[/g, '$1[[').replace(/(^|\s)#([\w-]+)/g, '$1[[$2]]')
  }
}

const LINKED_TODO_UNFINISHED_STRING = '{{[[TODO]]}}'
const LINKED_TODO_FINISHED_STRING = '{{[[DONE]]}}'

const TODO_UNFINISHED_STRING = '{{TODO}}'
const TODO_FINISHED_STRING = '{{DONE}}'
