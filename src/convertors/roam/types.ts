import {ConversionError, ConvertedNote} from '../../types'

export interface RoamNote {
  title: string
  uid: string
  'edit-time': number
  children?: RoamNoteString[]
}

export interface RoamNoteRef {
  uid: string
}
export interface RoamNoteString {
  string: string
  'create-time': number
  uid: string
  'edit-time': number
  refs?: RoamNoteRef[]
  children?: RoamNoteString[]
}

export interface RoamConvertedNote extends ConvertedNote {
  html: string
  // Make these properties required
  subject: string
  backlinkNoteIds: string[]
}

export class RoamConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'RoamConversionError'
  }
}
