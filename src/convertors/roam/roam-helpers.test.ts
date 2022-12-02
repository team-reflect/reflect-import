import {describe, it, expect} from 'vitest'

import exampleGraph2 from './fixtures/roam-example-graph2.json'
import {
  aggregateBacklinksToNoteIds,
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

describe('aggregateBacklinksToNoteIds', () => {
  it('should aggregate backlinks to note ids', () => {
    expect(aggregateBacklinksToNoteIds(exampleGraph2[0])).toMatchInlineSnapshot(`
      Map {
        "Anonymous" => "roam-kfEoMevXn",
      }
    `)

    expect(aggregateBacklinksToNoteIds(exampleGraph2[1])).toMatchInlineSnapshot(`
      Map {
        "December 2nd, 2022" => "roam-12-02-2022",
        "JCQcHmeGl" => "roam-12-02-2022",
        "XEzJ_5YZw" => "roam-12-02-2022",
        "J-p7gSCLd" => "roam-12-02-2022",
        "P3TaGjdYU" => "roam-12-02-2022",
        "uWA-r0mgd" => "roam-12-02-2022",
        "Sy3Zn4PK-" => "roam-12-02-2022",
        "L8RjVb-BQ" => "roam-12-02-2022",
      }
    `)

    expect(aggregateBacklinksToNoteIds(exampleGraph2[2])).toMatchInlineSnapshot(`
      Map {
        "Richard" => "roam-DOBbkj36v",
        "HscUS9B1m" => "roam-DOBbkj36v",
        "LcbA2Kdnp" => "roam-DOBbkj36v",
      }
    `)
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
