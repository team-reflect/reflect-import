import {validateNotes} from 'helpers/validate'
import {ConvertOptions, Convertor, ConvertResponse, REFLECT_HOSTNAME} from 'types'

import {RoamBacklinks} from './roam-backlinks'
import {RoamNoteConvertor} from './roam-note-convertor'
import {RoamConversionError, RoamConvertedNote, RoamNote} from './types'

export class RoamConvertor implements Convertor {
  graphId: string
  linkHost: string

  constructor({
    graphId,
    linkHost = REFLECT_HOSTNAME,
  }: {
    graphId: string
    linkHost?: string
  }) {
    this.graphId = graphId
    this.linkHost = linkHost
  }

  accept = {'application/json': ['.json']}

  convert({data}: ConvertOptions): ConvertResponse {
    const roamNotes = JSON.parse(data) as RoamNote[]

    if (!Array.isArray(roamNotes)) {
      throw new RoamConversionError('Roam export must be an array of notes')
    }

    const backlinks = new RoamBacklinks(roamNotes)

    const notes = roamNotes.map((note) => this.convertRoamNote(note, backlinks))

    return validateNotes(notes)
  }

  private convertRoamNote(note: RoamNote, backlinks: RoamBacklinks): RoamConvertedNote {
    const convertor = new RoamNoteConvertor({
      graphId: this.graphId,
      linkHost: this.linkHost,
      backlinks,
      note,
    })

    return convertor.convert()
  }
}
