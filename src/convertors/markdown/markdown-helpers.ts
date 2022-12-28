import {parse, isValid} from 'date-fns'

import {stripFileExtension} from 'helpers/path'
import {toDailyNoteId} from 'helpers/to-id'

export const parseDailyDateFromFilename = (filename: string): Date | null => {
  const basename = stripFileExtension(filename)
  const date = parse(basename, 'yyyy-MM-dd', new Date())

  if (isValid(date)) {
    return date
  }

  return null
}

export const normalizeBacklink = (backlink: string): string => {
  const date = parseDailyDateFromFilename(backlink)

  if (date) {
    return toDailyNoteId(date)
  }

  return backlink
}

export const toMarkdownId = (filename: string) => {
  return `md-${filename}`
}
