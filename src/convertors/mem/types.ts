import {ConversionError} from '../../types'

export interface MemExportNote {
  id: string
  title: string
  markdown: string
  tags: string[]
  created: string
  updated: string
}

export type MemExport = MemExportNote[]

export class MemConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'MemConversionError'
  }
}
