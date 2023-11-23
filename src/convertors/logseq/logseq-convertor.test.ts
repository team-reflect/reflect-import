import {describe, it, expect} from 'vitest'

import exampleExport from './fixtures/logseq-example.json'
import exampleOrgExport from './fixtures/logseq-org-example.json'
import examplePropertiesExport from './fixtures/logseq-property-example.json'
import exampleTodoExport from './fixtures/logseq-todo-example.json'
import exampleWhiteboardExport from './fixtures/logseq-whiteboard-example.json'
import {LogseqConvertor} from './logseq-convertor'

describe('LogseqConvertor', () => {
  it('parses example', async () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: JSON.stringify(exampleExport)})

    expect(notes).toMatchSnapshot()
  })

  it('parses properties example', async () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = await convertor.convert({
      data: JSON.stringify(examplePropertiesExport),
    })

    expect(notes).toMatchSnapshot()
  })

  it('parses TODO example', async () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: JSON.stringify(exampleTodoExport)})

    expect(notes).toMatchSnapshot()
  })

  it('handles and ignores whiteboard pages', async () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = await convertor.convert({
      data: JSON.stringify(exampleWhiteboardExport),
    })

    expect(notes).toMatchSnapshot()
  })

  it('exception for Org example', () => {
    const convertor = new LogseqConvertor({graphId: '123'})
    expect(
      async () => await convertor.convert({data: JSON.stringify(exampleOrgExport)}),
    ).rejects.toThrowError()
  })

  it('does not include daily backlinks', async () => {
    const data = {
      ...exampleExport,
      blocks: exampleExport.blocks.filter((b) => b['page-name'] === 'May 3rd, 2023'),
    }

    const convertor = new LogseqConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: JSON.stringify(data)})
    expect(notes.length).toBe(1)
    const note = notes[0]

    expect(note.backlinks).toEqual([])
  })
})
