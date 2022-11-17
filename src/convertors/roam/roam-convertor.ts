import {DOM, domToHtmlDoc} from '../../helpers/dom'
import {header1, list, listItem, taskListItem} from '../../helpers/generators'
import {Convertor, REFLECT_HOSTNAME} from '../../types'
import {roamMarkdownToHtml} from './roam-markdown'
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

    return domToHtmlDoc([header1(note.title), this.generateList(note)])
  }

  private generateList(note: RoamNote): DOM {
    if (!note.children) {
      return list()
    }

    const listItems = note.children.map((child) => this.generateListItem(child))

    return list(...listItems)
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

    const itemContent = roamMarkdownToHtml(string, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    const itemChildren = (noteString.children ?? []).map((child) =>
      this.generateListItem(child),
    )

    return checked === undefined
      ? listItem([itemContent, ...itemChildren])
      : taskListItem([itemContent, ...itemChildren], {checked})
  }

  private convertRoamTagsToBacklinks(str: string) {
    return str.replace(/(^|\s)#\[\[/g, '$1[[').replace(/(^|\s)#([\w-]+)/g, '$1[[$2]]')
  }
}

const LINKED_TODO_UNFINISHED_STRING = '{{[[TODO]]}}'
const LINKED_TODO_FINISHED_STRING = '{{[[DONE]]}}'

const TODO_UNFINISHED_STRING = '{{TODO}}'
const TODO_FINISHED_STRING = '{{DONE}}'
