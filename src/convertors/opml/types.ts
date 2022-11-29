import {ConversionError} from '../../types'

export class OpmlConversionError extends ConversionError {
  constructor(message: string) {
    super(message)
    this.name = 'OpmlConversionError'
  }
}
