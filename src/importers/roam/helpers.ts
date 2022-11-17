import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'
import {toDailyNoteId, toNoteId} from '../../helpers/to-id'

export const parseDateFromSubject = (str: string): Date | null => {
  const date = parse(str, 'MMMM do, yyyy', new Date())

  if (isValid(date)) {
    return date
  }

  return null
}

export const parseNoteIdSubject = (title: string) => {
  const titleDate = parseDateFromSubject(title)

  if (titleDate) {
    return toDailyNoteId(titleDate)
  }

  return toNoteId(title)
}
