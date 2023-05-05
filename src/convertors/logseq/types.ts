import {ConversionError} from '../../types'

export interface LogseqNote {
  'page-name': string
  id: string
  children: LogseqBlock[]
}

export interface LogseqBlock {
  format: string
  content: string
  properties: Record<string, string>
  id: string
  children: LogseqBlock[]
}

export class LogseqConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'LogseqConversionError'
  }
}
