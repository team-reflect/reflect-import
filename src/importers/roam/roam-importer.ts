import {DOM, domToHtml} from '../../helpers/dom'
import {header1, list, listItem, taskListItem} from '../../helpers/generators'
import {Convertor, REFLECT_HOSTNAME} from '../../types'
import {markdownToHtml} from './markdown'

interface RoamNote {
  title: string
  uid: string
  'edit-time': number
  children?: RoamNoteString[]
}

interface RoamNoteString {
  string: string
  'create-time': number
  uid: string
  'edit-time': number
  children?: RoamNoteString[]
}

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

  toHtml(data: string): string {
    const note = JSON.parse(data) as RoamNote

    header1(note.title)

    return domToHtml(this.generateList(note))
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

    const itemContent = markdownToHtml(string, {
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
