import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'

export const dailyDateFromFilename = (filename: string): Date | undefined => {
  const basename = filename.replace('.md', '')
  const date = parse(basename, 'yyyy-MM-dd', new Date())

  if (isValid(date)) {
    return date
  }

  return
}
