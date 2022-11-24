import {notEmpty} from '../../helpers/array-fns'
import {buildBacklinkParser} from '../../helpers/backlink'
import {ListConvertor, REFLECT_HOSTNAME} from '../../types'
import {EvernoteConversionError} from './types'

export class EvernoteConvertor implements ListConvertor {
  graphId: string
  linkHost: string
  backlinkParser: (url: string) => string | null

  constructor({
    graphId,
    linkHost = REFLECT_HOSTNAME,
  }: {
    graphId: string
    linkHost?: string
  }) {
    this.graphId = graphId
    this.linkHost = linkHost
    this.backlinkParser = buildBacklinkParser({linkHost, graphId})
  }

  convert(data: string) {
    const doc = this.parseXml(data)

    const noteDocs = Array.from(doc.querySelectorAll('en-export > note'))

    return noteDocs.map((noteDoc) => this.convertNoteDoc(noteDoc))
  }

  private convertNoteDoc(noteDoc: Element) {
    const subject = noteDoc.querySelector('title')?.textContent ?? undefined
    const content = noteDoc.querySelector('content')?.textContent ?? ''
    const html = this.parseXml(content).querySelector('en-note')?.innerHTML ?? ''
    const backlinkNoteIds = Array.from(noteDoc.querySelectorAll('a[href]'))
      .map((element) => this.backlinkParser(element.getAttribute('href')!))
      .filter(notEmpty)

    return {html, subject, backlinkNoteIds}
  }

  private parseXml(xml: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml.trim(), 'text/xml')

    const parseError = doc.querySelector('parsererror')

    if (parseError) {
      throw new EvernoteConversionError(parseError.textContent ?? 'Unknown parse error')
    }

    return doc
  }
}
