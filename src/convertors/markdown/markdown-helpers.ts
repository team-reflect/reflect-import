import slugify from '@sindresorhus/slugify'
import {parse, isValid} from 'date-fns'

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

  return `${slugify(basename, {lowercase: true, decamelize: false, separator: ''})}`
}

export const filenameToSubject = (filename: string) => {
  return stripFileExtension(filename)
}
