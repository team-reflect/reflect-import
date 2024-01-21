import {describe, expect, it} from 'vitest'

import memExport from './fixtures/mem-export.json'
import {MemConvertor} from './mem-convertor'

describe('MemConvertor', () => {
  it('converts mem JSON export to HTML', async () => {
    const convertor = new MemConvertor({graphId: 'test'})

    const {notes} = await convertor.convert({data: JSON.stringify(memExport)})

    expect(notes).toMatchSnapshot()
  })

  it('allow tags to contain [null]', async () => {
    const convertor = new MemConvertor({graphId: 'test'})

    // Bizzarely, Mem somtimes exports tags as [null]
    const data = `[
      {
        "id": "jpzawD9wcV5uS94vNoKP",
        "title": "May 8, 2023",
        "markdown": "",
        "tags": [null],
        "created": "2023-05-08T11:46:56.352Z",
        "updated": "2023-05-08T11:47:10.798Z"
      }
    ]`

    const {notes} = await convertor.convert({data})

    expect(notes).toMatchSnapshot()
  })
})
