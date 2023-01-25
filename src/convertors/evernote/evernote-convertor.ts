import {validateNotes} from 'helpers/validate'
import {parseXml} from 'helpers/xml'
import {ConvertedNote, ConvertOptions, Convertor, ConvertResponse} from 'types'

import {parseTime, toEvernoteId} from './evernote-helpers'

export class EvernoteConvertor implements Convertor {
  accept = {'application/enex': ['.enex']}

  convert({data}: ConvertOptions): ConvertResponse {
    const doc = parseXml(data)

    const noteDocs = Array.from(doc.querySelectorAll('en-export > note'))

    const notes = noteDocs.map((noteDoc, index) => this.convertNoteDoc(noteDoc, index))

    return validateNotes(notes)
  }

  private convertNoteDoc(noteDoc: Element, index: number): ConvertedNote {
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

    return html
  }

  private extractTimestamps(noteDoc: Element) {
    const createdAtString = noteDoc.querySelector('created')?.textContent
    const updatedAtString = noteDoc.querySelector('updated')?.textContent

    const createdAt = createdAtString ? parseTime(createdAtString) : undefined
    const updatedAt = updatedAtString ? parseTime(updatedAtString) : undefined

    return {createdAt, updatedAt}
  }
}
