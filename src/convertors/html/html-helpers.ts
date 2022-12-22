export const toHtmlId = (basename: string) => {
  return `html-${basename}`
}

export const basenameToSubject = (basename: string) => {
  // Apple Notes prefixes their basename with p1- or p2- or p3- etc
  return basename.replace(/p\d+-/, '')
}
