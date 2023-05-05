import {describe, it, expect} from 'vitest'

import exampleExport from './fixtures/logseq-example.json'
import {LogseqConvertor} from './logseq-convertor'

describe('LogseqConvertor', () => {
  it('parses example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(exampleExport)})

    expect(notes).toMatchSnapshot()
  })
})
