import format from 'date-fns/format'

// Valid IDs are lowercase and only include letters, numbers, or dashes
export const toNoteId = (value: string) => {
  return value
    .trim()
    .replace(/[^-a-zA-Z0-9]/g, '')
    .toLowerCase()
}

// Takes a date and returns a ddMMyyyy string like '20201001'
export const toDailyNoteId = (date: Date) => {
  return format(date, 'ddMMyyyy')
}
