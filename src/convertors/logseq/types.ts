import {ConversionError} from '../../types'

export interface LogseqExport {
  version: number
  blocks: LogseqNote[]
}

export interface LogseqNote {
  'page-name': string
  id: string
  children: LogseqBlock[]
}

export type LogseqProperties = Record<string, string | number | Array<string>>

export interface LogseqBlock {
  format?: string
  content?: string
  properties?: LogseqProperties | null
  id?: string
  children: LogseqBlock[]
}

export class LogseqConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'LogseqConversionError'
  }
}
