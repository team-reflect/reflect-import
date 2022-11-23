import {DOM, domArrayToHtml, domToHtml} from '../../helpers/dom'
import {header1, list, listItem, taskListItem} from '../../helpers/generators'
import {Convertor, REFLECT_HOSTNAME} from '../../types'
import {markdownToHtml} from '../../helpers/markdown/markdown'
import {RoamNote, RoamNoteString} from './types'

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

  toHtml(json: string): string {
    const {html} = this.convert(json)
    return html
  }

  convert(data: string) {
    const note = JSON.parse(data) as RoamNote
    return this.convertRoamNote(note)
  }

  private convertRoamNote(note: RoamNote): {html: string; backlinkNoteIds: string[]} {
    const aggregBacklinkNoteIds = new Set<string>()

    let dom = list()

    if (note.children) {
      const listItems: DOM[] = []

      for (const child of note.children) {
        const {html, backlinkNoteIds} = this.generateListItem(child)

        listItems.push(html)
        backlinkNoteIds.forEach((id) => aggregBacklinkNoteIds.add(id))
      }

      dom = list(listItems)
    }

    const html = domArrayToHtml([header1(note.title), dom])

    return {html, backlinkNoteIds: Array.from(aggregBacklinkNoteIds)}
  }

  private generateListItem(
    noteString: RoamNoteString,
    aggregNoteIds = new Set<string>(),
  ): {html: string; backlinkNoteIds: string[]} {
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

    const {html: itemContent, backlinkNoteIds} = markdownToHtml(string, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      // Disable certain constructs from Micromark.
      // All constructs: https://github.com/micromark/micromark/blob/116bfa56b90b6bbc1facddfd0886a7e127a6b03f/packages/micromark-core-commonmark/dev/index.js
      // Related discussion: https://github.com/micromark/micromark/discussions/63
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
    })

    backlinkNoteIds.forEach((id) => aggregNoteIds.add(id))

    let itemChildren: DOM = ''

    if (noteString.children) {
      const listItems = noteString.children.map((child) => {
        const {html} = this.generateListItem(child, aggregNoteIds)
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
