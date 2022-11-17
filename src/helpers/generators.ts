import {DOM} from './dom'

export const paragraph = (content: DOM): DOM => {
  return ['p', content]
}

export const list = (content: DOM = ''): DOM => {
  return ['ul', content]
}

export const listItem = (content: DOM): DOM => {
  return ['li', paragraph(content)]
}

export const taskListItem = (
  content: DOM,
  options: {checked?: boolean} = {checked: false},
): DOM => {
  const input: DOM = ['input', {type: 'checkbox', checked: options.checked + ''}]

  return ['li', input, paragraph(content)]
}

export const header1 = (content: DOM): DOM => {
  return ['h1', content]
}
