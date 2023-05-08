import {LogseqProperties} from './types'

/**
 * Converts a logseq block's properties into markdown.  Reflect does not have the
 * same concept as properties so we are converting it to "key: value" text.
 *
 * Here is an example property object:
 * {"company":["Company Two"],"phone":12345,"jobtitle":["manager"]}
 *
 * The thing that is not ideal about this is "Company Two" is a link and "manager"
 * is a tag.  But there is no indication in this object that those are anything other
 * than strings.  Also, ordering is lost because the properties are an object.
 * So, we are just doing our best guess here.  It is better than the properties being lost.
 *
 * This is converting to markdown rather than HTML to take advantage of markdown's
 * handling of backlinks.
 */
export const logseqPropertiesToMarkdown = (
  properties: LogseqProperties,
  noteIds: Record<string, string>,
): string => {
  const markdown = []
  for (const [key, value] of Object.entries(properties)) {
    let displayValue = ''
    // Values can be arrays.  This is either an array of strings or numbers, or it can
    // be a single link or an array of links
    if (Array.isArray(value)) {
      // Join the array with commas.  If the value is a link then we wrap it in [[]]
      displayValue = value
        .map((v) => (v in noteIds ? `[[${v}]]` : v.toString()))
        .join(', ')
    } else {
      // Strings and numbers are just converted to strings.  Links are never returned
      // outside of an array so it is always a standalone string.
      displayValue = value.toString()
    }
    markdown.push(`* ${key}: ${displayValue}`)
  }
  return markdown.join('\n')
}
