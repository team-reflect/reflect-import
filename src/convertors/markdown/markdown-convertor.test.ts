import {describe, it, expect} from 'vitest'

import {MarkdownConvertor} from './markdown-convertor'

describe('convert', () => {
  it('converts markdown to HTML', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: 'foo.md'})

    expect(notes).toMatchInlineSnapshot(`
      [
        {
          "backlinks": [],
          "dailyAt": undefined,
          "html": "<h1>foo</h1>",
          "id": "md-foo.md",
          "subject": "foo",
        },
      ]
    `)
  })
})

describe('isDaily', () => {
  it('is true when filename is a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: '2020-10-10.md'})
    const [{dailyAt}] = notes

    expect(dailyAt).toEqual(1602288000000)
  })

  it('is false when filename is not a date', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: '# foo', filename: 'foo'})
    const [{dailyAt}] = notes

    expect(dailyAt).toBe(undefined)
  })
})

describe('backlinks', () => {
  it('extracts backlinks', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({
      data: `# foo
        [[bar]]`,
      filename: 'foo.md',
    })

    expect(notes).toMatchInlineSnapshot(`
      [
        {
          "backlinks": [
            {
              "id": "bar",
              "label": "bar",
            },
          ],
          "dailyAt": undefined,
          "html": "<h1>foo</h1>
      <p><a class=\\"backlink new\\" href=\\"https://reflect.app/g/123/bar\\">bar</a></p>",
          "id": "md-foo.md",
          "subject": "foo",
        },
      ]
    `)
  })

  it('extracts daily-note backlinks', () => {
    const convertor = new MarkdownConvertor({graphId: '123'})
    const {notes} = convertor.convert({
      data: `# foo
        [[2022-01-01]]`,
      filename: 'foo.md',
    })

    expect(notes).toMatchInlineSnapshot(`
      [
        {
          "backlinks": [],
          "dailyAt": undefined,
          "html": "<h1>foo</h1>
          <p><a class=\\"backlink new\\" href=\\"https://reflect.app/g/123/01012022\\">1st January 2022</a></p>",
          "id": "md-foo.md",
          "subject": "foo",
        },
      ]
    `)
  })
})
