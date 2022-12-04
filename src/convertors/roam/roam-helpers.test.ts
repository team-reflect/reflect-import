import {describe, it, expect} from 'vitest'

import {
  convertTagsToBacklinks,
  extractBacklinks,
  extractTodos,
  normalizeNoteString,
} from './roam-helpers'

describe('extractBacklinks', () => {
  it('should extract backlinks', () => {
    expect(extractBacklinks('[[Example]] of a [[backlink]]')).toEqual([
      'Example',
      'backlink',
    ])
  })
})

describe('tagsToBacklinks', () => {
  it('should convert tags to backlinks', () => {
    expect(
      convertTagsToBacklinks(
        'This is a #tag and this is another #[[tag]] and this should be left [[alone]]',
      ),
    ).toBe(
      'This is a [[tag]] and this is another [[tag]] and this should be left [[alone]]',
    )
  })
})

describe('extractTodos', () => {
  it('should extract todos', () => {
    expect(extractTodos('{{DONE}} This is a [[Backlink]]')).toMatchInlineSnapshot(`
      {
        "checked": true,
        "parsed": "This is a [[Backlink]]",
      }
    `)

    expect(extractTodos('{{TODO}} This is a [[Backlink]]')).toMatchInlineSnapshot(`
      {
        "checked": false,
        "parsed": "This is a [[Backlink]]",
      }
    `)

    expect(extractTodos('{{[[TODO]]}} This is a [[Backlink]]')).toMatchInlineSnapshot(`
      {
        "checked": false,
        "parsed": "This is a [[Backlink]]",
      }
    `)

    expect(extractTodos('[[TODO]] This is a [[Backlink]]')).toMatchInlineSnapshot(`
      {
        "checked": undefined,
        "parsed": "[[TODO]] This is a [[Backlink]]",
      }
    `)
  })
})

describe('normalizeNoteString', () => {
  it('should normalize a note string', () => {
    expect(normalizeNoteString('This is a [[Backlink]] and this is a #backlink'))
      .toMatchInlineSnapshot(`
      {
        "checked": undefined,
        "markdown": "This is a [[Backlink]] and this is a [[backlink]]",
      }
    `)
  })

  it('should normalize tasks', () => {
    expect(normalizeNoteString('{{TODO}} This is a [[Backlink]] and this is a #backlink'))
      .toMatchInlineSnapshot(`
      {
        "checked": false,
        "markdown": "This is a [[Backlink]] and this is a [[backlink]]",
      }
    `)
  })
})
