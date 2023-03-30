export const buildTagUrl = ({
  linkHost,
  graphId,
  tag,
}: {
  linkHost: string
  graphId: string
  tag: string
}) => {
  return `https://${linkHost}/g/${graphId}/tag/${tag}`
}
