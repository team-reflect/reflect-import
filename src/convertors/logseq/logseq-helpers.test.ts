import {describe, it, expect} from 'vitest'

import {tryParseDate} from './logseq-helpers'

describe('LogseqHelpers', () => {
  it('parses some dates', () => {
    expect(tryParseDate('September 14th, 2020')).toEqual(1600041600000)
    expect(tryParseDate('May 4th, 2023')).toEqual(1683158400000)
    expect(tryParseDate('Thu, 05/04/2023')).toEqual(1683158400000)
    expect(tryParseDate('05/04/2023')).toEqual(1683158400000)
    expect(tryParseDate('Page Title')).toBeUndefined()
    expect(tryParseDate('12345')).toBeUndefined()
  })
})
