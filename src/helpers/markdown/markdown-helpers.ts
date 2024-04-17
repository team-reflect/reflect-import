import slugify from '@sindresorhus/slugify'

export function toMarkdownNoteId(value: string) {
  const prefix = value.startsWith('md-') ? '' : 'md-'
  const slug = slugify(value, {lowercase: true, decamelize: false, separator: '-'})

  return `${prefix}${slug}`
}
