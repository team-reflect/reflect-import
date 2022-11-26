import {MarkdownConvertor} from './markdown-convertor'
import {describe, it, expect} from 'vitest'

describe('convert', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {html} = convertor.convert({data: '# foo'})
    expect(html).toEqual('<h1>foo</h1>')
  })
})

describe('isDaily', () => {
  it('is true when filename is a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {isDaily} = convertor.convert({data: '# foo', filename: '2020-10-10.md'})
    expect(isDaily).toBe(true)
  })

  it('is false when filename is not a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {isDaily} = convertor.convert({data: '# foo', filename: 'foo'})
    expect(isDaily).toBe(false)
  })
})
