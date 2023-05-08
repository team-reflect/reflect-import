import slugify from '@sindresorhus/slugify'
import {parse, isValid, parseJSON} from 'date-fns'

import {Backlink} from 'types'

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

export function toMemId(uid: string): string {
  if (!uid.startsWith('mem-')) {
    return `mem-${slugify(uid)}`
  } else {
    return uid
  }
}

export function backlinkToMemId(backlink: Backlink): Backlink {
  return {
    ...backlink,
    id: toMemId(backlink.id),
  }
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
