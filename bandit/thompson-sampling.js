// In artificial intelligence, Thompson sampling,named after William R. Thompson,
// is a heuristic for choosing actions that addresses the exploration-exploitation
// dilemma in the multi-armed bandit problem.
// It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief.

const { rBeta } = require('../stats')

class ThompsonSampling {
  constructor ({ n }) {
    this.n = n
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
    this.a = 1
    this.b = 1
  }

  selectArm () {
    const probabilities = Array(this.n).fill(0).map((_, i) => {
      // calculate losses
      const count = this.counts[i] // Trials
      const value = this.values[i] // Rewards
      const losses = count - value
      // Draw random sample from beta distribution
      const probability = rBeta(this.a + value, this.b + losses)
      return probability
    })
    return probabilities.indexOf(Math.max(...probabilities))
  }

  update (chosenArm, reward) {
    this.counts[chosenArm] += 1
    const value = this.values[chosenArm]
    this.values[chosenArm] = value + reward
  }
}

module.exports = ThompsonSampling
