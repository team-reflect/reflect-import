import {MarkdownConvertor} from './markdown-convertor'
import {describe, it, expect} from 'vitest'

describe('MarkdownConvertor', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    expect(convertor.toHtml('# foo')).toEqual('<h1>foo</h1>')
  })
})
