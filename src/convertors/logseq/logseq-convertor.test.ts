import {describe, it, expect} from 'vitest'

import exampleExport from './fixtures/logseq-example.json'
import examplePropertiesExport from './fixtures/logseq-property-example.json'
import exampleTodoExport from './fixtures/logseq-todo-example.json'
import exampleOrgExport from './fixtures/logseq-org-example.json'
import {LogseqConvertor} from './logseq-convertor'

describe('LogseqConvertor', () => {
  it('parses example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(exampleExport)})

    expect(notes).toMatchSnapshot()
  })
  it('parses properties example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(examplePropertiesExport)})

    expect(notes).toMatchSnapshot()
  })
  it('parses TODO example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(exampleTodoExport)})

    expect(notes).toMatchSnapshot()
  })
  it('exception for Org example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    expect(() =>
      convertor.convert({data: JSON.stringify(exampleOrgExport)}),
    ).toThrowError()
  })
})
