import {domArrayToHtml} from '../../helpers/dom'
import {header1} from '../../helpers/generators'
import {markdownToHtml} from '../../helpers/markdown/markdown'
import {Convertor, REFLECT_HOSTNAME} from '../../types'

export class MarkdownConvertor implements Convertor {
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

  convert(data: string) {
    const {html, subject, backlinkNoteIds} = markdownToHtml(data, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    const htmlWithSubject = subject ? domArrayToHtml([header1(subject), html]) : html

    return {html: htmlWithSubject, subject, backlinkNoteIds}
  }
}
