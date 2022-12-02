import {toNoteId} from 'helpers/to-id'

export const toOpmlId = (index: number, subject: string) => {
  return `opml${index}${toNoteId(subject)}`
}
