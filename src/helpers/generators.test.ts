import {describe, it, expect} from 'vitest'

import {domToHtml} from './dom'
import {header1, list, listItem, paragraph} from './generators'

describe('generators', () => {
  it('generates a header', () => {
    const el = header1('Hello World')
    expect(domToHtml(el)).toEqual('<h1>Hello World</h1>')
  })

  it('generates a list', () => {
    const el = list([listItem(paragraph('Hello')), listItem(paragraph('World'))])
    expect(domToHtml(el)).toEqual('<ul><li><p>Hello</p></li><li><p>World</p></li></ul>')
  })
})
