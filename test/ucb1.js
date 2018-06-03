const expect = require('chai').expect
const { writeToFile } = require('./helper')

const BanditFactory = require('../src')
const UCB1 = BanditFactory('ucb1')

describe('Upper Confidence Bound 1 Algorithm', () => {
  it('should construct with default values', () => {
    const ucb = new UCB1()
    expect(ucb.counts).to.be.deep.eq([])
    expect(ucb.values).to.be.deep.eq([])
    expect(ucb.counts.length).to.be.eq(0)
    expect(ucb.values.length).to.be.eq(0)
  })

  it('should construct even when only one param is provided', () => {
    const ucb = new UCB1([0, 0, 0, 0, 0])
    expect(ucb.counts).to.be.deep.eq([0, 0, 0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])
  })

  it('should construct with both params given', () => {
    const ucb = new UCB1([0, 0, 0], [0.0, 0.0, 0.0])
    expect(ucb.counts).to.be.deep.eq([0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0])
  })

  it('should throw error if params provided is inconsistent in length', () => {
    expect(() => new UCB1([0, 0, 0, 0, 0], [0.0])).to.throw('unequal counts and values length')
  })

  it('should initialize with empty array', () => {
    const ucb = new UCB1()
    expect(() => ucb.initialize()).to.throw('cannot initialize with zero arms')
  })

  it('should initialize with given number of arms', () => {
    const ucb = new UCB1()
    ucb.initialize(5)
    expect(ucb.counts).to.be.deep.eq([0, 0, 0, 0, 0])
    expect(ucb.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])
    expect(ucb.counts.length).to.be.eq(5)
    expect(ucb.values.length).to.be.eq(5)
  })

  it('should throw error when initializing with invalid arms number', () => {
    const ucb = new UCB1()
    expect(() => ucb.initialize(-1)).to.throw('nArms cannot be equal or less than zero')
  })

  it('should throw error when selecting arm for an uninitialized ucb', () => {
    const ucb = new UCB1()
    expect(() => ucb.selectArm()).to.throw('no arms available')
  })

  it('should return the correct arm when calling selectArm', () => {
    const ucb = new UCB1()
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
    writeToFile(UCB1, 'data/ucb1.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
