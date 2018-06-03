// The Upper-Confidence Bound Algorithm is based on the principle of optimisim
// in the face of uncertainty - the arm selection is based on the amount of confidence
// we have in each arm. UCB1 achieves expected logarithmic regret uniformly over time,
// for all reward distribution, with no prior knowledge of the reward distribution required.

const { sum, maxIndex } = require('./utils/operation')

/** Class representing the UCB1. */
class UCB1 {
  /**
   * @param {int[]} counts - An array of int containing the number of times the arm has been invoked.
   * @param {float[]} values - An array of float containing the average reward of the arm.
  */
  constructor (counts = [], values = []) {
    this.counts = counts
    this.values = values
  }

  /**
   * @param {int} nArms - The number of arms to be assigned to the multi-armed bandit.
   */
  initialize (nArms = 0) {
    if (!nArms || nArms <= 0) {
      throw new Error('cannot initialize with zero arms')
    }
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
  }

  /**
   * @returns {int} index - The index of the best arm
   */
  selectArm () {
    const nArms = this.counts.length
    if (!nArms) {
      throw new Error('no arms available')
    }
    for (let i = 0; i < nArms; i++) {
      if (this.counts[i] === 0) {
        return i
      }
    }

    const ucbValues = Array(nArms).fill(0.0)
    const totalCounts = sum(this.counts)

    for (let arm = 0; arm < nArms; arm++) {
      const bonus = Math.sqrt((2 * Math.log(totalCounts)) / this.counts[arm])
      ucbValues[arm] = this.values[arm] + bonus
    }
    return maxIndex(ucbValues)
  }

  /**
   * @param {int} chosenArm - The arm to be updated.
   * @param {float} reward - The reward of the arm.
   */
  update (chosenArm, reward) {
    this.counts[chosenArm]++
    const n = this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = UCB1
