// The Upper-Confidence Bound Algorithm is based on the principle of optimisim
// in the face of uncertainty - the arm selection is based on the amount of confidence
// we have in each arm. UCB1 achieves expected logarithmic regret uniformly over time,
// for all reward distribution, with no prior knowledge of the reward distribution required.

class UCB1 {
  constructor ({ n }) {
    this.n = n
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }
  selectArm () {
    const nArms = this.n
    // Prevent cold-start by ensure all the choices has been represented at least once
    const zeroArm = this.counts.findIndex(v => v === 0)
    if (zeroArm !== -1) {
      return zeroArm
    }
    const totalCounts = this.counts.reduce((a, b) => a + b, 0)
    const ucbValues = Array(nArms).fill(0).map((_, arm) => {
      const count = this.counts[arm]
      const value = this.values[arm]

      // The exploration constant, the higher the value, the more the
      // algorithm favors exploration over exploitation
      const c = 2
      // const trials = totalCounts + 1

      // The average observed reward of arm i thus far
      const meanReward = Math.sqrt((c * Math.log(totalCounts)) / count)
      return meanReward + value
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
