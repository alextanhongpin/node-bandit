const { rBeta } = require('../stats')

class ThompsonSampling {
  constructor ({ n }) {
    this.n = n
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }

  selectArm () {
    const probabilities = Array(this.n).fill(0).map((_, i) => {
      // calculate losses
      const count = this.counts[i] // Trials
      const value = this.values[i] // Rewards
      const losses = count - value
      const probability = rBeta(1 + value, 1 + losses)
      return probability
    })
    return probabilities.indexOf(Math.max(...probabilities))
  }

  update (chosenArm, reward) {
    this.counts[chosenArm] += 1
    const value = this.values[chosenArm]
    const newValue = value + reward
    this.values[chosenArm] = newValue
  }
}

module.exports = ThompsonSampling

// const thompson = new ThompsonSampling({ n: 3 })

// const arms = [0.1, 0.1, 0.5]
// arms.forEach((threshold) => {
//   Array(1000).fill(0).forEach((_, index) => {
//     const arm = thompson.selectArm()
//     thompson.update(arm, Math.random() < threshold ? 1 : 0)
//   })
// })

// console.log(thompson)
