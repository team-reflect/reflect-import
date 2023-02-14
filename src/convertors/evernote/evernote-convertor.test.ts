import {describe, expect, it} from 'vitest'

import {EvernoteConvertor} from './evernote-convertor'

describe('EvernoteConvertor', () => {
  it('converts evernote to HTML', () => {
    const convertor = new EvernoteConvertor()

    const data = `<?xml version="1.0" encoding="UTF-8"?>
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
  `
    const {notes} = convertor.convert({data})
    const [{subject, html, createdAt, updatedAt}] = notes

    expect(subject).toEqual('My first note')
    expect(html).toMatchInlineSnapshot(
      '"<h2>h2 title</h2><ul><li><div>list <a href=\\"https://google.com\\">link</a> </div></li></ul>"',
    )

    expect(createdAt).toEqual(new Date('2022-11-24T00:12:27.000Z').getTime())
    expect(updatedAt).toEqual(new Date('2022-11-24T01:06:54.000Z').getTime())
  })

  it('raises an error if parsing fails', () => {
    const convertor = new EvernoteConvertor()

    expect(() => convertor.convert({data: ''})).toThrow()
  })

  it.each(['&gt;', '&nbsp;', '&mdash;', '&ndash;'])(
    'parses note with html entity',
    (entity) => {
      const convertor = new EvernoteConvertor()

      const data = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export4.dtd">
    <en-export export-date="20221230T101804Z" application="Evernote" version="10.49.4">
      <note>
        <title>failing nbsp</title>
        <created>20191201T063018Z</created>
        <updated>20221130T101752Z</updated>
        <note-attributes>
        </note-attributes>
        <content>
          <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><div>foo ${entity} bar</div></en-note>      ]]>
        </content>
      </note>
    </en-export>`

      const {notes} = convertor.convert({data})
      const [{subject, html}] = notes

      expect(subject).toEqual('failing nbsp')
      expect(html).toMatchSnapshot()
    },
  )
})
