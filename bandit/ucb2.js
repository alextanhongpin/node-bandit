// UCB2, an iterative improvement over UCB1, reduces the constant term in the
// fraction of time a suboptimal arm will be selected, reducing the overall regret,
// at the cost of only a slightly more complicaed algorithm.

const { sum } = require('../stats')

class UCB2 {
  constructor ({ n }) {
    this.alpha = n
    this.counts = Array(n).fill(0)
    this.values = Array(n).fill(0)
    this.r = Array(n).fill(0)
    this._current_arm = 0
    this._next_update = 0
  }

  _bonus (n, r) {
    const tau = this._tau(r)
    const bonus = Math.sqrt((1 + this.alpha) * Math.log(Math.E * n / tau) / (2 * tau))
    return bonus
  }

  _tau (r) {
    return Math.ceil(Math.pow(1 + this.alpha, r))
  }

  _setArm (arm) {
    // Play arm for tau(r + 1) - tau(r)
    this._current_arm = arm
    this._next_update += Math.max(1, this._tau(this.r[arm] + 1) - this._tau(this.r[arm]))
    this.r[arm] += 1
  }

  selectArm () {
    const nArms = this.alpha

    // Play each arm once
    const hasUnplayedArms = this.counts.some((value) => value === 0)
    if (hasUnplayedArms) {
      const arm = this.counts.indexOf(0)
      this._setArm(arm)
      return arm
    }

    // Make sure we aren't still playing the previous arm
    if (this._next_update > sum(this.counts)) {
      return this._current_arm
    }

    const totalCounts = sum(this.counts)
    const ucbValues = Array(nArms).fill().map((_, arm) => {
      const bonus = this._bonus(totalCounts, this.r[arm])
      return this.values[arm] + bonus
    })
    const chosenArm = ucbValues.indexOf(Math.max(...ucbValues))
    this._setArm(chosenArm)
    return chosenArm
  }

  update (chosenArm, reward) {
    this.counts[chosenArm] = this.counts[chosenArm] + 1
    const n = this.counts[chosenArm]

    const value = this.values[chosenArm]
    const newValue = ((n - 1) / n) * value + (1 / n) * reward
    this.values[chosenArm] = newValue
  }
}

module.exports = UCB2
