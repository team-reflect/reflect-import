import {describe, it, expect} from 'vitest'

import {OpmlConvertor} from './opml-convertor'

const opmlData = `<?xml version="1.0"?>
<opml version="2.0">
  <head>
    <ownerEmail>
      alex@alexmaccaw.com
    </ownerEmail>
  </head>
  <body>
    <outline text="Welcome to WorkFlowy!">
      <outline text="WorkFlowy is an infinite document. Every bullet in WorkFlowy is also a document (it's fractal!).">
        <outline text="asdf">
          <outline text="1 Backlink">
            <outline text="&lt;a href=&quot;https://workflowy.com/#/2a3e5b46226a&quot;&gt;asdf&lt;/a&gt; " />
          </outline>
        </outline>
        <outline text="asdf" />
        <outline text="&lt;a href=&quot;https://workflowy.com/#/2a3e5b46226a&quot;&gt;asdf&lt;/a&gt; " />
        <outline text="" />
      </outline>
      <outline text="To view any bullet as its own document, just click it.">
        <outline text="" />
      </outline>
      <outline text="This model is simple, but extremely #powerful.">
        <outline text="It lets you easily organize thousands of notes, ideas and projects, and focus in on one at a time" />
        <outline text="&lt;b&gt;Things to try&lt;/b&gt;">
          <outline text="Click any bullet to zoom in">
            <outline text="blah blah ">
              <outline text="" />
            </outline>
          </outline>
          <outline text="Click the arrow to the left of a bullet to expand or collapse">
            <outline text="&lt;i&gt;Try collapsing that&lt;/i&gt; ☝">
              <outline text="" />
            </outline>
          </outline>
          <outline text="Click any text and just type" />
          <outline text="Hit &amp;lt;enter&amp;gt; to create a new bullet" />
          <outline text="Hit &amp;lt;tab&amp;gt; to indent">
            <outline text="Hit &amp;lt;shift+tab&amp;gt; to outdent" />
          </outline>
          <outline text="Click the #today tag" />
          <outline text="Drag a bullet somewhere else" />
          <outline text="Click the &quot;…&quot; to the left of a bullet and explore the menu" />
          <outline text="Install the &lt;i&gt;mobile&lt;/i&gt; &lt;b&gt;and&lt;/b&gt; desktop apps #today" />
          <outline text="" _note="dfasdf&#10;asdfa&#10;sdf&#10;asdf&#10;asd&#10;fasdfasdfasdf&#10;asdf&#10;asdf&#10;asdf&#10;asdf" />
          <outline text="Share a sub-list with someone">
            <outline text="@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model." />
            <outline text="@Alicia " />
          </outline>
          <outline text="Learn the keyboard shortcuts (they make everything &lt;i&gt;super fast&lt;/i&gt;)" />
          <outline text="Scroll down and explore the demo setup" />
        </outline>
      </outline>
    </outline>
  </body>
</opml>`

