import parse from 'date-fns/parse'

import {toNoteId} from 'helpers/to-id'
import {parseXml} from 'helpers/xml'

import {notEmpty} from '../../helpers/array-fns'
import {buildBacklinkParser} from '../../helpers/backlink'
import {
  ConvertedNote,
  ConvertOptions,
  Convertor,
  ConvertResponse,
  REFLECT_HOSTNAME,
} from '../../types'

export class EvernoteConvertor implements Convertor {
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

  accept = {'application/enex': ['.enex']}

  convert({data}: ConvertOptions): ConvertResponse {
    const doc = parseXml(data)

    const noteDocs = Array.from(doc.querySelectorAll('en-export > note'))

    const notes = noteDocs.map((noteDoc, index) => this.convertNoteDoc(noteDoc, index))

    return {notes}
  }

  private convertNoteDoc(noteDoc: Element, index: number): ConvertedNote {
    const subject = this.extractSubject(noteDoc)
    const html = this.extractHtml(noteDoc)
    const backlinkNoteIds = this.extractBacklinkNoteIds(noteDoc)
    const timestamps = this.extractTimestamps(noteDoc)
    const id = this.buildId(index, subject)

    return {id, html, subject, backlinkNoteIds, ...timestamps}
  }

  private buildId(index: number, subject?: string) {
    return `enex-${index}-${toNoteId(`${subject}`)}`
  }

  private extractSubject(noteDoc: Element): string | undefined {
    const subject = noteDoc.querySelector('title')?.textContent ?? undefined
    return subject
  }

  private extractHtml(noteDoc: Element): string {
    const content = noteDoc.querySelector('content')?.textContent ?? ''
    const contentDoc = parseXml(content)
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

  private extractTimestamps(noteDoc: Element) {
    const createdAtString = noteDoc.querySelector('created')?.textContent
    const updatedAtString = noteDoc.querySelector('updated')?.textContent

    const createdAt = createdAtString ? this.parseTime(createdAtString) : undefined
    const updatedAt = updatedAtString ? this.parseTime(updatedAtString) : undefined

    return {createdAt, updatedAt}
  }

  private parseTime(dateString: string): number {
    // Format is 20221124T000557Z
    return parse(dateString, "yyyyMMdd'T'HHmmss'Z'", new Date()).getTime()
  }
}
