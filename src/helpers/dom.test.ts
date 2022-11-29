import {describe, it, expect} from 'vitest'

import {DOM, domToHtml} from './dom'

describe('domToHtml', () => {
  it('renders html', () => {
    const structure: DOM = ['div', {class: 'foo', id: 'bar'}, 'Hello', ['span', 'World']]
    const html = domToHtml(structure)
    expect(html).toEqual('<div class="foo" id="bar">Hello<span>World</span></div>')
  })

  it('renders deep html', () => {
    const structure: DOM = [
      'div',
      {class: 'foo', id: 'bar'},
      'Hello',
      ['span', 'World'],
      ['div', {class: 'foo', id: 'bar'}, 'Hello', ['span', 'World']],
    ]
    const html = domToHtml(structure)
    expect(html).toEqual(
      '<div class="foo" id="bar">Hello<span>World</span><div class="foo" id="bar">Hello<span>World</span></div></div>',
    )
  })
})
