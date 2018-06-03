
const {writeToFile} = require('./helper')
const expect = require('chai').expect

const BanditFactory = require('../src')
const Softmax = BanditFactory('softmax')

describe('Softmax', () => {
  it('should construct with default values', () => {
    const softmax = new Softmax()
    expect(softmax.temperature).to.be.eq(0.0)
    expect(softmax.counts).to.be.deep.eq([])
    expect(softmax.values).to.be.deep.eq([])
  })

  it('should construct with given values', () => {
    const softmax = new Softmax()
    softmax.initialize()
    expect(softmax.counts.length).to.be.eq(0)
    expect(softmax.values.length).to.be.eq(0)
    expect(softmax.counts).to.be.deep.eq([])
    expect(softmax.values).to.be.deep.eq([])
  })

  it('should update the arm with the given reward', () => {
    const softmax = new Softmax()
    softmax.initialize(10)
    softmax.update(5, 1)
    expect(softmax.counts).to.be.deep.eq([0, 0, 0, 0, 0, 1, 0, 0, 0, 0])
    expect(softmax.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])

    softmax.update(5, 1)
    expect(softmax.counts).to.be.deep.eq([0, 0, 0, 0, 0, 2, 0, 0, 0, 0])
    expect(softmax.values).to.be.deep.eq([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])
  })

  it('should return the correct arm for the selectArm', () => {
    const softmax = new Softmax(0.1)
    softmax.initialize(10)
    const arm = softmax.selectArm(() => 0.1)
    expect(arm).to.be.eq(1)

    softmax.update(0, 1)
    const arm2 = softmax.selectArm(() => 0.1)
    expect(arm2).to.be.eq(0)
  })

  it.skip('should write the output to the file', () => {
    writeToFile(Softmax, 'data/softmax.csv', (err) => {
      expect(err).to.be.eq(null)
    })
  })
})
