import {markdownToHtml} from '../../helpers/markdown'

describe('nodesFromRoamMarkdown', () => {
  it('skips headings', () => {
    const {html} = markdownToHtml('# foo', {
      graphId: '123',
      linkHost: 'http://example.com',
      constructsToDisable: ['thematicBreak', 'list', 'headingAtx'],
    })
    expect(html).toEqual('<p># foo</p>')
  })
})
