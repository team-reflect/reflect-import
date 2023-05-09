import {parseHtml, removeBrs, removeImgsWithDataSrcs} from 'helpers/html'
import {stripFileExtension} from 'helpers/path'
import {validateNotes} from 'helpers/validate'

import {basenameToSubject, toHtmlId} from './html-helpers'
import {Convertor} from '../../convertor'
import {ConvertedNote, ConvertOptions, ConvertResponse} from '../../types'

export class HtmlConvertor extends Convertor {
  static accept = {'text/html': ['.html', '.htm']}
  static description = 'HTML files'

  async convert({
    data,
    filename,
    lastModified,
  }: ConvertOptions & {filename: string}): Promise<ConvertResponse> {
    const basename = stripFileExtension(filename)

    const doc = parseHtml(data)

    const subject =
      doc.querySelector('title')?.textContent ||
      doc.querySelector('h1')?.textContent ||
      basenameToSubject(basename)

    removeBrs(doc)
    removeImgsWithDataSrcs(doc)

    const html = doc.body.innerHTML

    const note: ConvertedNote = {
      id: toHtmlId(basename),
      subject,
      html,
      updatedAt: lastModified,
    }

    return validateNotes([note])
  }
}
