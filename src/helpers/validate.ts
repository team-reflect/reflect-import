import {partition} from 'lodash-es'

import {ConvertedNote, ConvertResponse} from '../types'

// 900kb is slightly less then the 1mb max
const MAX_HTML_LENGTH = 900 * 1024

export const isValidHtmlLength = (html: string): boolean => {
  return html.length <= MAX_HTML_LENGTH
}

export const validateNotes = (notesToValidate: ConvertedNote[]): ConvertResponse => {
  const [notes, invalidNotes] = partition(notesToValidate, (note) =>
    isValidHtmlLength(note.html),
  )

  const errors = invalidNotes.map((note) => ({
    id: note.id,
    type: 'note-too-big',
    message: `The HTML for this note is too long. It must be less than 900kb.`,
  }))

  return {notes, errors}
}
