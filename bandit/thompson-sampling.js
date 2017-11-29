// In artificial intelligence, Thompson sampling,named after William R. Thompson,
// is a heuristic for choosing actions that addresses the exploration-exploitation
// dilemma in the multi-armed bandit problem.
// It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief.

const { rbeta, argmax } = require('../stats')

class ThompsonSampling {
  constructor ({ n }) {
    this.n = n
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
    // a.k.a prior, can also be represented as [1, 1]
    this.a = 1
    this.b = 1
  }

  selectArm () {
    const probabilities = Array(this.n).fill(0).map((_, i) => {
      // calculate losses
      const count = this.counts[i] // Trials
      const successes = this.values[i] // Rewards
      const failures = count - successes
      // Draw random sample from beta distribution
      const probability = rbeta(this.a + successes, this.b + failures)
      return probability
    })
    return argmax(probabilities)
  }

  update (chosenArm, reward) {
    this.counts[chosenArm] += 1
    const value = this.values[chosenArm]
    this.values[chosenArm] = value + reward
  }
}

module.exports = ThompsonSampling

// const ts = new ThompsonSampling({ n: 3 })
// let select = {}
// const probs = [0.2, 0.5, 0.8]

// Array(10000).fill(0).forEach((_, i) => {
//   const arm = ts.selectArm()
//   console.log('selected ', arm)
//   if (!select[arm]) {
//     select[arm] = 0
//   }
//   select[arm] += 1
//   ts.update(arm, Math.random() < probs[arm])
// })

// console.log(ts, select)
