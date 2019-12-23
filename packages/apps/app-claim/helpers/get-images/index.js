export default ({ src }) => {
  return {
    image: require(`assets/images/${src}.png`),
    imageRetina: require(`assets/images/${src}@2x.png`)
  }
}
