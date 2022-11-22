import format from 'date-fns/format/index.js'

export const toNoteId = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\W_-]/g, '')
}

export const toDailyNoteId = (date: Date) => {
  return format(date, 'ddMMyyyy')
}
