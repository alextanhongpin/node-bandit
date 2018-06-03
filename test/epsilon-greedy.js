const {writeToFile} = require('./helper')
const expect = require('chai').expect

const BanditFactory = require('../src')
const EpsilonGreedy = BanditFactory('epsilon')

describe('Epsilon Greedy', () => {
  it('should construct with default values', () => {
    const epsilonGreedy = new EpsilonGreedy()
    expect(epsilonGreedy.epsilon).to.be.eq(0.1)
    expect(epsilonGreedy.values).to.be.deep.eq([])
    expect(epsilonGreedy.counts).to.be.deep.eq([])
  })

  it('should construct with two argument', () => {
    const epsilonGreedy = new EpsilonGreedy(1, [0.0, 0.0, 0.0])
    expect(epsilonGreedy.epsilon).to.be.eq(1)
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0])
  })

  it('should construct with all arguments', () => {
    const epsilonGreedy = new EpsilonGreedy(1, [0.0, 0.0, 0.0], [0, 0, 0])
    expect(epsilonGreedy.epsilon).to.be.eq(1)
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0])
  })

  it('should throw error when constructing with invalid arguments', () => {
    expect(() => new EpsilonGreedy(1, [0.0, 0.0, 0.0], [0, 0])).to.throw('unequal counts and values length')
  })

  it('should throw error if epsilon value is out of range', () => {
    expect(() => new EpsilonGreedy(-1)).to.throw('epsilon must be in range 0 <= n <= 1')
  })

  it('should not initialize if zero is provided as the number of arms', () => {
    const epsilonGreedy = new EpsilonGreedy()
    epsilonGreedy.initialize()
    expect(epsilonGreedy.counts).to.be.deep.eq([])
    expect(epsilonGreedy.values).to.be.deep.eq([])
    expect(epsilonGreedy.counts.length).to.be.eq(0)
    expect(epsilonGreedy.values.length).to.be.eq(0)
  })

  it('should initialize the counts and values to the desired arm length', () => {
    const epsilonGreedy = new EpsilonGreedy()
    epsilonGreedy.initialize(10)
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts.length).to.be.eq(10)
    expect(epsilonGreedy.values.length).to.be.eq(10)
  })

  it('should throw error when calling selectArm with no arms available', () => {
    const epsilonGreedy = new EpsilonGreedy()
    expect(() => epsilonGreedy.selectArm(() => 0.5)).to.throw('no arms available')
  })

  it('should return the exploration index arm', () => {
    const epsilonGreedy = new EpsilonGreedy()
    epsilonGreedy.initialize(5)
    const arm = epsilonGreedy.selectArm(() => 0.5)
    expect(arm).to.be.eq(0)
  })

  it('should return the correct exploitation index arm', () => {
    const epsilonGreedy = new EpsilonGreedy()
    epsilonGreedy.initialize(5)
    const arm = epsilonGreedy.selectArm(() => 0.5)
    expect(arm).to.be.eq(0)

    epsilonGreedy.initialize(10)
    const arm2 = epsilonGreedy.selectArm(() => 0.01)
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(arm2)).to.be.eq(true)
  })

  it('should update the values for the given arm with the given reward', () => {
    const epsilonGreedy = new EpsilonGreedy()
    epsilonGreedy.initialize(10)
    epsilonGreedy.update(5, 1)
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0, 0, 0, 1, 0, 0, 0, 0])

    epsilonGreedy.update(5, 0)
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0, 0, 0, 2, 0, 0, 0, 0])

    epsilonGreedy.update(5, 1)
    epsilonGreedy.update(5, 1)
    expect(epsilonGreedy.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 0.75, 0.0, 0.0, 0.0, 0.0])
    expect(epsilonGreedy.counts).to.be.deep.eq([0, 0, 0, 0, 0, 4, 0, 0, 0, 0])
  })

  it.skip('should write the output to the file', () => {
    writeToFile(EpsilonGreedy, 'data/epsilon_greedy.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
