import {validateNotes} from 'helpers/validate'

import {RoamBacklinks} from './roam-backlinks'
import {RoamNoteConvertor} from './roam-note-convertor'
import {RoamConversionError, RoamConvertedNote, RoamNote} from './types'
import {Convertor} from '../../convertor'
import {ConvertOptions, ConvertResponse} from '../../types'

export class RoamConvertor extends Convertor {
  accept = {'application/json': ['.json']}
  description = 'Roam Research JSON'

  async convert({data}: ConvertOptions): Promise<ConvertResponse> {
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
