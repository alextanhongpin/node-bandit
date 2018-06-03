// categoricalDraw returns a index of the array that indicates the position where
// the sum of the items in the array to the index is greater than the generated
// z value
// @param randomFn A function that generates a random value
// @param probabilities An array of float values
// @returns The index of the item in the array
function categoricalDraw (randomFn = () => Math.random(), probabilities) {
  const z = randomFn()
  let cumulative = 0
  const len = probabilities.length

  for (let i = 0; i < len; i += 1) {
    const prob = probabilities[i]
    cumulative += prob
    if (cumulative > z) {
      return i
    }
  }
  return len - 1
}

module.exports = categoricalDraw
