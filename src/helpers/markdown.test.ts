import {markdownToHtml} from './markdown'
import {describe, it, expect} from 'vitest'

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

    const {data} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(data.subject).toBe('Hello World')
  })
})
