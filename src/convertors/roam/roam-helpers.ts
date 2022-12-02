import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'

import {toDailyNoteId, toNoteId} from '../../helpers/to-id'

// Tries to parse out a date from the subject of a note.
// Should be in the format of: October 1, 2020
export const parseDateFromSubject = (str: string): Date | null => {
  const date = parse(str, 'MMMM do, yyyy', new Date())

  if (isValid(date)) {
    return date
  }

  return null
}

export const parseNoteIdFromSubject = (subject: string) => {
  const subjectDate = parseDateFromSubject(subject)

  if (subjectDate) {
    return toDailyNoteId(subjectDate)
  }

  return toNoteId(subject)
}

export const validateTime = (time: number | undefined): number | undefined => {
  const date = time ? new Date(time) : undefined

  if (date && isValid(date)) {
    return time
  }

  return
}

export const toRoamId = (uid: string) => {
  return `roam${uid}`
}

// Takes a string like '[[Example]]' and returns ['Example']
export const extractBacklinks = (str: string): string[] => {
  const regex = /(\[\[[^\]]*\]\]|\(\([^)]*\)\))/g
  const matches = str.match(regex) ?? []
  return matches.map((match) => match.slice(2, -2))
}
