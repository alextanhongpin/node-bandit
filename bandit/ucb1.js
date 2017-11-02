// The Upper-Confidence Bound Algorithm
class UCB1 {
  constructor ({ n }) {
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }
  selectArm () {
    const nArms = this.counts.length
    // Prevent cold-start by ensure all the choices has been represented at least once
    const zeroArm = this.counts.findIndex(v => v === 0)
    if (zeroArm !== -1) {
      return zeroArm
    }

    const totalCounts = this.counts.reduce((a, b) => a + b, 0)
    const ucbValues = Array(nArms).fill(0).map((_, arm) => {
      const count = this.counts[arm]
      const value = this.values[arm]
      const bonus = Math.sqrt((2 * Math.log(totalCounts)) / count)
      return bonus + value
    })
    return ucbValues.indexOf(Math.max(...ucbValues))
  }

  update (chosenArm, reward) {
    this.counts[chosenArm] = this.counts[chosenArm] + 1
    const n = this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = UCB1
