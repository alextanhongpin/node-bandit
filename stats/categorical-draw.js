function categoricalDraw (probs) {
  const z = Math.random()
  let cumulativeProb = 0
  for (let i = 0; i < probs.length; i += 1) {
    const prob = probs[i]
    cumulativeProb += prob
    if (cumulativeProb > z) {
      return i
    }
  }
  return probs.length - 1
}

module.exports = categoricalDraw
