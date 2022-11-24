import 'urlpattern-polyfill'

export const buildBacklinkUrl = ({
  linkHost,
  graphId,
  noteId,
}: {
  linkHost: string
  graphId: string
  noteId: string
}) => {
  return `https://${linkHost}/g/${graphId}/${noteId}`
}

export const buildBacklinkParser = ({
  linkHost,
  graphId,
}: {
  linkHost: string
  graphId: string
}) => {
  const backlinkMatcher = new URLPattern({
    protocol: 'http{s}?',
    hostname: linkHost,
    pathname: `/g/${graphId}/:noteId`,
  })

  return (url: string) => {
    const match = backlinkMatcher.exec(url)

    if (match && match.pathname.groups.noteId) {
      return match.pathname.groups.noteId
    }

    return null
  }
}

export const parseBacklinkUrl = ({
  linkHost,
  graphId,
  url,
}: {
  linkHost: string
  graphId: string
  url: string
}) => {
  return buildBacklinkParser({linkHost, graphId})(url)
}
