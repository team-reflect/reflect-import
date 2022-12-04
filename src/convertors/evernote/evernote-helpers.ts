import parse from 'date-fns/parse'

import {toNoteId} from 'helpers/to-id'

export const parseTime = (dateString: string): number => {
  // Format is 20221124T000557Z
  return parse(dateString, "yyyyMMdd'T'HHmmss'Z'", new Date()).getTime()
}

export const toEvernoteId = (index: number, subject?: string) => {
  return `enex-${index}${toNoteId(`${subject}`)}`
}
