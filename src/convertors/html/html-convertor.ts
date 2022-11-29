import {toNoteId} from 'helpers/to-id'

import {
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'

export class HtmlConvertor implements Convertor {
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

  accept = {'text/html': ['.html', '.htm']}

  convert({data, filename}: ConvertOptions & {filename: string}): ConvertResponse {
    const basename = filename.replace(/\.[^/.]+$/, '')

    const note: ConvertedNote = {
      id: toNoteId(basename),
      html: data,
    }

    return {notes: [note]}
  }
}
