const expect = require('chai').expect
const { writeToFile } = require('./helper')

const BanditFactory = require('../src')
const UCB2 = BanditFactory('ucb2')

describe('Upper Confidence Bound 2 Algorithm', () => {
  it('should construct with default values', () => {
    const ucb = new UCB2()
    expect(ucb.counts).to.be.deep.eq([])
    expect(ucb.values).to.be.deep.eq([])
    expect(ucb.counts.length).to.be.eq(0)
    expect(ucb.values.length).to.be.eq(0)
  })

  it('should construct with one param given', () => {
    const ucb = new UCB2([0, 0, 0])
    expect(ucb.counts).to.be.deep.eq([0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0])
  })

  it('should construct with both params given', () => {
    const ucb = new UCB2([0, 0, 0], [0.0, 0.0, 0.0])
    expect(ucb.counts).to.be.deep.eq([0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0])
  })

  it('should throw error when params is inconsistent', () => {
    expect(() => new UCB2([0, 0, 0], [0.0, 0.0])).to.throw('unequal counts and values length')
  })

  it('should throw error when initialize with an invalid arm number', () => {
    const ucb = new UCB2()
    expect(() => ucb.initialize(-1)).to.throw('nArms cannot be equal or less than zero')
  })

  it('should initialize with given number of arms', () => {
    const ucb = new UCB2()
    ucb.initialize(5)
    expect(ucb.counts).to.be.deep.eq([0, 0, 0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])
    expect(ucb.counts.length).to.be.eq(5)
    expect(ucb.values.length).to.be.eq(5)
  })

  it('should throw error when selecting an uninitialized ucb', () => {
    const ucb = new UCB2()
    expect(() => ucb.selectArm()).to.throw('no arms available')
  })

  it('should return the correct arm when calling selectArm', () => {
    const ucb = new UCB2()
    ucb.initialize(5)
    const arm = ucb.selectArm()
    expect(arm).to.be.eq(0)

    ucb.update(2, 1)
    const arm2 = ucb.selectArm()
    expect(arm2).to.be.eq(0)

    ucb.update(0, 1)
    const arm3 = ucb.selectArm()
    expect(arm3).to.be.eq(1)
  })

  it.skip('should write to file', () => {
    writeToFile(UCB2, 'data/ucb2.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
