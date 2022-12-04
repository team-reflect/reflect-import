import {toRoamId} from './roam-helpers'
import {RoamNote, RoamNoteString} from './types'

type TitleToIdMap = Map<string, string>

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

  constructor(notes: RoamNote[]) {
    this.titleToIdMap = this.getTitleToIdMapFromNotes(notes)
  }

  getNoteId(title: string) {
    return this.titleToIdMap.get(title)
  }

  private getTitleToIdMapFromNotes(notes: RoamNote[]): TitleToIdMap {
    const titleToIdMap = new Map<string, string>()

    for (const note of notes) {
      const noteMap = this.getTitleToIdMapFromNote(note)

      for (const [title, id] of noteMap) {
        titleToIdMap.set(title, id)
      }
    }

    return titleToIdMap
  }

  // We want to iterate deeply through the note and map
  // all the titles to their corresponding note IDs.
  private getTitleToIdMapFromNote(note: RoamNote, result: TitleToIdMap = new Map()) {
    result.set(note.title, toRoamId(note.uid))

    if (note.children) {
      note.children.map((child) => {
        this.getTitleToIdMapFromNoteString(note, child, result)
      })
    }

    return result
  }

  // For block references the titles are the block references IDs.
  private getTitleToIdMapFromNoteString(
    note: RoamNote,
    noteString: RoamNoteString,
    result: TitleToIdMap = new Map(),
  ) {
    result.set(noteString.uid, toRoamId(note.uid))

    if (noteString.children) {
      noteString.children.map((child) => {
        this.getTitleToIdMapFromNoteString(note, child, result)
      })
    }

    return result
  }
}
