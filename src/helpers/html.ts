export const parseHtml = (html: string) => {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

export const removeBrs = (doc: Document) => {
  // Remove <br /> tags
  doc.querySelectorAll('br').forEach((br) => br.remove())
}

export const removeImgsWithDataSrcs = (doc: Document) => {
  // Remove <img /> tags with base64 data
  doc.querySelectorAll('img').forEach((img) => {
    if (img.src.startsWith('data:image')) {
      img.remove()
    }
  })
}
