import {parseHtml} from 'helpers/html'
import {stripFileExtension} from 'helpers/path'
import {toNoteId} from 'helpers/to-id'
import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from 'types'

export class HtmlConvertor implements Convertor {
  accept = {'text/html': ['.html', '.htm']}

  convert({data, filename}: ConvertOptions & {filename: string}): ConvertResponse {
    const basename = stripFileExtension(filename)

    const doc = parseHtml(data)

    const subject =
      doc.querySelector('title')?.textContent ??
      doc.querySelector('h1')?.textContent ??
      basename

    const note: ConvertedNote = {
      id: `html-${toNoteId(basename)}`,
      subject,
      html: data,
    }

    return {notes: [note]}
  }
}
