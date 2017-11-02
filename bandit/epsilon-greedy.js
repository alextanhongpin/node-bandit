class EpsilonGreedy {
  constructor ({ epsilon, n }) {
    this.epsilon = epsilon // The default epsilon
    this.n = n // Number of arms
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }

  selectArm () {
    const isExploiting = Math.random() > this.epsilon
    if (isExploiting) { // Exploit!
      // Index of the best arm
      return this.values.indexOf(Math.max(...this.values))
    } else { // Explore!
      // Index of randomly selected arms
      return Math.floor(Math.random() * this.n)
    }
  }

  update (chosenArm, reward) { // index of pulled arm
    const n = ++this.counts[chosenArm]
    const v = this.values[chosenArm]
    this.values[chosenArm] = (v * (n - 1) + reward) / n
  }
}

module.exports = EpsilonGreedy
