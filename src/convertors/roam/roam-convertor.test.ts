import {RoamConvertor} from './roam-convertor'
import {RoamNote, RoamNoteString} from './types'

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

const CONTENT_SAMPLE = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {level: 1},
      content: [{type: 'text', text: 'The Great CEO Within'}],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          attrs: {closed: false, nested: false},
          content: [
            {
              type: 'paragraph',
              content: [
                {type: 'text', text: 'Author:: '},
                {
                  attrs: {
                    id: 'mattmochary',
                    label: 'Matt Mochary',
                  },
                  type: 'backlink',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          attrs: {closed: false, nested: false},
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{type: 'bold'}],
                  text: 'Chapter 1: Getting Started',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  attrs: {
                    closed: false,
                    nested: false,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text:
                            'This is explained clearly and thoroughly in Disciplined Entrepreneurship by Bill Aulet. I won’t repeat or even summarize what he wrote. If you haven’t yet launched or achieved more than $1 million of revenue, go read Bill’s book first.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const htmlFromRoamNote = (note: RoamNote, graphId: string) =>
  new RoamConvertor({graphId}).toHtml(JSON.stringify(note))

test('parseContentFromHTML', () => {
  const result = htmlFromRoamNote(ROAM_SAMPLE, '123')

  expect(result).toMatchSnapshot()
})

describe('generateContentFromRoamNote', () => {
  it('handles both formats of todos', () => {
    const noteString: RoamNoteString = {
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
    }

    const note: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [noteString],
    }

    const doc = htmlFromRoamNote(note, '123')
    expect(doc).toMatchSnapshot()
  })

  it('handles list with mixed bullets and tasks', () => {
    const noteString: RoamNoteString = {
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
    }

    const note: RoamNote = {
      title: 'note1',
      uid: '123',
      'edit-time': 12345,
      children: [noteString],
    }

    const doc = htmlFromRoamNote(note, '123')

    expect(doc).toMatchSnapshot()
  })
})

// it('handles code blocks', () => {
//   const node = generateListItemFromRoamNoteString(
//     {
//       string: '```javascript\nlonger code snippet\n```',
//       'create-time': 12345,
//       uid: '123',
//       'edit-time': 12345,
//       children: [],
//     },
//     '123',
//   )

//   const html = htmlFromNode(node)

//   expect(html).toEqual(
//     `<li class="remirror-list-item-with-custom-mark"><span class="remirror-list-item-marker-container"><div class="remirror-collapsible-list-item-button"></div></span><div><pre spellcheck="false" class="language-javascript"><code data-code-block-language="javascript">longer code snippet\n</code></pre></div></li>`,
//   )
// })

//   it('handles ordered lists', () => {
//     const node = generateListItemFromRoamNoteString(
//       {
//         string: '1. foo',
//         'create-time': 12345,
//         uid: '123',
//         'edit-time': 12345,
//         children: [],
//       },
//       '123',
//     )

//     const html = htmlFromNode(node)
//     expect(html).toEqual(
//       `<li class="remirror-list-item-with-custom-mark"><span class="remirror-list-item-marker-container"><div class="remirror-collapsible-list-item-button"></div></span><div><p>1. foo</p></div></li>`,
//     )
//   })

//   it('handles blockquotes', () => {
//     const node = generateListItemFromRoamNoteString(
//       {
//         string: '> hello world',
//         'create-time': 12345,
//         uid: '123',
//         'edit-time': 12345,
//         children: [],
//       },
//       '123',
//     )

//     const html = htmlFromNode(node)
//     expect(formatHtml(html)).toMatchInlineSnapshot(`
//       "<li class=\\"remirror-list-item-with-custom-mark\\">
//         <span class=\\"remirror-list-item-marker-container\\"
//           ><div class=\\"remirror-collapsible-list-item-button\\"></div
//         ></span>
//         <div>
//           <blockquote><p>hello world</p></blockquote>
//         </div>
//       </li>
//       "
//     `)
//   })

//   it('generates content with the roam note', () => {
//     const noteString: RoamNoteString = {
//       string: 'hello world',
//       'create-time': 12345,
//       uid: '123',
//       'edit-time': 12345,
//       children: [
//         {
//           string: `everything is **awesome** #foo`,
//           'create-time': 12345,
//           uid: '456',
//           'edit-time': 12345,
//           children: [
//             {
//               string: `wahooo!\n\ngood times`,
//               'create-time': 12345,
//               uid: '789',
//               'edit-time': 12345,
//             },
//           ],
//         },
//       ],
//     }

//     const note: RoamNote = {
//       title: 'note1',
//       uid: '123',
//       'edit-time': 12345,
//       children: [noteString],
//     }

//     const doc = htmlFromRoamNote(note, '123')
//     const html = htmlFromNode(doc)

//     expect(formatHtml(html)).toMatchInlineSnapshot(`
//       "<h1>note1</h1>
//       <ul>
//         <li class=\\"remirror-list-item-with-custom-mark\\">
//           <span class=\\"remirror-list-item-marker-container\\"
//             ><div class=\\"remirror-collapsible-list-item-button\\"></div
//           ></span>
//           <div>
//             <p>hello world</p>
//             <ul>
//               <li class=\\"remirror-list-item-with-custom-mark\\">
//                 <span class=\\"remirror-list-item-marker-container\\"
//                   ><div class=\\"remirror-collapsible-list-item-button\\"></div
//                 ></span>
//                 <div>
//                   <p>
//                     everything is <strong>awesome</strong>
//                     <a href=\\"https://reflect.app/g/123/foo\\">foo</a>
//                   </p>
//                   <ul>
//                     <li class=\\"remirror-list-item-with-custom-mark\\">
//                       <span class=\\"remirror-list-item-marker-container\\"
//                         ><div class=\\"remirror-collapsible-list-item-button\\"></div
//                       ></span>
//                       <div>
//                         <p>wahooo!</p>
//                         <p>good times</p>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </li>
//       </ul>
//       "
//     `)
//   })

//   it('handles backlinks', () => {
//     const noteString: RoamNoteString = {
//       string: 'link to [[another note]]',
//       'create-time': 12345,
//       uid: '123',
//       'edit-time': 12345,
//       children: [],
//     }

//     const note: RoamNote = {
//       title: 'note1',
//       uid: '123',
//       'edit-time': 12345,
//       children: [noteString],
//     }

//     const doc = htmlFromRoamNote(note, '123')

//     const backlink = doc.content
//       .child(1)
//       .content.child(0)
//       .content.child(0)
//       .content.child(1)

//     expect(backlink.attrs['id']).toEqual('anothernote')
//   })
// })

// describe('generateListFromRoamNoteString', () => {
//   it('doesnt fail with empty string', () => {
//     const note: RoamNoteString = {
//       string: '',
//       'create-time': 12345,
//       uid: '123',
//       'edit-time': 12345,
//     }

//     const nodes = collectChildren(generateListItemFromRoamNoteString(note, '123'))
//     const doc = g.doc([g.header('note'), ...nodes])
//     const html = htmlFromNode(doc)

//     expect(html).toEqual('<h1>note</h1><p></p>')
//   })
// })
