import {describe, it, expect} from 'vitest'

import exampleGraph2 from './fixtures/roam-example-graph2.json'
import {RoamBacklinks} from './roam-backlinks'
import {RoamNote} from './types'

describe('RoamBacklinks', () => {
  const getTitleToIdMapFromNotes = (notes: RoamNote[]) => {
    const backlinks = new RoamBacklinks(notes)
    return backlinks.titleToIdMap
  }

  it('should aggregate backlinks to note ids', () => {
    expect(getTitleToIdMapFromNotes(exampleGraph2)).toMatchInlineSnapshot(`
      Map {
        "Anonymous" => "roam-kfEoMevXn",
        "December 2nd, 2022" => "roam-12-02-2022",
        "JCQcHmeGl" => "roam-12-02-2022",
        "XEzJ_5YZw" => "roam-12-02-2022",
        "J-p7gSCLd" => "roam-12-02-2022",
        "P3TaGjdYU" => "roam-12-02-2022",
        "uWA-r0mgd" => "roam-12-02-2022",
        "Sy3Zn4PK-" => "roam-12-02-2022",
        "L8RjVb-BQ" => "roam-12-02-2022",
        "Richard" => "roam-DOBbkj36v",
        "HscUS9B1m" => "roam-DOBbkj36v",
        "LcbA2Kdnp" => "roam-DOBbkj36v",
        "Person" => "roam-KdxCBc-jS",
        "Kj2gqAaIT" => "roam-KdxCBc-jS",
        "OekWfoURN" => "roam-KdxCBc-jS",
        "ric" => "roam-MH_5XfEZ-",
        "TODO" => "roam-ijCI34X3F",
        "DONE" => "roam-U4DhTc5Fh",
      }
    `)

    expect(getTitleToIdMapFromNotes(exampleGraph2)).toMatchInlineSnapshot(`
      Map {
        "Anonymous" => "roam-kfEoMevXn",
        "December 2nd, 2022" => "roam-12-02-2022",
        "JCQcHmeGl" => "roam-12-02-2022",
        "XEzJ_5YZw" => "roam-12-02-2022",
        "J-p7gSCLd" => "roam-12-02-2022",
        "P3TaGjdYU" => "roam-12-02-2022",
        "uWA-r0mgd" => "roam-12-02-2022",
        "Sy3Zn4PK-" => "roam-12-02-2022",
        "L8RjVb-BQ" => "roam-12-02-2022",
        "Richard" => "roam-DOBbkj36v",
        "HscUS9B1m" => "roam-DOBbkj36v",
        "LcbA2Kdnp" => "roam-DOBbkj36v",
        "Person" => "roam-KdxCBc-jS",
        "Kj2gqAaIT" => "roam-KdxCBc-jS",
        "OekWfoURN" => "roam-KdxCBc-jS",
        "ric" => "roam-MH_5XfEZ-",
        "TODO" => "roam-ijCI34X3F",
        "DONE" => "roam-U4DhTc5Fh",
      }
    `)

    expect(getTitleToIdMapFromNotes(exampleGraph2)).toMatchInlineSnapshot(`
      Map {
        "Anonymous" => "roam-kfEoMevXn",
        "December 2nd, 2022" => "roam-12-02-2022",
        "JCQcHmeGl" => "roam-12-02-2022",
        "XEzJ_5YZw" => "roam-12-02-2022",
        "J-p7gSCLd" => "roam-12-02-2022",
        "P3TaGjdYU" => "roam-12-02-2022",
        "uWA-r0mgd" => "roam-12-02-2022",
        "Sy3Zn4PK-" => "roam-12-02-2022",
        "L8RjVb-BQ" => "roam-12-02-2022",
        "Richard" => "roam-DOBbkj36v",
        "HscUS9B1m" => "roam-DOBbkj36v",
        "LcbA2Kdnp" => "roam-DOBbkj36v",
        "Person" => "roam-KdxCBc-jS",
        "Kj2gqAaIT" => "roam-KdxCBc-jS",
        "OekWfoURN" => "roam-KdxCBc-jS",
        "ric" => "roam-MH_5XfEZ-",
        "TODO" => "roam-ijCI34X3F",
        "DONE" => "roam-U4DhTc5Fh",
      }
    `)
  })

  it('should aggregate note titles', () => {
    const backlinks = new RoamBacklinks(exampleGraph2)
    expect(backlinks.idToTitleMap).toMatchInlineSnapshot(`
      Map {
        "roam-kfEoMevXn" => "Anonymous",
        "roam-12-02-2022" => "December 2nd, 2022",
        "roam-JCQcHmeGl" => "December 2nd, 2022",
        "roam-XEzJ_5YZw" => "December 2nd, 2022",
        "roam-J-p7gSCLd" => "December 2nd, 2022",
        "roam-P3TaGjdYU" => "December 2nd, 2022",
        "roam-uWA-r0mgd" => "December 2nd, 2022",
        "roam-Sy3Zn4PK-" => "December 2nd, 2022",
        "roam-L8RjVb-BQ" => "December 2nd, 2022",
        "roam-DOBbkj36v" => "Richard",
        "roam-HscUS9B1m" => "Richard",
        "roam-LcbA2Kdnp" => "Richard",
        "roam-KdxCBc-jS" => "Person",
        "roam-Kj2gqAaIT" => "Person",
        "roam-OekWfoURN" => "Person",
        "roam-MH_5XfEZ-" => "ric",
        "roam-ijCI34X3F" => "TODO",
        "roam-U4DhTc5Fh" => "DONE",
      }
    `)
  })
})