describe('ompl convert', () => {
  it('converts ompl to HTML', async () => {
    const convertor = new OpmlConvertor({graphId: '123'})
    const {notes} = await convertor.convert({data: opmlData})
    const [{html}] = notes

    expect(html).toMatchInlineSnapshot(
      '"<h1>Welcome to WorkFlowy!</h1><ul><li><p>Welcome to WorkFlowy!</p><ul><li><p>WorkFlowy is an infinite document. Every bullet in WorkFlowy is also a document (it\'s fractal!).</p><ul><li><p>asdf</p><ul><li><p>1 Backlink</p><ul><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p>1 Backlink</p><ul><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li><li><p>asdf</p></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li><li><p></p></li></ul></li><li><p>asdf</p><ul><li><p>1 Backlink</p><ul><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p>1 Backlink</p><ul><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li></ul></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li><li><p>asdf</p></li><li><p><a href=\\"https://workflowy.com/#/2a3e5b46226a\\">asdf</a> </p></li><li><p></p></li><li><p>To view any bullet as its own document, just click it.</p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>This model is simple, but extremely #powerful.</p><ul><li><p>It lets you easily organize thousands of notes, ideas and projects, and focus in on one at a time</p></li><li><p><b>Things to try</b></p><ul><li><p>Click any bullet to zoom in</p><ul><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click the arrow to the left of a bullet to expand or collapse</p><ul><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click any text and just type</p></li><li><p>Hit &lt;enter&gt; to create a new bullet</p></li><li><p>Hit &lt;tab&gt; to indent</p><ul><li><p>Hit &lt;shift+tab&gt; to outdent</p></li></ul></li><li><p>Hit &lt;shift+tab&gt; to outdent</p></li><li><p>Click the #today tag</p></li><li><p>Drag a bullet somewhere else</p></li><li><p>Click the \\"…\\" to the left of a bullet and explore the menu</p></li><li><p>Install the <i>mobile</i> <b>and</b> desktop apps #today</p></li><li><p></p></li><li><p>Share a sub-list with someone</p><ul><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li></ul></li><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li><li><p>Learn the keyboard shortcuts (they make everything <i>super fast</i>)</p></li><li><p>Scroll down and explore the demo setup</p></li></ul></li><li><p>Click any bullet to zoom in</p><ul><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click the arrow to the left of a bullet to expand or collapse</p><ul><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click any text and just type</p></li><li><p>Hit &lt;enter&gt; to create a new bullet</p></li><li><p>Hit &lt;tab&gt; to indent</p><ul><li><p>Hit &lt;shift+tab&gt; to outdent</p></li></ul></li><li><p>Hit &lt;shift+tab&gt; to outdent</p></li><li><p>Click the #today tag</p></li><li><p>Drag a bullet somewhere else</p></li><li><p>Click the \\"…\\" to the left of a bullet and explore the menu</p></li><li><p>Install the <i>mobile</i> <b>and</b> desktop apps #today</p></li><li><p></p></li><li><p>Share a sub-list with someone</p><ul><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li></ul></li><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li><li><p>Learn the keyboard shortcuts (they make everything <i>super fast</i>)</p></li><li><p>Scroll down and explore the demo setup</p></li></ul></li><li><p>It lets you easily organize thousands of notes, ideas and projects, and focus in on one at a time</p></li><li><p><b>Things to try</b></p><ul><li><p>Click any bullet to zoom in</p><ul><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click the arrow to the left of a bullet to expand or collapse</p><ul><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click any text and just type</p></li><li><p>Hit &lt;enter&gt; to create a new bullet</p></li><li><p>Hit &lt;tab&gt; to indent</p><ul><li><p>Hit &lt;shift+tab&gt; to outdent</p></li></ul></li><li><p>Hit &lt;shift+tab&gt; to outdent</p></li><li><p>Click the #today tag</p></li><li><p>Drag a bullet somewhere else</p></li><li><p>Click the \\"…\\" to the left of a bullet and explore the menu</p></li><li><p>Install the <i>mobile</i> <b>and</b> desktop apps #today</p></li><li><p></p></li><li><p>Share a sub-list with someone</p><ul><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li></ul></li><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li><li><p>Learn the keyboard shortcuts (they make everything <i>super fast</i>)</p></li><li><p>Scroll down and explore the demo setup</p></li></ul></li><li><p>Click any bullet to zoom in</p><ul><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p>blah blah </p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click the arrow to the left of a bullet to expand or collapse</p><ul><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li></ul></li><li><p><i>Try collapsing that</i> ☝</p><ul><li><p></p></li></ul></li><li><p></p></li><li><p>Click any text and just type</p></li><li><p>Hit &lt;enter&gt; to create a new bullet</p></li><li><p>Hit &lt;tab&gt; to indent</p><ul><li><p>Hit &lt;shift+tab&gt; to outdent</p></li></ul></li><li><p>Hit &lt;shift+tab&gt; to outdent</p></li><li><p>Click the #today tag</p></li><li><p>Drag a bullet somewhere else</p></li><li><p>Click the \\"…\\" to the left of a bullet and explore the menu</p></li><li><p>Install the <i>mobile</i> <b>and</b> desktop apps #today</p></li><li><p></p></li><li><p>Share a sub-list with someone</p><ul><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li></ul></li><li><p>@you can share any bullet with different people, no matter where it is. This is an incredibly #powerful sharing model.</p></li><li><p>@Alicia </p></li><li><p>Learn the keyboard shortcuts (they make everything <i>super fast</i>)</p></li><li><p>Scroll down and explore the demo setup</p></li></ul></li></ul>"',
    )
  })
})
