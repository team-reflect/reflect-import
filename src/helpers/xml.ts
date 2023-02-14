export class XmlConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'XmlConversionError'
  }
}

export const parseXml = (xml: string) => {
  // XML shouldn't contain entities, and yet Evernote export may do that. We'll
  // manually remove them.

  xml = xml
    .replace(/&nbsp;/g, '&#160;')
    .replace(/&mdash;/g, '&#8212;') // em dash (—)
    .replace(/&ndash;/g, '&#8211;') // en dash (–)
    .replace(/&lsquo;/g, '&#8216;') // left single quotation mark (‘)
    .replace(/&rsquo;/g, '&#8217;') // right single quotation mark (’)
    .replace(/&ldquo;/g, '&#8220;') // left double quotation mark (“)
    .replace(/&rdquo;/g, '&#8221;') // right double quotation mark (”)

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml.trim(), 'text/xml')

  const parseError = doc.querySelector('parsererror')

  if (parseError) {
    throw new XmlConversionError(parseError.textContent ?? 'Unknown parse error')
  }

  return doc
}
