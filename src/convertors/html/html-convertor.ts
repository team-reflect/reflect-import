import {parseHtml} from 'helpers/html'
import {stripFileExtension} from 'helpers/path'
import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from 'types'

import {toHtmlId} from './html-helpers'

export class HtmlConvertor implements Convertor {
  accept = {'text/html': ['.html', '.htm']}

  convert({data, filename}: ConvertOptions & {filename: string}): ConvertResponse {
    const basename = stripFileExtension(filename)

    const doc = parseHtml(data)

    const subject =
      doc.querySelector('title')?.textContent ??
      doc.querySelector('h1')?.textContent ??
      basename

    // Remove <br /> tags
    doc.querySelectorAll('br').forEach((br) => br.remove())

    const html = doc.body.innerHTML

    const note: ConvertedNote = {
      id: toHtmlId(basename),
      subject,
      html,
    }

    return {notes: [note]}
  }
}
