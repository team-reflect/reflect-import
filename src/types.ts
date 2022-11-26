export const REFLECT_HOSTNAME = 'reflect.app'

export type ConvertedNote = {
  // A unique id for the note
  id: string
  // A required html string
  html: string
  // An optional subject
  subject?: string
  // A list of note ids that are references from inside this note
  backlinkNoteIds?: string[]
  // The date the note was created
  createdAt?: number
  // The date the note was updated
  updatedAt?: number
  // Whether or not the note is a daily note
  isDaily?: boolean
}

export interface ConvertOptions {
  data: string
  filename?: string
}

export interface ConvertResponse {
  notes: ConvertedNote[]
}

export interface Convertor {
  convert(options: ConvertOptions): ConvertResponse
}
export class ConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConversionError'
  }
}
