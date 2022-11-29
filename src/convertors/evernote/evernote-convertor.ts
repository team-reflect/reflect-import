import parse from 'date-fns/parse'

import {toNoteId} from 'helpers/to-id'
import {parseXml} from 'helpers/xml'

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
    const timestamps = this.extractTimestamps(noteDoc)
    const id = this.buildId(index, subject)

    return {id, html, subject, ...timestamps}
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
