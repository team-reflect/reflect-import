export const REFLECT_HOSTNAME = 'reflect.app'

export type ConvertedNote = {
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
}

export interface Convertor {
  convert(data: string): ConvertedNote
}

export interface ListConvertor {
  convert(data: string): ConvertedNote[]
}
export class ConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConversionError'
  }
}
