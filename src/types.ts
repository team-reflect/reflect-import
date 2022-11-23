type ConvertResult = {
  html: string
  subject?: string
  backlinkNoteIds?: string[]
}

export interface Convertor {
  convert(data: string): ConvertResult
}

export const REFLECT_HOSTNAME = 'reflect.app'
