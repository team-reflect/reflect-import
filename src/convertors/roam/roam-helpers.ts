import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'

import {RoamNote, RoamNoteString} from './types'

// Tries to parse out a date from the subject of a note.
// Should be in the format of: October 1, 2020
export const parseDateFromSubject = (str: string): Date | null => {
  const date = parse(str, 'MMMM do, yyyy', new Date())

  if (isValid(date)) {
    return date
  }

  return null
}

export const validateTime = (time: number | undefined): number | undefined => {
  const date = time ? new Date(time) : undefined

  if (date && isValid(date)) {
    return time
  }

  return
}

export const toRoamId = (uid: string) => {
  return `roam-${uid}`
}

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

// Convert ((backlinks)) to [[backlinks]].
export const convertBlockrefsToBacklinks = (str: string): string => {
  return str.replace(/\(\(([^)]+)\)\)/g, '[[\\1]]')
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

// We want to iterate deeploy through the note and collect
// all the titles to their corresponding note IDs.
export const aggregateBacklinksToNoteIds = (
  note: RoamNote,
  result: Map<string, string> = new Map(),
) => {
  result.set(note.title, toRoamId(note.uid))

  if (note.children) {
    note.children.map((child) => {
      aggregateBlockRefsToNoteIds(note, child, result)
    })
  }

  return result
}

const aggregateBlockRefsToNoteIds = (
  note: RoamNote,
  noteString: RoamNoteString,
  result: Map<string, string> = new Map(),
) => {
  // For block references the titles are the block references IDs.
  result.set(noteString.uid, toRoamId(note.uid))

  if (noteString.children) {
    noteString.children.map((child) => {
      aggregateBlockRefsToNoteIds(note, child, result)
    })
  }

  return result
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
