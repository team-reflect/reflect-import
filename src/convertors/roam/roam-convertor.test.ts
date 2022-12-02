import {describe, it, expect} from 'vitest'

import {formatHtml} from '../../testing/format-html'
import dailyNotes from './fixtures/roam-daily-notes.json'
import exampleGraph from './fixtures/roam-example-graph.json'
import todoNotes from './fixtures/roam-todos.json'
import urlsNotes from './fixtures/roam-urls.json'
import {RoamConvertor} from './roam-convertor'
import {RoamNote} from './types'

describe('RoamConvertor', () => {
  const ROAM_SAMPLE: RoamNote = {
    title: 'The Great CEO Within',
    uid: '09-14-2020',
    'edit-time': 1600057101270,
    children: [
      {
        string: 'Author:: #[[Matt Mochary]]',
        'create-time': 1599161754087,
        uid: '-rC8kxJH4',
        'edit-time': 1600958531049,
        refs: [
          {
            uid: 'uuid123',
          },
        ],
      },
      {
        string: '**Chapter 1: Getting Started**',
        'create-time': 1576448157574,
        children: [
          {
            string:
              'This is explained clearly and thoroughly in Disciplined Entrepreneurship by Bill Aulet. I won’t repeat or even summarize what he wrote. If you haven’t yet launched or achieved more than $1 million of revenue, go read Bill’s book first.',
            'create-time': 1576093423770,
            uid: 'QhiYH-2V4',
            'edit-time': 1600716930617,
          },
        ],
        uid: 'bn1X-uy0x',
        'edit-time': 1600716930617,
      },
    ],
  }

  const htmlFromRoamNote = (note: RoamNote, graphId: string): string => {
    const notesJson = JSON.stringify([note])
    const convertor = new RoamConvertor({graphId})
    const {notes} = convertor.convert({data: notesJson})
    const [{html}] = notes
    return html
  }

  it('parseContentFromHTML', () => {
    const result = htmlFromRoamNote(ROAM_SAMPLE, '123')

    expect(formatHtml(result)).toMatchInlineSnapshot(
      `
      "<h1>The Great CEO Within</h1>
      <ul>
        <li>
          <p>
            Author::
            <a class=\\"backlink new\\" href=\\"https://reflect.app/g/123/roam-uuid123\\"
              >Matt Mochary</a
            >
          </p>
        </li>
        <li>
          <p><strong>Chapter 1: Getting Started</strong></p>
          <ul>
            <li>
              <p>
                This is explained clearly and thoroughly in Disciplined
                Entrepreneurship by Bill Aulet. I won’t repeat or even summarize what
                he wrote. If you haven’t yet launched or achieved more than $1 million
                of revenue, go read Bill’s book first.
              </p>
            </li>
          </ul>
        </li>
      </ul>
      "
    `,
    )
  })

  describe('generateContentFromRoamNote', () => {
    it('handles both formats of todos', () => {
      const note: RoamNote = {
        title: 'note1',
        uid: '123',
        'edit-time': 12345,
        children: [
          {
            string: 'parent',
            'create-time': 12345,
            uid: '123',
            'edit-time': 12345,
            children: [
              {
                string: `{{TODO}}  todo 1`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
              {
                string: `{{[[TODO]]}}  todo 2`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
            ],
          },
        ],
      }

      const doc = htmlFromRoamNote(note, '123')
      expect(doc).toMatchSnapshot()
    })

    it('handles list with mixed bullets and tasks', () => {
      const note: RoamNote = {
        title: 'note1',
        uid: '123',
        'edit-time': 12345,
        children: [
          {
            string: 'parent',
            'create-time': 12345,
            uid: '123',
            'edit-time': 12345,
            children: [
              {
                string: `{{TODO}}  todo 1`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
              {
                string: `{{DONE}}  todo 2`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
              {
                string: `bullet 1`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
              {
                string: `bullet 2`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
              {
                string: `{{TODO}}  todo 3`,
                'create-time': 12345,
                uid: '456',
                'edit-time': 12345,
                children: [],
              },
            ],
          },
        ],
      }

      const doc = htmlFromRoamNote(note, '123')

      expect(doc).toMatchSnapshot()
    })
  })

  it('handles code blocks', () => {
    const node: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [
        {
          string: '```javascript\nlonger code snippet\n```',
          'create-time': 12345,
          uid: '123',
          'edit-time': 12345,
        },
      ],
    }

    const html = htmlFromRoamNote(node, '123')

    expect(html).toMatchInlineSnapshot(`
    "<h1>note1</h1><ul><li><pre><code class=\\"language-javascript\\">longer code snippet
    </code></pre></li></ul>"
  `)
  })

  it('handles ordered lists', () => {
    const node: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [
        {
          string: '1. foo',
          'create-time': 12345,
          uid: '123',
          'edit-time': 12345,
          children: [],
        },
      ],
    }

    const html = htmlFromRoamNote(node, '123')
    expect(html).toMatchInlineSnapshot(
      '"<h1>note1</h1><ul><li><p>1. foo</p><ul></ul></li></ul>"',
    )
  })

  it('handles blockquotes', () => {
    const node: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [
        {
          string: '> hello world',
          'create-time': 12345,
          uid: '123',
          'edit-time': 12345,
          children: [],
        },
      ],
    }

    const html = htmlFromRoamNote(node, '123')
    expect(formatHtml(html)).toMatchInlineSnapshot(`
    "<h1>note1</h1>
    <ul>
      <li>
        <blockquote>
          <p>hello world</p>
        </blockquote>
        <ul></ul>
      </li>
    </ul>
    "
  `)
  })

  it('generates content with the roam note', () => {
    const note: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [
        {
          string: 'hello world',
          'create-time': 12345,
          uid: '123',
          'edit-time': 12345,
          children: [
            {
              string: `everything is **awesome** #foo`,
              'create-time': 12345,
              uid: '456',
              'edit-time': 12345,
              children: [
                {
                  string: `wahooo!\n\ngood times`,
                  'create-time': 12345,
                  uid: '789',
                  'edit-time': 12345,
                },
              ],
            },
          ],
        },
      ],
    }

    const html = htmlFromRoamNote(note, '123')

    expect(formatHtml(html)).toMatchInlineSnapshot(`
    "<h1>note1</h1>
    <ul>
      <li>
        <p>hello world</p>
        <ul>
          <li>
            <p>
              everything is <strong>awesome</strong>
              <a class=\\"backlink new\\" href=\\"https://reflect.app/g/123/foo\\">foo</a>
            </p>
            <ul>
              <li>
                <p>wahooo!</p>
                <p>good times</p>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    "
  `)
  })

  it('handles backlinks', () => {
    const note: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [
        {
          string: 'link to [[another note]]',
          'create-time': 12345,
          uid: '123',
          'edit-time': 12345,
          children: [],
        },
      ],
    }

    const html = htmlFromRoamNote(note, '123')

    expect(html).toMatchInlineSnapshot(
      '"<h1>note1</h1><ul><li><p>link to <a class=\\"backlink new\\" href=\\"https://reflect.app/g/123/another note\\">another note</a></p><ul></ul></li></ul>"',
    )
  })

  it('parses todo', () => {
    const roamNote = todoNotes[0]
    const html = htmlFromRoamNote(roamNote, '123')

    expect(html).toMatchInlineSnapshot(
      '"<h1>test1</h1><ul><li><input type=\\"checkbox\\" ><p>item 1</p></li><li><input type=\\"checkbox\\" checked><p>item 2</p></li><li></li></ul>"',
    )
  })

  it('parses urls', () => {
    const roamNote = urlsNotes[0]
    const html = htmlFromRoamNote(roamNote, '123')

    expect(html).toMatchInlineSnapshot(
      '"<h1>urls</h1><ul><li><p><a href=\\"https://reflect.app\\">https://reflect.app</a></p></li><li></li></ul>"',
    )
  })

  it('parses daily notes', () => {
    const convertor = new RoamConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(dailyNotes)})
    const [note] = notes

    expect(note.subject).toEqual('September 14th, 2020')
    expect(note.dailyAt).toEqual(1600041600000)
  })

  describe('generateListFromRoamNoteString', () => {
    it('doesnt fail with empty string', () => {
      const note: RoamNote = {
        title: 'note1',
        uid: '123',
        'edit-time': 12345,
        children: [
          {
            string: '',
            'create-time': 12345,
            uid: '123',
            'edit-time': 12345,
          },
        ],
      }

      const html = htmlFromRoamNote(note, '123')

      expect(html).toMatchInlineSnapshot('"<h1>note1</h1><ul><li></li></ul>"')
    })
  })

  describe('createdAt', () => {
    it('should be extracted from the title', () => {
      const note: RoamNote = {
        title: 'October 10th, 2020',
        uid: '123',
        'edit-time': 12345,
        children: [
          {
            string: '',
            'create-time': 12345,
            uid: '123',
            'edit-time': 12345,
          },
        ],
      }

      const convertor = new RoamConvertor({graphId: '123'})
      const {notes} = convertor.convert({data: JSON.stringify([note])})

      const [{createdAt, dailyAt}] = notes

      expect(createdAt).toEqual(new Date('2020-10-10T00:00:00.000Z').getTime())
      expect(dailyAt).toEqual(new Date('2020-10-10T00:00:00.000Z').getTime())
    })
  })

  it('parses exampleGraph', () => {
    const convertor = new RoamConvertor({graphId: '123'})
    const {notes} = convertor.convert({data: JSON.stringify(exampleGraph)})

    expect(notes).toMatchSnapshot()
  })
})
