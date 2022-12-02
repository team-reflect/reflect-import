import {describe, it, expect} from 'vitest'

import {extractBacklinks} from './roam-helpers'

describe('extractBacklinks', () => {
  it('should extract backlinks', () => {
    expect(extractBacklinks('[[Example]] of a [[backlink]]')).toEqual([
      'Example',
      'backlink',
    ])
  })

  it('should also support (( backlinks', () => {
    expect(extractBacklinks('[[Example]] of a ((backlink))')).toEqual([
      'Example',
      'backlink',
    ])
  })
})
