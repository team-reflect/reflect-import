import {describe, expect, it} from 'vitest'

import {HtmlConvertor} from './html-convertor'

describe('HtmlConvertor', () => {
  it('converts html', () => {
    const convertor = new HtmlConvertor()

    const data = `<ul>
    <li>Ground beef</li>
    <li>Celery</li>
    <li>Onions</li>
    <li>Cilantro</li>
    <li>Lettuce </li>
    <li>Salsa</li>
    <li>Tomato^</li>
    <li>JalapeÃ±o </li>
    <li>Butter</li>
    <li>Garlic</li>
    <li>Taco seasoning</li>
    <li>Shredded cheese</li>
    <li>Sour cream</li>
    <li>Guac</li>
    <li>Tortillas</li>
    <li><br></li>
    </ul>
  `
    const {notes} = convertor.convert({data, filename: 'p1-My Recipe.html'})

    const [{subject, html}] = notes

    expect(subject).toEqual('My Recipe')
    expect(html).toMatchInlineSnapshot(`
      "<ul>
          <li>Ground beef</li>
          <li>Celery</li>
          <li>Onions</li>
          <li>Cilantro</li>
          <li>Lettuce </li>
          <li>Salsa</li>
          <li>Tomato^</li>
          <li>JalapeÃ±o </li>
          <li>Butter</li>
          <li>Garlic</li>
          <li>Taco seasoning</li>
          <li>Shredded cheese</li>
          <li>Sour cream</li>
          <li>Guac</li>
          <li>Tortillas</li>
          <li></li>
          </ul>
        "
    `)
  })

  it('returns updatedAt from lastModified', () => {
    const convertor = new HtmlConvertor()

    const data = `<ul>
    <li>Ground beef</li>
    </ul>
  `
    const {notes} = convertor.convert({
      data,
      filename: 'p1-My Recipe.html',
      lastModified: 123456789,
    })

    const [{updatedAt}] = notes

    expect(updatedAt).toEqual(123456789)
  })

  it('removes images with base64 data', () => {
    const convertor = new HtmlConvertor()

    const data = `<ul>
    <li>Ground beef</li>
    <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIwAAAABJRU5ErkJggg==" /></li>
    </ul>
  `
    const {notes} = convertor.convert({data, filename: 'p1-My Recipe.html'})

    const [{html}] = notes

    expect(html).toMatchInlineSnapshot(`
      "<ul>
          <li>Ground beef</li>
          <li></li>
          </ul>
        "
    `)
  })

  it('returns invalid notes when the html is too long', () => {
    const convertor = new HtmlConvertor()

    // Make a lot of chars
    const data = 'x'.repeat(10 * 1024 * 1024)

    const {notes, errors} = convertor.convert({
      data,
      filename: 'p1-My Recipe.html',
    })

    expect(notes.length).toEqual(0)
    expect(errors.length).toEqual(1)

    const [error] = errors

    expect(error).toEqual({
      id: 'html-p1-My Recipe',
      type: 'note-too-big',
      message: 'The HTML for this note is too long. It must be less than 900kb.',
    })
  })
})
