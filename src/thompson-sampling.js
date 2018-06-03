// In artificial intelligence, Thompson sampling, named after William R. Thompson, is a heuristic
// for choosing actions that addresses the exploration-exploitation dilemma in the multi-armed bandit problem.
// It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief.

const { maxIndex } = require('./utils/operation')
const { rbeta } = require('./utils/math2')

/** Class representing the ThompsonSampling. */
class ThompsonSampling {
  /**
   * @param {int[]} counts - Predefined values of the count.
   * @param {float[]} values - Predefined values of the rewards.
   */
  constructor (counts = [], values = []) {
    this.counts = counts
    this.values = values
    // a.k.a prior, can also be represented as [1, 1]
    this.a = 1
    this.b = 1
  }

  /**
   * Initialize the counts and values from the given number of arms.
   * @param {int} nArms - The number of arms.
   */
  initialize (nArms) {
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
  }

  /**
   * @todo Add proper description.
   * @returns {int} index - The index of the best arm.
   */
  selectArm () {
    const probabilities = Array(this.n).fill(0).map((_, i) => {
      // Calculate losses
      const count = this.counts[i] // Trials
      const successes = this.values[i] // Rewards
      const failures = count - successes

      // Draw random sample from beta distribution
      const probability = rbeta(this.a + successes, this.b + failures)
      return probability
    })
    return maxIndex(probabilities)
  }

  /**
   * Update the counts and values for the chosen arm with the given reward.
   * @param {int} chosenArm - The chosen arm.
   * @param {float} reward - The reward for the arm.
   */
  update (chosenArm, reward) {
    this.counts[chosenArm] += 1
    const value = this.values[chosenArm]
    this.values[chosenArm] = value + reward
  }
}

module.exports = ThompsonSampling
