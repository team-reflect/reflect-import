import {MarkdownConvertor} from './markdown-convertor'
import {describe, it, expect} from 'vitest'

describe('MarkdownConvertor', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {html} = convertor.convert('# foo')
    expect(html).toEqual('<h1>foo</h1>')
  })
})
