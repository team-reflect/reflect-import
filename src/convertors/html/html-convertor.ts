import {parseHtml} from 'helpers/html'
import {stripFileExtension} from 'helpers/path'
import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from 'types'

import {basenameToSubject, toHtmlId} from './html-helpers'

export class HtmlConvertor implements Convertor {
  accept = {'text/html': ['.html', '.htm']}

  convert({
    data,
    filename,
    lastModified,
  }: ConvertOptions & {filename: string}): ConvertResponse {
    const basename = stripFileExtension(filename)

    const doc = parseHtml(data)

    const subject =
      doc.querySelector('title')?.textContent ||
      doc.querySelector('h1')?.textContent ||
      basenameToSubject(basename)

    // Remove <br /> tags
    doc.querySelectorAll('br').forEach((br) => br.remove())

    const html = doc.body.innerHTML

    const note: ConvertedNote = {
      id: toHtmlId(basename),
      subject,
      html,
      updatedAt: lastModified,
    }

    return {notes: [note]}
  }
}
