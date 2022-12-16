import {describe, it, expect} from 'vitest'

import {markdownToHtml} from './markdown'

describe('markdownToHtml', () => {
  it('should convert markdown to html', () => {
    const markdown = `
# Hello World

This is a test

- [ ] This is a task
- [x] This is a completed task
- [ ] This is a task with a [[link]]
`

    const {html} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(html).toMatchInlineSnapshot(`
      "<h1>Hello World</h1>
      <p>This is a test</p>
      <ul>
      <li>[ ] This is a task</li>
      <li>[x] This is a completed task</li>
      <li>[ ] This is a task with a <a class=\\"backlink new\\" href=\\"https://reflect.app/g/testgraph/link\\">link</a></li>
      </ul>"
    `)
  })

  it('should extract the first heading as the subject', () => {
    const markdown = `
# Hello World

This is a test
`

    const {subject} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(subject).toBe('Hello World')
  })

  it('should extract backlinks from the markdown', () => {
    const markdown = `
# Hello World

[[my backlink]]
[[another backlink]]
`

    const {backlinks: ids} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(ids).toEqual([
      {
        id: 'mybacklink',
        label: 'my backlink',
      },
      {
        id: 'anotherbacklink',
        label: 'another backlink',
      },
    ])
  })
})

describe('nodesFromRoamMarkdown', () => {
  it('skips headings', () => {
    const {html} = markdownToHtml('# foo', {
      graphId: '123',
      linkHost: 'reflect.app',
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
    })
    expect(html).toEqual('<p># foo</p>')
  })
})
