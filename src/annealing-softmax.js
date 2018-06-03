// Annealing Softmax is an enhanced version of softmax that applies simulated annealing.
// Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given function.
// The temperature parameter is based on an analogy with Boltzman Distribution in physics in which
// systems at high temperatures tend to behave randomly, while they take on more structure at low temperatures.

const categoricalDraw = require('./utils/categorical-draw')

/** Class representing the AnnealingSoftmax. */
class AnnealingSoftmax {
  /**
   * @param {float} temperature - The initial temperature.
   * @param {int[]} counts - The starting counts.
   * @param {float[]} values - The starting values.
   */
  constructor (temperature = 0.0, counts = [], values = []) {
    if (temperature < 0) {
      throw new Error('temperature must be greater than 0')
    }
    if (counts.length !== values.length) {
      throw new Error('length of counts and values must be equal')
    }
    this.temperature = temperature
    this.counts = counts
    this.values = values
  }

  /**
   * Initialize the counts and values to the given number of arms.
   * @param {int} nArms - The number of arms.
   */
  initialize (nArms) {
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
  }

  /**
   * Select an arm based on categorical draw.
   * @param {Function} randomFn - A function that generates a random number. Makes testing easier.
   */
  selectArm (randomFn = () => Math.random()) {
    const t = this.counts.reduce((total, value) => total + value, 0) + 1
    const temperature = 1 / Math.log(t + 0.0000001)
    const z = this.values.reduce((total, value) => total + Math.exp(value / temperature), 0)
    const probabilities = this.values.map(value => Math.exp(value / temperature) / z)
    return categoricalDraw(randomFn, probabilities)
  }

  /**
   * Update the chosen arm with the given reward.
   * @param {int} chosenArm - The chosen arm.
   * @param {float} reward - The given reward.
   */
  update (chosenArm, reward) {
    this.counts[chosenArm] = this.counts[chosenArm] + 1
    const n = this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = AnnealingSoftmax
