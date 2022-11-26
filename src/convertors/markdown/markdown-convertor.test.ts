import {MarkdownConvertor} from './markdown-convertor'
import {describe, it, expect} from 'vitest'

describe('convert', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: 'foo.md'})
    const [{html}] = notes

    expect(html).toEqual('<h1>foo</h1>')
  })
})

describe('isDaily', () => {
  it('is true when filename is a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: '2020-10-10.md'})
    const [{isDaily}] = notes

    expect(isDaily).toBe(true)
  })

  it('is false when filename is not a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: 'foo'})
    const [{isDaily}] = notes

    expect(isDaily).toBe(false)
  })
})
