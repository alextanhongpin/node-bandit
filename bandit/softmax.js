// Softmax randomly selects an arm proportional to the amount of reward it has received before

const { categoricalDraw } = require('../stats')

class Softmax {
  constructor ({ epsilon, n }) { // temperature is equal to epsilon
    this.temperature = epsilon
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }

  selectArm () {
    const z = this.values.map((v) => Math.exp(v / this.temperature)).reduce((a, b) => a + b, 0)
    const probs = this.values.map((v) => Math.exp(v / this.temperature) / z)
    return categoricalDraw(probs)
  }

  update (chosenArm, reward) {
    const n = ++this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}
module.exports = Softmax
