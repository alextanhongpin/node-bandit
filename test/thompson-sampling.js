const expect = require('chai').expect
const {writeToFile} = require('./helper')

const BanditFactory = require('../src')
const ThompsonSampling = BanditFactory('thompson')

describe('Thompson Sampling Algorithm', () => {
  it('should construct with default values', () => {
    const thompson = new ThompsonSampling()
    expect(thompson).to.be.not.eq(null)
    expect(thompson.a).to.be.eq(1)
    expect(thompson.b).to.be.eq(1)
    expect(thompson.counts).to.be.deep.eq([])
    expect(thompson.values).to.be.deep.eq([])
    expect(thompson.counts.length).to.be.eq(0)
    expect(thompson.values.length).to.be.eq(0)
  })

  it('should construct with one given param', () => {
    const thompson = new ThompsonSampling([0, 0, 0])
    expect(thompson.a).to.be.eq(1)
    expect(thompson.b).to.be.eq(1)
    expect(thompson.counts).to.be.deep.eq([0, 0, 0])
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0])
    expect(thompson.counts.length).to.be.eq(3)
    expect(thompson.values.length).to.be.eq(3)
  })

  it('should construct with both given params', () => {
    const thompson = new ThompsonSampling([0, 0, 0, 0, 0], [0.0, 0.0, 0.0, 0.0, 0.0])
    expect(thompson.a).to.be.eq(1)
    expect(thompson.b).to.be.eq(1)
    expect(thompson.counts).to.be.deep.eq([0, 0, 0, 0, 0])
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])
    expect(thompson.counts.length).to.be.eq(5)
    expect(thompson.values.length).to.be.eq(5)
  })

  it('should throw error when constructing with invalid params', () => {
    expect(() => new ThompsonSampling([0, 0, 0], [0.0])).to.throw('unequal counts and values length')
  })

  it('should initialize with the given number of arms', () => {
    const thompson = new ThompsonSampling()
    thompson.initialize(3)
    expect(thompson.counts).to.be.deep.eq([0, 0, 0])
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0])
    expect(thompson.counts.length).to.be.eq(3)
    expect(thompson.values.length).to.be.eq(3)
  })

  it('should throw error when initializing with invalid arms', () => {
    const thompson = new ThompsonSampling()
    expect(() => thompson.initialize(-1)).to.throw('nArms cannot be equal or less than zero')
  })

  it('should update the values for the given arm with the given reward', () => {
    const thompson = new ThompsonSampling()
    thompson.initialize(10)
    thompson.update(5, 1)
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])
    expect(thompson.counts).to.be.deep.eq([0, 0, 0, 0, 0, 1, 0, 0, 0, 0])

    thompson.update(5, 0)
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])
    expect(thompson.counts).to.be.deep.eq([0, 0, 0, 0, 0, 2, 0, 0, 0, 0])

    thompson.update(5, 1)
    thompson.update(5, 1)
    expect(thompson.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0])
    expect(thompson.counts).to.be.deep.eq([0, 0, 0, 0, 0, 4, 0, 0, 0, 0])
  })

  it.skip('should write the output to the file', () => {
    writeToFile(ThompsonSampling, 'data/thompson.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
