import {ConversionError} from '../../types'

export class EvernoteConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'EvernoteConversionError'
  }
}
