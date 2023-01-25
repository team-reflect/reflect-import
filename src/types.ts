export const REFLECT_HOSTNAME = 'reflect.app'

export interface Backlink {
  id: string
  label: string
}

export interface ConvertedNote {
  // A unique id for the note
  id: string
  // A required html string
  html: string
  // An optional subject
  subject?: string
  // A list of note ids that are references from inside this note
  backlinks?: Backlink[]
  // The date the note was created
  createdAt?: number
  // The date the note was updated
  updatedAt?: number
  // Whether or not the note is a daily note
  dailyAt?: number
}

export interface ConvertOptions {
  data: string
  filename?: string
  lastModified?: number
}

export interface ConvertedNoteError {
  id: string
  type: string
  message: string
}

export interface ConvertResponse {
  notes: ConvertedNote[]
  errors: ConvertedNoteError[]
}

export type ConvertorAcceptType = Record<string, string | string[]>

export interface Convertor {
  accept: ConvertorAcceptType
  convert(options: ConvertOptions): ConvertResponse
}
export class ConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConversionError'
  }
}
