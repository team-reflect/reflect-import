import {describe, it, expect} from 'vitest'

import {MarkdownConvertor} from './markdown-convertor'

describe('convert', () => {
  it('converts markdown to HTML', async () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: '# foo', filename: 'foo.md'})
    const [{html}] = notes

    expect(html).toEqual('<h1>foo</h1>')
  })
})

describe('isDaily', () => {
  it('is true when filename is a date', async () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: '# foo', filename: '2020-10-10.md'})
    const [{dailyAt}] = notes

    expect(dailyAt).toEqual(1602288000000)
  })

  it('is false when filename is not a date', async () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: '# foo', filename: 'foo'})
    const [{dailyAt}] = notes

    expect(dailyAt).toBe(undefined)
  })
})

describe('id', () => {
  it('slugifies filename', async () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = await convertor.convert({
      data: '# Alex MacCaw',
      filename: 'Alex MacCaw.md',
    })
    const [{id}] = notes

    expect(id).toEqual('alexmaccaw')
  })
})
