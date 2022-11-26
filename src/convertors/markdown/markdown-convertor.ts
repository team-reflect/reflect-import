import {markdownToHtml} from '../../helpers/markdown/markdown'
import {ConvertOptions, Convertor, REFLECT_HOSTNAME} from '../../types'

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

  convert({data, filename}: ConvertOptions) {
    const {html, subject, backlinkNoteIds} = markdownToHtml(data, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    })

    // Filename matches yyyy-MM-dd.md
    const isDaily = !!filename?.match(/^\d{4}-\d{2}-\d{2}/)

    return {html, subject, isDaily, backlinkNoteIds}
  }
}
