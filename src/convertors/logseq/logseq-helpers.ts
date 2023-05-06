import {parse, isValid} from 'date-fns'
import {toDailyNoteId} from 'helpers/to-id'

// This is a subset of the formats that logseq supports.  I don't think we can
// support every format because we can't differentiate between mm-dd-yyy and
// dd-mm-yyyy.  Starting with the default format.
const SUPPORTED_FORMATS = [
  'MMM do, yyyy',
  'E, MM/dd/yyyy',
  'E, dd-MM-yyyy',
  'E, dd.MM.yyyy',
  'E, yyyy/MM/dd',
  'EEE, dd-MM-yyyy',
  'EEE, dd.MM.yyyy',
  'EEE, yyyy/MM/dd',
  'EEEE, MM/dd/yyyy',
  'EEEE, dd-MM-yyyy',
  'EEEE, dd.MM.yyyy',
  'EEEE, yyyy/MM/dd',
  'MM-dd-yyyy',
  'MM/dd/yyyy',
  'MMM do, yyyy',
  'MMMM do, yyyy',
  'MM_dd_yyyy',
  'do MMM yyyy',
  'do MMMM yyyy',
  'yyyy-MM-dd',
  'yyyy-MM-dd EEEE',
  'yyyy/MM/dd',
  'yyyyMMdd',
  'yyyy_MM_dd',
]

/**
 * Run through most of the formats that logseq supports and try to parse the date.
 */
export const tryParseDate = (date: string): Date | undefined => {
  // Loop through all the formats, first one that matches wins
  for (const format of SUPPORTED_FORMATS) {
    const parsed = parse(date, format, new Date())
    if (isValid(parsed)) {
      return parsed
    }
  }
  // If we don't match anything (non-journal pages) then return undefined
  return undefined
}

/**
 * Attempts to convert a date into a time value.
 */
export const tryParseTime = (date: string): number | undefined => {
  const parsed = tryParseDate(date)
  if (parsed) {
    return parsed.getTime()
  }
  return undefined
}

/**
 * Returns either the guid or the date format for a daily note
 */
export const toLogseqId = (uid: string, title: string) => {
  const date = tryParseDate(title)
  if (date) {
    return toDailyNoteId(date)
  } else {
    return `logseq-${uid}`
  }
}
