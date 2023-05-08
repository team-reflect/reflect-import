import {describe, expect, it} from 'vitest'

import memExport from './fixtures/mem-export.json'
import {MemConvertor} from './mem-convertor'

describe('MemConvertor', () => {
  it('converts mem JSON export to HTML', () => {
    const convertor = new MemConvertor({graphId: 'test'})

    const {notes} = convertor.convert({data: JSON.stringify(memExport)})

    expect(notes).toMatchSnapshot()
  })
})
