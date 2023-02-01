import {isValid, parse} from 'date-fns'
import {kebabCase} from 'lodash-es'

import {stripFileExtension} from 'helpers/path'

export const dailyDateFromFilename = (filename: string): Date | undefined => {
  const basename = stripFileExtension(filename)
  const date = parse(basename, 'yyyy-MM-dd', new Date())

  if (isValid(date)) {
    return date
  }

  return
}

export const toMarkdownId = (filename: string) => {
  return kebabCase(`md-${filename}`)
}
