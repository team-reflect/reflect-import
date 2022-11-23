import {DOM, domArrayToHtml} from '../../helpers/dom'
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
    const note = JSON.parse(json) as RoamNote

    return domArrayToHtml([header1(note.title), this.generateList(note)])
  }

  private generateList(note: RoamNote): DOM {
    if (!note.children) {
      return list()
    }

    const listItems = note.children.map((child) => this.generateListItem(child))

    return list(listItems)
  }

  private generateListItem(noteString: RoamNoteString): DOM {
    let string = this.convertRoamTagsToBacklinks(noteString.string?.trim() ?? '')

    let checked: boolean | undefined

    string = string.replace(LINKED_TODO_UNFINISHED_STRING, TODO_UNFINISHED_STRING)
    string = string.replace(LINKED_TODO_FINISHED_STRING, TODO_FINISHED_STRING)

    if (string.startsWith(TODO_UNFINISHED_STRING)) {
      string = string.replace(TODO_UNFINISHED_STRING, '')
      checked = false
    } else if (string.startsWith(TODO_FINISHED_STRING)) {
      string = string.replace(TODO_FINISHED_STRING, '')
      checked = true
    }

    const {html: itemContent} = markdownToHtml(string, {
      graphId: this.graphId,
      linkHost: this.linkHost,
      // Disable certain constructs from Micromark.
      // All constructs: https://github.com/micromark/micromark/blob/116bfa56b90b6bbc1facddfd0886a7e127a6b03f/packages/micromark-core-commonmark/dev/index.js
      // Related discussion: https://github.com/micromark/micromark/discussions/63
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
    })

    let itemChildren: DOM = ''

    if (noteString.children) {
      const listItems = noteString.children.map((child) => this.generateListItem(child))
      itemChildren = list(listItems)
    }

    return checked === undefined
      ? listItem(domArrayToHtml([itemContent, itemChildren]))
      : taskListItem(domArrayToHtml([itemContent, itemChildren]), {checked})
  }

  private convertRoamTagsToBacklinks(str: string) {
    return str.replace(/(^|\s)#\[\[/g, '$1[[').replace(/(^|\s)#([\w-]+)/g, '$1[[$2]]')
  }
}

const LINKED_TODO_UNFINISHED_STRING = '{{[[TODO]]}}'
const LINKED_TODO_FINISHED_STRING = '{{[[DONE]]}}'

const TODO_UNFINISHED_STRING = '{{TODO}}'
const TODO_FINISHED_STRING = '{{DONE}}'
