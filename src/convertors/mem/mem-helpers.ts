import {parse, isValid, parseJSON} from 'date-fns'

import {MemExportNote} from './types'

export function parseTimestamp(timestamp: string): Date | undefined {
  const date = parseJSON(timestamp)

  if (isValid(date)) {
    return date
  }

  return
}

export function getDailyDate(memNote: MemExportNote): Date | undefined {
  if (isDailyNote(memNote)) {
    return memTitleToDailyDate(memNote.title)
  }

  return
}

const DAILY_NOTE_TAG = 'daily-mem'

function isDailyNote(note: MemExportNote): boolean {
  return note.tags.includes(DAILY_NOTE_TAG)
}

function memTitleToDailyDate(title: string): Date | undefined {
  // Daily note mem title's look like May 8, 2023
  const date = parse(title, 'MMMM d, yyyy', new Date())

  if (isValid(date)) {
    return date
  }

  return
}
