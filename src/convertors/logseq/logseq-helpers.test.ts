import {describe, it, expect} from 'vitest'

import {tryParseTime, toLogseqId} from './logseq-helpers'

describe('LogseqHelpers', () => {
  it('parses some dates to time', () => {
    expect(tryParseTime('September 14th, 2020')).toEqual(1600041600000)
    expect(tryParseTime('May 4th, 2023')).toEqual(1683158400000)
    expect(tryParseTime('Thu, 05/04/2023')).toEqual(1683158400000)
    expect(tryParseTime('05/04/2023')).toEqual(1683158400000)
    expect(tryParseTime('Page Title')).toBeUndefined()
    expect(tryParseTime('12345')).toBeUndefined()
  })
  it('converts some ids', () => {
    expect(toLogseqId('abc-123', 'Page Title')).toEqual('logseq-abc-123')
    expect(toLogseqId('123-abc', 'Another Page')).toEqual('logseq-123-abc')
    expect(toLogseqId('abc-123', '05/04/2023')).toEqual('04052023')
    expect(toLogseqId('abc-123', 'September 14th, 2020')).toEqual('14092020')
    expect(toLogseqId(undefined, 'September 14th, 2020')).toEqual('14092020')
    expect(toLogseqId(undefined, 'Page Title')).toEqual('pagetitle')
  })
})
