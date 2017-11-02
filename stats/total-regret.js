function totalRegret (probabilities, choices) {
  const maxProbability = Math.max(...probabilities)
  let cumulative = 0
  const regret = choices.map((i) => {
    cumulative += maxProbability - probabilities[i]
    return cumulative
  })
  return regret
}

module.exports = totalRegret
