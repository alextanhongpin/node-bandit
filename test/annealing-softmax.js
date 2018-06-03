const expect = require('chai').expect
const { writeToFile } = require('./helper')

const BanditFactory = require('../src')
const AnnealingSoftmax = BanditFactory('annealing')

describe('Annealing Softmax', () => {
  it('should construct with default values', () => {
    const softmax = new AnnealingSoftmax()
    expect(softmax.temperature).to.be.eq(0.0)
    expect(softmax.counts).to.be.deep.eq([])
    expect(softmax.values).to.be.deep.eq([])
    expect(softmax.counts.length).to.be.eq(0)
    expect(softmax.values.length).to.be.eq(0)
  })

  it('should construct with given params', () => {
    const softmax = new AnnealingSoftmax(0.1)
    expect(softmax.temperature).to.be.eq(0.1)
    expect(softmax.counts).to.be.deep.eq([])
    expect(softmax.values).to.be.deep.eq([])
    expect(softmax.counts.length).to.be.eq(0)
    expect(softmax.values.length).to.be.eq(0)
  })

  it('should throw error when initialized with the wrong value', () => {
    expect(() => new AnnealingSoftmax(-100)).to.throw('temperature must be greater than 0')
    expect(() => new AnnealingSoftmax(0.1, [], [0.0])).to.throw('length of counts and values must be equal')
  })

  it('should initialize the counts and values for the given number of arms', () => {
    const softmax = new AnnealingSoftmax()
    softmax.initialize(5)
    expect(softmax.counts).to.be.deep.eq([0, 0, 0, 0, 0])
    expect(softmax.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])
    expect(softmax.counts.length).to.be.eq(5)
    expect(softmax.values.length).to.be.eq(5)
  })

  it('should throw error when attempting to select arm without initializing', () => {
    const softmax = new AnnealingSoftmax(0.1)
    expect(() => softmax.selectArm(() => 0.1)).to.throw('no arms available')
  })

  it('should return the correct arm when calling the `selectArm` method', () => {
    const softmax = new AnnealingSoftmax(0.1)
    softmax.initialize(5)
    const arm = softmax.selectArm(() => 0.1)
    expect(arm).to.be.eq(0)
  })

  it('should update the arm with the given reward', () => {
    const softmax = new AnnealingSoftmax(0.1)
    softmax.initialize(5)
    softmax.update(2, 0)
    expect(softmax.counts).to.be.deep.eq([0, 0, 1, 0, 0])
    expect(softmax.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0])

    softmax.update(2, 1)
    expect(softmax.counts).to.be.deep.eq([0, 0, 2, 0, 0])
    expect(softmax.values).to.be.deep.eq([0.0, 0.0, 0.5, 0.0, 0.0])
  })

  it.skip('should write the value to the file', () => {
    writeToFile(AnnealingSoftmax, 'data/annealing_softmax.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
