import {toNoteId} from 'helpers/to-id'
import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from 'types'

export class HtmlConvertor implements Convertor {
  accept = {'text/html': ['.html', '.htm']}

  convert({data, filename}: ConvertOptions & {filename: string}): ConvertResponse {
    const basename = filename.replace(/\.[^/.]+$/, '')

    const note: ConvertedNote = {
      id: `html-${toNoteId(basename)}`,
      html: data,
    }

    return {notes: [note]}
  }
}
