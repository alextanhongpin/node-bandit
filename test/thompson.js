
const fs = require('fs')
const ThompsonSampling = require('../bandit/thompson-sampling')
const BernoulliArm = require('../bandit/bernoulli-arm')

const thompson = new ThompsonSampling({ n: 3 })

const arms = [0.1, 0.1, 0.5]
const cumulativeRewards = Array(arms.length).fill([])
const probabilities = Array(arms.length).fill([])
const loop = 1000
arms.forEach((threshold, i) => {
  const bernoulliArm = new BernoulliArm(threshold)
  cumulativeRewards[i] = Array(loop).fill(0)
  probabilities[i] = Array(loop).fill(0)

  Array(loop).fill(0).forEach((_, index) => {
    const arm = thompson.selectArm()
    const reward = bernoulliArm.pull()
    thompson.update(arm, reward)
    if (cumulativeRewards[i][index - 1]) {
      cumulativeRewards[i][index] = cumulativeRewards[i][index - 1] + reward
    } else {
      cumulativeRewards[i][index] = reward
    }
    if (cumulativeRewards[i][index - 1]) {
      probabilities[i][index] = cumulativeRewards[i][index - 1] / (cumulativeRewards[i][index - 1] + reward)
    } else {
      probabilities[i][index] = 0
    }
  })
})

console.log(cumulativeRewards)
const csv = Array(loop).fill(0).map((_, i) => {
  const col1 = cumulativeRewards[0][i]
  const col2 = cumulativeRewards[1][i]
  const col3 = cumulativeRewards[2][i]
  const prob1 = probabilities[0][i]
  const prob2 = probabilities[1][i]
  const prob3 = probabilities[2][i]
  return [i + 1, col1, col2, col3, prob1, prob2, prob3].join(',')
}).join('\n')

console.log(cumulativeRewards[1].length)
fs.writeFile('thompson.csv', csv, (err, ok) => {
  if (err) {
    throw err
  }
  console.log('wrote to file successfully')
})
