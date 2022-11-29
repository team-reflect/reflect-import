export const parseHtml = (html: string) => {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}
