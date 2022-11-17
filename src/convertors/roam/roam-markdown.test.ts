import {roamMarkdownToHtml} from './roam-markdown'

describe('nodesFromRoamMarkdown', () => {
  it('skips headings', () => {
    const html = roamMarkdownToHtml('# foo', {
      graphId: '123',
      linkHost: 'http://example.com',
    })
    expect(html).toEqual('<p># foo</p>')
  })
})
