import {describe, expect, it} from 'vitest'

import {toNoteId} from './to-id'

describe('toNoteId', () => {
  it('should convert a string to a valid id', () => {
    expect(toNoteId('Hello World')).toBe('helloworld')
  })

  it('should allow dashes', () => {
    expect(toNoteId('Hello-World')).toBe('hello-world')
  })
})
