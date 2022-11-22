import {MarkdownConvertor} from './markdown-convertor'

describe('MarkdownConvertor', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    expect(convertor.toHtml('# foo')).toEqual('<h1>foo</h1>')
  })

  it('parses front matter', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    expect(
      convertor.toHtml(
        `---
subject: foo
---
# bar`,
      ),
    ).toMatchInlineSnapshot('"<h1>foo</h1><h1>bar</h1>"')
  })
})
