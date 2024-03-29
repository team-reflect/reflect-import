import {parse, isValid} from 'date-fns'

import {assertString} from 'helpers/assert'

import {toDailyNoteId} from '../../helpers/to-id'

// Takes a string like '[[Example]]' and returns ['Example']
export const extractBacklinks = (str: string): string[] => {
  const regex = /\[\[([^\]]+)\]\]/g
  const matches = str.match(regex) ?? []
  return matches.map((match) => match.slice(2, -2))
}

// Converts tags in the form of #[[tag]] or #tag to Wiki-style backlinks in the form of [[tag]].
export const convertTagsToBacklinks = (str: string): string => {
  return str.replace(/(^|\s)#\[\[/g, '$1[[').replace(/(^|\s)#([\w-]+)/g, '$1[[$2]]')
}

// Convert ((backlinks)) to [[backlinks]]. Takes a replacer function to convert the blockref id to a backlink.
// This is useful for converting blockrefs to backlinks in the same note.
//
// Usage:
//  convertBlockrefsToBacklinks('((blockref-id))', (blockRefId) => blockRefId)
export const convertBlockrefsToBacklinks = (
  str: string,
  replacer: (blockRefId: string) => string,
): string => {
  return str.replace(/\(\(([^)]+)\)\)/g, (_, blockRefId) => `[[${replacer(blockRefId)}]]`)
}

export const extractTodos = (
  str: string,
): {checked: boolean | undefined; parsed: string} => {
  const TODO_CHECKED = '{{DONE}}'
  const TODO_CHECKED_ALT = '{{[[DONE]]}}'

  const TODO_UNCHECKED = '{{TODO}}'
  const TODO_UNCHECKED_ALT = '{{[[TODO]]}}'

  if (str.startsWith(TODO_CHECKED_ALT)) {
    return {checked: true, parsed: str.slice(TODO_CHECKED_ALT.length).trim()}
  }

  if (str.startsWith(TODO_CHECKED)) {
    return {checked: true, parsed: str.slice(TODO_CHECKED.length).trim()}
  }

  if (str.startsWith(TODO_UNCHECKED_ALT)) {
    return {checked: false, parsed: str.slice(TODO_UNCHECKED_ALT.length).trim()}
  }

  if (str.startsWith(TODO_UNCHECKED)) {
    return {checked: false, parsed: str.slice(TODO_UNCHECKED.length).trim()}
  }

  return {
    checked: undefined,
    parsed: str,
  }
}

export const normalizeNoteString = (noteString: string) => {
  let string = noteString

  // Convert roam tags (e.g. #tag) to backlinks (e.g. [[tag]])
  string = convertTagsToBacklinks(string)

  // Normalize the noteString by parsing out todos
  const {checked, parsed: parsedTasksString} = extractTodos(string)

  return {
    checked,
    markdown: parsedTasksString,
  }
}

export const parseDateFromUid = (str: string): Date | null => {
  // Roam links to daily-notes look like: 03-09-2020
  const date = parse(str, 'MM-dd-yyyy', new Date())

  if (isValid(date)) {
    return date
  }

  return null
}

export const normalizeUidToId = (noteId: string) => {
  assertString(noteId, 'noteId must be a string')

  const dailyDate = parseDateFromUid(noteId)

  if (dailyDate) {
    // If the UID looks like a daily note, return the daily note ID.
    return toDailyNoteId(dailyDate)
  } else {
    return toRoamId(noteId)
  }
}

export const toRoamId = (uid: string) => {
  assertString(uid, 'uid must be a string')

  if (!uid.startsWith('roam-')) {
    return `roam-${uid}`
  } else {
    return uid
  }
}
