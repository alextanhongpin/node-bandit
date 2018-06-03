// UCB2, an iterative improvement over UCB1, reduces the constant term in the
// fraction of time a suboptimal arm will be selected, reducing the overall regret,
// at the cost of only a slightly more complicaed algorithm.

const { sum, maxIndex } = require('./utils/math2')

/** Class representing the UCB2. */
class UCB2 {
  /**
   * @param {int[]} counts - An array of int containing the number of times the arm has been invoked.
   * @param {float[]} values - An array of float containing the average reward of the arm.
  */
  constructor (counts = [], values = []) {
    this.counts = counts
    this.values = values
    this._currentArm = 0
    this._nextUpdate = 0
  }

  /**
   * @param {int} nArms - The number of arms of the application.
   */
  initialize (nArms) {
    this.alpha = nArms
    this.counts = Array(nArms).fill(0)
    this.values = Array(nArms).fill(0.0)
    this.r = Array(nArms).fill(0)
  }

  /**
   * _bonus is a private method that computes the bonus.
   * @param {int} n - The total count of the arm pulls.
   * @param {float} r - The current arm rewards.
   * @returns {float} bonus - The bonus for the arm pull.
   */
  _bonus (n, r) {
    const tau = this._tau(r)
    const bonus = Math.sqrt((1 + this.alpha) * Math.log(Math.E * n / tau) / (2 * tau))
    return bonus
  }

  /**
   * _tau is a private method that computes tau
   * @param {float} r - The current arm rewards.
   * @returns {float} tau - The tau value.
   */
  _tau (r) {
    return Math.ceil(Math.pow(1 + this.alpha, r))
  }

  /**
   * Play arm for tau(r + 1) - tau(r)
   * @param {int} arm - The current arm to be played.
   */
  _setArm (arm) {
    this._currentArm = arm
    this._nextUpdate += Math.max(1, this._tau(this.r[arm] + 1) - this._tau(this.r[arm]))
    this.r[arm] += 1
  }

  /**
   * Select the best arm.
   * @returns {int} arm - The best arm pulled.
   */
  selectArm () {
    const nArms = this.alpha
    if (!nArms) {
      throw new Error('no arms available')
    }

    // Play each arm once
    for (let i = 0; i < nArms; i += 1) {
      if (!this.counts[i]) {
        this._setArm(i)
        return i
      }
    }

    // Make sure we aren't still playing the previous arm
    if (this._nextUpdate > sum(this.counts)) {
      return this._currentArm
    }

    const totalCounts = sum(this.counts)
    const ucbValues = Array(nArms).fill().map((_, arm) => {
      const bonus = this._bonus(totalCounts, this.r[arm])
      return this.values[arm] + bonus
    })
    const chosenArm = maxIndex(ucbValues)
    this._setArm(chosenArm)
    return chosenArm
  }

  /**
   * Update the chosen arm with the given reward.
   * @param {int} chosenArm - The arm to be updated.
   * @param {float} reward - The reward of the arm.
   */
  update (chosenArm, reward) {
    this.counts[chosenArm] = this.counts[chosenArm] + 1
    const n = this.counts[chosenArm]

    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = UCB2
