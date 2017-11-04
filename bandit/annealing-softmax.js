// Annealing Softmax is an enhanced version of softmax that applies simulated annealing.
// Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given function.
// The temperature parameter is based on an analogy with Boltzman Distribution in physics in which
// systems at high temperatures tend to behave randomly, while they take on more structure at low temperatures.

const { sum, categoricalDraw } = require('../stats')

class AnnealingSoftmax {
  constructor ({ n }) {
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
  }

  selectArm () {
    const t = sum(this.counts) + 1
    const temperature = 1 / Math.log(t + 0.0000001)
    const z = sum(this.values.map((v) => Math.exp(v / temperature)))
    const probs = this.values.map((v) => Math.exp(v / temperature) / z)
    return categoricalDraw(probs)
  }

  update (chosenArm, reward) {
    const n = ++this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}
module.exports = AnnealingSoftmax
