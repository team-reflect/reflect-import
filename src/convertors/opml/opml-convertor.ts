import {DOM, domArrayToHtml} from 'helpers/dom'
import {header1, list, listItem, paragraph} from 'helpers/generators'
import {parseXml} from 'helpers/xml'

import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from '../../types'
import {toOpmlId} from './opml-helpers'

export class OpmlConvertor implements Convertor {
  accept = {'application/opml': ['.opml']}

  convert({data}: ConvertOptions): ConvertResponse {
    const doc = parseXml(data)

    const outlineDocs = Array.from(doc.querySelectorAll('opml > body > outline'))

    const notes = outlineDocs.map((doc, index) =>
      this.convertOutlineDocToNote(doc, index),
    )

    return {notes}
  }

  private convertOutlineDocToNote(doc: Element, index: number): ConvertedNote {
    const subject = doc.getAttribute('text') ?? ''
    const rootList = this.convertOutlineDocToList(doc)
    const html = domArrayToHtml([header1(subject), rootList])

    return {
      id: toOpmlId(index, subject),
      subject,
      html,
    }
  }

  private convertOutlineDocToList(doc: Element): DOM {
    return list([this.convertOutlineDocToListItem(doc)])
  }

  private convertOutlineDocToListItem(doc: Element): DOM {
    const text = doc.getAttribute('text') ?? ''

    const subListItems = Array.from(doc.querySelectorAll(':scope > outline')).map((doc) =>
      this.convertOutlineDocToListItem(doc),
    )

    const children = [
      paragraph(text),
      ...(subListItems.length ? [list(subListItems)] : []),
    ]

    return listItem(domArrayToHtml(children))
  }
}
