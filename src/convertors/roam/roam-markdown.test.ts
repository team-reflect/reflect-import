import {markdownToHtml} from '../../helpers/markdown/markdown'
import {describe, it, expect} from 'vitest'

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
