// Epsilon Greedy strategy selects the best level for a proportion of 1 - e of the trials,
// and a lever is selected at random for a proportion of e. Typical parameter for e is 0.1.

/** Class representing the EpsilonGreedy. */
class EpsilonGreedy {
  /**
   * @param {float} epsilon - Ranging from 0 to 1, indicates the frequency of exploration.
   * @param {int} counts - A vector of integers of length N that tells us how many times we've played each of the N arms available to us in the current bandit problem.
   * @param {float} values - A vector of floating numbers that defines the average amount of reward we've gotten when playing each of the N arms available to us.
   */
  constructor (epsilon = 0.1, counts = [], values = []) {
    this.epsilon = epsilon
    this.counts = counts
    this.values = values
  }

  /**
   * Initialize the counts and values for the given number of arms.
   * @param {int} nArms - The number of arms.
   */
  initialize (nArms = 0) {
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
  }

  /**
   * Pulls an arm and return the index of the best arm.
   * @param {Function} probabilityFn - A function that returns a probability value from 0 to 1. Passed in as dependency injection to make it testable.
   * @param {Function} randomIndexFn - A function that returns a random index from the array length.
   */
  selectArm (
    probabilityFn = () => Math.random(),
    randomIndexFn = (n) => Math.floor(Math.random() * n)) {
    if (probabilityFn() > this.epsilon) {
      if (!this.values.length) {
        return 0
      }
      return this.values.indexOf(Math.max(...this.values))
    }
    return randomIndexFn(this.values.length)
  }

  /**
   * Update the reward for the given arm.
   * @param {int} chosenArm - The index of the chosen arm.
   * @param {float} reward - The reward for the chosen arm.
   */
  update (chosenArm, reward) {
    this.counts[chosenArm]++
    const n = this.counts[chosenArm]
    const value = this.values[chosenArm]
    const newValue = (((n - 1) / n) * value) + ((1 / n) * reward)
    this.values[chosenArm] = newValue
  }
}

module.exports = EpsilonGreedy
