import {describe, expect, it} from 'vitest'

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
      <li>[ ] This is a task with a <a class=\\"backlink new\\" href=\\"https://reflect.app/g/testgraph/md-link\\">link</a></li>
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

    const {backlinks, html} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(backlinks).toEqual([
      {
        id: 'md-my-backlink',
        label: 'my backlink',
      },
      {
        id: 'md-another-backlink',
        label: 'another backlink',
      },
    ])

    // Backlinks should be converted to links
    expect(html).toMatchInlineSnapshot(`
      "<h1>Hello World</h1>
      <p><a class=\\"backlink new\\" href=\\"https://reflect.app/g/testgraph/md-my-backlink\\">my backlink</a>
      <a class=\\"backlink new\\" href=\\"https://reflect.app/g/testgraph/md-another-backlink\\">another backlink</a></p>"
    `)
  })

  it('should extract tags from the markdown', () => {
    const markdown = `
# this_is_a_heading

## this_is_a_heading_too

#This-Is-A-Tag, #chinese_tag_你好世界 #korean_tag_헬로월드

#tag_with_unix_subpath/subpath and #tag_with_windows_subpath\\subpath

Invalid tags: #!this_is_not_a_tag, nor # this_is_not_a_tag, nor #!/usr/bin/env

Duplicate tags should be removed: #this-is-a-tag, #THIS-IS-A-TAG, #tHIS-iS-A-tAG

Link should be ignored: 

- [Link](https://example.com#this_is_not_a_tag) 
- [#Link](https://example.com#this_is_not_a_tag)
- https://example.com#this_is_not_a_tag
- <https://example.com#this_is_not_a_tag>

Code should be ignored: \`#this_is_not_a_tag\`

\`\`\`
#this_is_not_a_tag
\`\`\`

`

    const {tags, html} = markdownToHtml(markdown, {
      graphId: 'testgraph',
      linkHost: 'reflect.app',
    })

    expect(tags).toEqual([
      'this-is-a-tag',
      'chinese_tag_你好世界',
      'korean_tag_헬로월드',
      'tag_with_unix_subpath',
      'tag_with_windows_subpath',
    ])

    // Tags should be converted to links
    expect(html).toMatchInlineSnapshot(`
      "<h1>this_is_a_heading</h1>
      <h2>this_is_a_heading_too</h2>
      <p><a href=\\"https://reflect.app/g/testgraph/tag/this-is-a-tag\\">#this-is-a-tag</a>, <a href=\\"https://reflect.app/g/testgraph/tag/chinese_tag_%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C\\">#chinese_tag_你好世界</a> <a href=\\"https://reflect.app/g/testgraph/tag/korean_tag_%ED%97%AC%EB%A1%9C%EC%9B%94%EB%93%9C\\">#korean_tag_헬로월드</a></p>
      <p><a href=\\"https://reflect.app/g/testgraph/tag/tag_with_unix_subpath\\">#tag_with_unix_subpath</a>/subpath and <a href=\\"https://reflect.app/g/testgraph/tag/tag_with_windows_subpath\\">#tag_with_windows_subpath</a>\\\\subpath</p>
      <p>Invalid tags: #!this_is_not_a_tag, nor # this_is_not_a_tag, nor #!/usr/bin/env</p>
      <p>Duplicate tags should be removed: <a href=\\"https://reflect.app/g/testgraph/tag/this-is-a-tag\\">#this-is-a-tag</a>, <a href=\\"https://reflect.app/g/testgraph/tag/this-is-a-tag\\">#this-is-a-tag</a>, <a href=\\"https://reflect.app/g/testgraph/tag/this-is-a-tag\\">#this-is-a-tag</a></p>
      <p>Link should be ignored:</p>
      <ul>
      <li><a href=\\"https://example.com#this_is_not_a_tag\\">Link</a></li>
      <li><a href=\\"https://example.com#this_is_not_a_tag\\">#Link</a></li>
      <li><a href=\\"https://example.com#this_is_not_a_tag\\">https://example.com#this_is_not_a_tag</a></li>
      <li><a href=\\"https://example.com#this_is_not_a_tag\\">https://example.com#this_is_not_a_tag</a></li>
      </ul>
      <p>Code should be ignored: <code>#this_is_not_a_tag</code></p>
      <pre><code>#this_is_not_a_tag
      </code></pre>"
    `)
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
