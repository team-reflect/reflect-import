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

    return {html, subject, backlinkNoteIds}
  }
}
