import {format} from 'prettier'
import parserHtml from 'prettier/parser-html'

export function formatHtml(htmlString: string) {
  return format(htmlString, {
    parser: 'html',
    plugins: [parserHtml],
  })
}
