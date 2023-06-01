import {it, describe, expect} from 'vitest'

import {getDailyDate, parseTimestamp} from './mem-helpers'

describe('parseTimestamp', () => {
  it('should parse a timestamp', () => {
    expect(parseTimestamp('2022-10-28T20:12:35.226Z')).toMatchInlineSnapshot(
      '2022-10-28T20:12:35.226Z',
    )
  })
})

describe('getDailyDate', () => {
  it('should return a daily date for a daily note', () => {
    expect(
      getDailyDate({
        id: '123',
        title: 'May 8, 2023',
        markdown: '## Hello',
        tags: ['daily-mem'],
        created: '2022-10-28T20:12:35.226Z',
        updated: '2022-10-28T20:12:35.226Z',
      }),
    ).toMatchInlineSnapshot('2023-05-08T00:00:00.000Z')
  })

  it('should be undefined for a non-daily note', () => {
    expect(
      getDailyDate({
        id: '123',
        title: 'Hello',
        markdown: '## Hello',
        tags: [],
        created: '2022-10-28T20:12:35.226Z',
        updated: '2022-10-28T20:12:35.226Z',
      }),
    ).toMatchInlineSnapshot('undefined')
  })
})
