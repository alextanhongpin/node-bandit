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

const thompson = new ThompsonSampling({ n: 3 })

const arms = [0.1, 0.1, 0.5]
arms.forEach((threshold) => {
  Array(1000).fill(0).forEach((_, index) => {
    const arm = thompson.selectArm()
    console.log(arm)
    thompson.update(arm, Math.random() < threshold ? 1 : 0)
  })
})

console.log(thompson)
