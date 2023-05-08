import {describe, expect, it} from 'vitest'

import memExport from './fixtures/mem-export.json'
import {MemConvertor} from './mem-convertor'

describe('MemConvertor', () => {
  it('converts mem JSON export to HTML', async () => {
    const convertor = new MemConvertor({graphId: 'test'})

    const {notes} = await convertor.convert({data: JSON.stringify(memExport)})

    expect(notes).toMatchSnapshot()
  })
})
