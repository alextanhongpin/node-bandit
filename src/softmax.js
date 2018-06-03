// Softmax randomly selects an arm proportional to the amount of reward it has received before

const categoricalDraw = require('./utils/categorical-draw')

/** Class representing the Softmax. */
class Softmax {
  // @param temperature The temperature parameter, also known as tau.
  // @param counts An array of integer storing the number of times the arm is called.
  // @param values An array of float storing the average reward of the arm.
  constructor (temperature = 0.0, counts = [], values = []) {
    this.temperature = temperature
    this.counts = counts
    this.values = values
  }

  // initialize will create a new array of counts and values based on the number of arms specified.
  // @param nArms The number of arms.
  initialize (nArms = 0) {
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
  }

  // @param randomFn A random function that returns a random value.
  // Passed through dependency injection to make testing easier.
  selectArm (randomFn = () => Math.random()) {
    const z = this.values.reduce((total, value) => total + Math.exp(value / this.temperature), 0)
    const probabilities = this.values.map(value => Math.exp(value / this.temperature) / z)
    return categoricalDraw(randomFn, probabilities)
  }

  // update will update the chosen arm with the given reward
  // @param chosenArm The arm that is chosen.
  // @param reward The reward for the arm.
  update (chosenArm, reward) {
    this.counts[chosenArm] = this.counts[chosenArm] + 1
    const n = this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n * value) + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = Softmax
