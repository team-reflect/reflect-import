export class XmlConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'XmlConversionError'
  }
}

export const parseXml = (xml: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  const parseError = doc.querySelector('parsererror')

  if (parseError) {
    throw new XmlConversionError(parseError.textContent ?? 'Unknown parse error')
  }

  return doc
}
