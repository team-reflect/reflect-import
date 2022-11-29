export const stripFileExtension = (filename: string) => {
  return filename.replace(/\.[^/.]+$/, '')
}
