import {DOM, domArrayToHtml} from './dom'

export const paragraph = (content: DOM): DOM => {
  return ['p', content]
}

export const list = (content: DOM[] = []): DOM => {
  return ['ul', domArrayToHtml(content)]
}

export const listItem = (content: DOM): DOM => {
  return ['li', content]
}

export const taskListItem = (
  content: DOM,
  options: {checked?: boolean} = {checked: false},
): DOM => {
  const input = '<input type="checkbox" ' + (options.checked ? 'checked' : '') + '>'

  return ['li', input, content]
}

export const header1 = (content: DOM): DOM => {
  return ['h1', content]
}
