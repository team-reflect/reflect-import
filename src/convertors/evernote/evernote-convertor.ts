import {notEmpty} from 'helpers/array-fns'
import {parseHtml, removeImgsWithDataSrcs} from 'helpers/html'
import {validateNotes} from 'helpers/validate'
import {parseXml} from 'helpers/xml'

import {parseTime, toEvernoteId} from './evernote-helpers'
import {Convertor} from '../../convertor'
import {ConvertedNote, ConvertOptions, ConvertResponse} from '../../types'

export class EvernoteConvertor extends Convertor {
  static accept = {'application/enex': ['.enex']}
  static description = 'Evernote ENEX'

  async convert({data}: ConvertOptions): Promise<ConvertResponse> {
    const doc = parseXml(data)

    const noteDocs = Array.from(doc.querySelectorAll('en-export > note'))

    const notes = noteDocs
      .map((noteDoc, index) => this.convertNoteDoc(noteDoc, index))
      .filter(notEmpty)

    return validateNotes(notes)
  }

  private convertNoteDoc(noteDoc: Element, index: number): ConvertedNote | undefined {
    const resource = this.extractResource(noteDoc)

    // Skip notes with resources for now
    if (resource) {
      return
    }

    const subject = this.extractSubject(noteDoc)
    const html = this.extractHtml(noteDoc)
    const timestamps = this.extractTimestamps(noteDoc)
    const id = toEvernoteId(index, subject)

    return {id, html, subject, ...timestamps}
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
    const doc = parseHtml(html)

    removeImgsWithDataSrcs(doc)

    return doc.body.innerHTML
  }

  private extractTimestamps(noteDoc: Element) {
    const createdAtString = noteDoc.querySelector('created')?.textContent
    const updatedAtString = noteDoc.querySelector('updated')?.textContent

    const createdAt = createdAtString ? parseTime(createdAtString) : undefined
    const updatedAt = updatedAtString ? parseTime(updatedAtString) : undefined

    return {createdAt, updatedAt}
  }

  private extractResource(noteDoc: Element) {
    const resourceDoc = noteDoc.querySelector('resource')

    if (!resourceDoc) {
      return
    }

    const data = resourceDoc.querySelector('data')?.textContent ?? ''
    const mime = resourceDoc.querySelector('mime')?.textContent ?? ''
    const fileName = resourceDoc.querySelector('file-name')?.textContent ?? ''
    const sourceUrl = resourceDoc.querySelector('source-url')?.textContent ?? ''

    return {data, mime, fileName, sourceUrl}
  }
}
