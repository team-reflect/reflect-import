import {DOM, domToHtml} from './dom'

describe('domToHtml', () => {
  it('render html', () => {
    const structure: DOM = ['div', {class: 'foo', id: 'bar'}, 'Hello', ['span', 'World']]
    const html = domToHtml(structure)
    expect(html).toEqual('<div class="foo" id="bar">Hello<span>World</span></div>')
  })
})
