// Epsilon Greedy strategy selects the best level for a proportion of 1 - e of the trials,
// and a lever is selected at random for a proportion of e. Typical parameter for e is 0.1.

class EpsilonGreedy {
  constructor ({ n, epsilon = 0.1 }) {
    this.epsilon = epsilon
    this.n = n // Number of arms
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }

  selectArm () {
    const isExploiting = Math.random() > this.epsilon
    if (isExploiting) {
      // Exploit!
      // Index of the best arm
      return this.values.indexOf(Math.max(...this.values))
    }

    // Explore!
    // Index of randomly selected arms
    return Math.floor(Math.random() * this.n)
  }

  update (chosenArm, reward) {
    const n = ++this.counts[chosenArm]
    const v = this.values[chosenArm]

    // Compute the average of the reward
    this.values[chosenArm] = ((n - 1) / n) * v + (1 / n) * reward
  }
}

module.exports = EpsilonGreedy
