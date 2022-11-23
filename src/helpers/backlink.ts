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
