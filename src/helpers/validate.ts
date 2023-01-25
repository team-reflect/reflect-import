import {partition} from 'lodash-es'

import {ConvertedNote, ConvertResponse} from '../types'

const MAX_HTML_LENGTH = 1000000

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
    message: `The HTML for this note is too long. It must be less than ${MAX_HTML_LENGTH} characters.`,
  }))

  return {notes, errors}
}
