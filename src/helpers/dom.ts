export type DOM = string | DOMArray

type DOMAttrs = Record<string, string | number | undefined>

type DOMArray =
  | [string, ...DOM[]]
  | [string, DOMAttrs, ...DOM[]]
  | [string, 0]
  | [string, DOMAttrs, 0]

export const domToHtml = (structure: DOM, wraps?: string): string => {
  if (typeof structure === 'string') {
    return structure
  }

  const tag = structure[0]
  const props: DOMAttrs = {}
  const attributes = structure[1]
  const children: string[] = []

  let currentIndex = 1

  if (typeof attributes === 'object' && !Array.isArray(attributes)) {
    currentIndex = 2

    for (const name in attributes) {
      if (attributes[name] != null) {
        props[name] = attributes[name]
      }
    }
  }

  for (let ii = currentIndex; ii < structure.length; ii++) {
    const child = structure[ii]

    if (child === 0) {
      console.assert(
        !(ii < structure.length - 1 || ii > currentIndex),
        'Content hole (0) must be the only child of its parent node',
      )

      return `<${tag}${mapProps(props)}>${wraps}</${tag}>`
    }

    children.push(domToHtml(child as DOM, wraps))
  }

  return `<${tag}${mapProps(props)}>${children.join('')}</${tag}>`
}

export const domToHtmlDoc = (nodes: DOM[]): string => {
  return nodes.map((node) => domToHtml(node)).join('')
}

const mapProps = (attributes: DOMAttrs): string => {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')
}
