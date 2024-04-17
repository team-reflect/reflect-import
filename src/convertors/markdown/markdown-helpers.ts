import {parse, isValid} from 'date-fns'

import {toMarkdownNoteId} from 'helpers/markdown/markdown-helpers'
import {stripFileExtension} from 'helpers/path'

export const dailyDateFromFilename = (filename: string): Date | undefined => {
  const basename = stripFileExtension(filename)
  const date = parse(basename, 'yyyy-MM-dd', new Date())

  if (isValid(date)) {
    return date
  }

  return
}

export const filenameToId = (filename: string) => {
  const basename = stripFileExtension(filename)
  return toMarkdownNoteId(basename)
}

export const filenameToSubject = (filename: string) => {
  return stripFileExtension(filename)
}
