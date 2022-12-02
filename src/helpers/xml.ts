export class XmlConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'XmlConversionError'
  }
}

export const parseXml = (xml: string) => {
  // XML shouldn't contain entities, and yet Evernote export may do that. We'll
  // manually remove them.

  xml = xml.replace('&nbsp;', '&#160;')

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml.trim(), 'text/xml')

  const parseError = doc.querySelector('parsererror')

  if (parseError) {
    throw new XmlConversionError(parseError.textContent ?? 'Unknown parse error')
  }

  return doc
}
