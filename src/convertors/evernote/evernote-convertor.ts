import {notEmpty} from '../../helpers/array-fns'
import {buildBacklinkParser} from '../../helpers/backlink'
import {ListConvertor, REFLECT_HOSTNAME} from '../../types'
import {EvernoteConversionError} from './types'

export class EvernoteConvertor implements ListConvertor {
  graphId: string
  linkHost: string
  private backlinkParser: (url: string) => string | null

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
    const subject = this.extractSubject(noteDoc)
    const html = this.extractHtml(noteDoc)
    const backlinkNoteIds = this.extractBacklinkNoteIds(noteDoc)

    return {html, subject, backlinkNoteIds}
  }

  private extractSubject(noteDoc: Element): string | undefined {
    const subject = noteDoc.querySelector('title')?.textContent ?? undefined
    return subject
  }

  private extractHtml(noteDoc: Element): string {
    const content = noteDoc.querySelector('content')?.textContent ?? ''
    const contentDoc = this.parseXml(content)
    const contentNoteDoc = contentDoc.querySelector('en-note')
    const html = contentNoteDoc?.innerHTML ?? ''

    return html
  }

  private extractBacklinkNoteIds(noteDoc: Element): string[] {
    const backlinkNoteIds = Array.from(noteDoc.querySelectorAll('a[href]'))
      .map((element) => this.backlinkParser(element.getAttribute('href')!))
      .filter(notEmpty)

    return backlinkNoteIds
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
