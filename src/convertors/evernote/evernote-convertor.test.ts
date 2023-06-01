import {describe, expect, it} from 'vitest'

import {EvernoteConvertor} from './evernote-convertor'

describe('EvernoteConvertor', () => {
  it('converts evernote to HTML', async () => {
    const convertor = new EvernoteConvertor({graphId: '123'})

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
    const {notes} = await convertor.convert({data})
    const [{subject, html, createdAt, updatedAt}] = notes

    expect(subject).toEqual('My first note')
    expect(html).toMatchInlineSnapshot(
      '"<h2>h2 title</h2><ul><li><div>list <a href=\\"https://google.com\\">link</a> </div></li></ul>"',
    )

    expect(createdAt).toEqual(new Date('2022-11-24T00:12:27.000Z').getTime())
    expect(updatedAt).toEqual(new Date('2022-11-24T01:06:54.000Z').getTime())
  })

  it('raises an error if parsing fails', () => {
    const convertor = new EvernoteConvertor({graphId: '123'})

    expect(async () => await convertor.convert({data: ''})).rejects.toThrow()
  })

  it.each(['&gt;', '&nbsp;', '&mdash;', '&ndash;'])(
    'parses note with html entity',
    async (entity) => {
      const convertor = new EvernoteConvertor({graphId: '123'})

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

      const {notes} = await convertor.convert({data})
      const [{subject, html}] = notes

      expect(subject).toEqual('failing nbsp')
      expect(html).toMatchSnapshot()
    },
  )

  it('deals with new export format', async () => {
    const convertor = new EvernoteConvertor({graphId: '123'})

    const data = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export4.dtd">
    <en-export export-date="20230626T210645Z" application="Evernote" version="10.57.6">
      <note>
        <title>03ef66919375f8b8590833a2597a812d53b5a9ba264a5a0bda010534942f019d</title>
        <created>20221221T211536Z</created>
        <updated>20221221T211536Z</updated>
        <note-attributes>
        </note-attributes>
        <content>
          <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><en-media hash="43ded123ddc3fd40f0d086b0832cfb03" type="application/pdf" /></en-note>      ]]>
        </content>
        <resource>
          <data encoding="base64">
    JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9DcmVhdG9yIChDaHJvbWl1bSkKL1Byb2R1Y2VyIChTa2lhL1BERiBtODMpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyMjAxMTQwNDU2MDErMDAnMDAnKQovTW9kRGF0ZSAoRDoyMDIyMDExNDA0NTYwMSswMCcwMCcpPj4KZW5kb2JqCjMgMCBvYmoKPDwvY2EgMQovQk0gL05vcm1hbD4+CmVuZG9iago1
    IDAgb2JqCjw8L0NBIDEKL2NhIDEKL0xDIDAKL0xKIDAKL0xXIDIKL01MIDQKL1NBIHRydWUKL0JNIC9Ob3JtYWw+PgplbmRvYmoKOCAwIG9iago8PC9UeXBlIC9Bbm5vdAovU3VidHlwZSAvTGluawovRiA0Ci9Cb3JkZXIgWzAgMCAwXQovUmVjdCBbOTAuMDI1MjIzIDMyMC4xODMyMyAxODAuODAwNjYgMzM5LjY4ODY2XQovQSA8PC9UeXBl
    IC9BY3Rpb24KL1MgL1VSSQovVVJJIChtYW
          </data>
          <mime>application/pdf</mime>
          <resource-attributes>
            <file-name>03ef66919375f8b8590833a2597a812d53b5a9ba264a5a0bda010534942f019d.pdf</file-name>
            <source-url>en-cache://tokenKey%3D%22AuthToken%3AUser%3A238111762%22+b68a8f52-f5e2-8706-09c0-abf696c1e654+43ded123ddc3fd40f0d086b0832cfb03+https://www.evernote.com/shard/s480/res/b8006f4b-3dd9-de53-adf3-1025410957b8</source-url>
          </resource-attributes>
        </resource>
      </note>
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

    const {notes} = await convertor.convert({data})
    expect(notes).toMatchInlineSnapshot(`
      [
        {
          "createdAt": 1669248747000,
          "html": "<h2>h2 title</h2><ul><li><div>list <a href=\\"https://google.com\\">link</a> </div></li></ul>",
          "id": "enex-1myfirstnote",
          "subject": "My first note",
          "updatedAt": 1669252014000,
        },
      ]
    `)
  })
})
