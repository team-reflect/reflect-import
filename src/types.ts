export type ConvertedNote = {
  html: string
  subject?: string
  backlinkNoteIds?: string[]
}

export interface Convertor {
  convert(data: string): ConvertedNote
}

export interface ListConvertor {
  convert(data: string): ConvertedNote[]
}

export const REFLECT_HOSTNAME = 'reflect.app'
