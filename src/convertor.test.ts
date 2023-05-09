import {describe, it, expect} from 'vitest'

import {convertorTypes} from './index'

describe('convertorTypes', () => {
  it('should be a record of FilePickerAcceptType[]', () => {
    expect(convertorTypes).toMatchInlineSnapshot(`
      {
        "evernote": [
          {
            "accept": {
              "application/enex": [
                ".enex",
              ],
            },
            "description": "Evernote ENEX",
          },
        ],
        "html": [
          {
            "accept": {
              "text/html": [
                ".html",
                ".htm",
              ],
            },
            "description": "HTML files",
          },
        ],
        "logseq": [
          {
            "accept": {
              "application/json": [
                ".json",
              ],
            },
            "description": "Logseq JSON",
          },
        ],
        "markdown": [
          {
            "accept": {
              "text/markdown": [
                ".md",
              ],
            },
            "description": "Markdown files",
          },
        ],
        "mem": [
          {
            "accept": {
              "application/json": [
                ".json",
              ],
            },
            "description": "Mem JSON",
          },
        ],
        "opml": [
          {
            "accept": {
              "application/opml": [
                ".opml",
              ],
            },
            "description": "OPML (Workflowy)",
          },
        ],
        "roam": [
          {
            "accept": {
              "application/json": [
                ".json",
              ],
            },
            "description": "Roam Research JSON",
          },
        ],
      }
    `)
  })
})
