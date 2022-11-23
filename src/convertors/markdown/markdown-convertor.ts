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

  toHtml(markdown: string): string {
    const {html, subject} = markdownToHtml(markdown, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    return subject ? domArrayToHtml([header1(subject), html]) : html
  }
}
