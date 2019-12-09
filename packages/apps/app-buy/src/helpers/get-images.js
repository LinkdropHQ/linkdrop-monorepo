export default ({ src }) => {
  return {
    image: require(`images/${src}.png`),
    imageRetina: require(`images/${src}@2x.png`)
  }
}
