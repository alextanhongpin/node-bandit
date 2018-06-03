/** Class representing the BernoulliArm. */
class BernoulliArm {
  /**
    * @param {float} probability - The probability of the arm being pulled with reward. If the probability is 0.2,
    * it means there is a chance that a reward will generated once every five pulls.
    */
  constructor (probability) {
    this.probability = probability
  }

  /**
   * @returns {float} score - 1.0 indicates that a positive action is taken, and 0.0 means none.
   */
  draw (probabilityFn = () => Math.random()) {
    if (probabilityFn() > this.probability) {
      return 0.0
    }
    return 1.0
  }
}

module.exports = BernoulliArm
