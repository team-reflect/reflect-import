import {normalizeUidToId} from './roam-helpers'
import {RoamNote, RoamNoteString} from './types'

type TitleToIdMap = Map<string, string>
type IdToTitleMap = Map<string, string>

// This is a private class for the RoamConvertor to use.
//
// Roam exports have do not contain enough information to reconstruct the
// backlinks properly. So we have to build a mapping of title to note ID
// and use that when resolving the backlinks.
//
// This is complicated by the fact that Roam implements block references
// so we also have to build a mapping of block references to note IDs.
export class RoamBacklinks {
  titleToIdMap: TitleToIdMap
  idToTitleMap: IdToTitleMap

  constructor(notes: RoamNote[]) {
    this.titleToIdMap = new Map()
    this.idToTitleMap = new Map()
    this.processNotes(notes)
  }

  getNoteId(title: string) {
    return this.titleToIdMap.get(title)
  }

  getNoteTitle(id: string) {
    return this.idToTitleMap.get(normalizeUidToId(id))
  }

  private processNotes(notes: RoamNote[]) {
    for (const note of notes) {
      this.processNote(note)
    }
  }

  // We want to iterate deeply through the note and map
  // all the titles to their corresponding note IDs.
  private processNote(note: RoamNote, result: TitleToIdMap = new Map()) {
    const id = normalizeUidToId(note.uid)
    const title = note.title || id 

    this.titleToIdMap.set(title, id)
    this.idToTitleMap.set(id, title)

    if (note.children) {
      note.children.map((child) => {
        this.processNoteString(note, child, result)
      })
    }

    return result
  }

  // For block references the titles are the block references IDs.
  private processNoteString(
    note: RoamNote,
    noteString: RoamNoteString,
    result: TitleToIdMap = new Map(),
  ) {
    if (!noteString.uid) {
      // Roam exports have a bug where some note strings don't have a uid
      return
    }

    // We are treating noteString.uid as the block ref title
    this.titleToIdMap.set(noteString.uid, normalizeUidToId(note.uid))
    this.idToTitleMap.set(normalizeUidToId(noteString.uid), note.title || "")

    if (noteString.children) {
      noteString.children.map((child) => {
        this.processNoteString(note, child, result)
      })
    }
  }
}
