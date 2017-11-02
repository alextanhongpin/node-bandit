
class BernoulliArm {
  constructor (p) {
    // Probability of getting a reward
    this.p = p
  }
  pull () {
    return Math.random() > this.p ? 0 : 1
  }
}

module.exports = BernoulliArm
