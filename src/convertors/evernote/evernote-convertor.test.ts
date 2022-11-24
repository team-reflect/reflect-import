import {describe, expect, it} from 'vitest'
import {EvernoteConvertor} from './evernote-convertor'

describe('EvernoteConvertor', () => {
  it('converts evernote to HTML', () => {
    const convertor = new EvernoteConvertor({graphId: '123'})

    const [{subject, html}] = convertor.convert(
      `<?xml version="1.0" encoding="UTF-8"?>
    <en-export export-date="20221224T010732Z" application="Evernote" version="10.49.4">
      <note>
        <title>My first note</title>
        <created>20221124T001227Z</created>
        <updated>20221124T010654Z</updated>
        <note-attributes>
        </note-attributes>
        <content>
          <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><h2>h2 title</h2><ul><li><div>list <a href="https://google.com">link</a> </div></li></ul></en-note>      ]]>
        </content>
      </note>
    </en-export>    
    `,
    )

    expect(subject).toEqual('My first note')
    expect(html).toMatchInlineSnapshot(
      '"<h2>h2 title</h2><ul><li><div>list <a href=\\"https://google.com\\">link</a> </div></li></ul>"',
    )
  })

  it('raises an error if parsing fails', () => {
    const convertor = new EvernoteConvertor({graphId: '123'})

    expect(() => convertor.convert('')).toThrow()
  })
})
