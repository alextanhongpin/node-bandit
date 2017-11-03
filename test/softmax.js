
const fs = require('fs')
const Softmax = require('../bandit/softmax')
const BernoulliArm = require('../bandit/bernoulli-arm')

const arms = [0.1, 0.5, 0.9]
const probs = [0.1, 0.2, 0.7]

const n = arms.length

const cumulativeRewards = Array(n).fill([])
const rewards = Array(n).fill([])
const scores = Array(n).fill([])
const times = 1000
 // To compute total rewards

// Number of arms to pull
arms.forEach((arm, i) => {
  const epsilon = new Softmax({ n: n, temperature: arm })
  // Loop through each arm to create a new bernoulli arm
  const bernoulliArm = new BernoulliArm(probs[i])

  // Initialize array
  cumulativeRewards[i] = Array(times).fill(0)
  rewards[i] = Array(times).fill(0)
  scores[i] = Array(times).fill(0)

  let total = 0.0

  // Number of times to pull the arm
  Array(times).fill(0).forEach((_, index) => {
    const arm = epsilon.selectArm()
    const reward = bernoulliArm.pull()
    epsilon.update(arm, reward)
    total += reward

    if (index === 0) {
      cumulativeRewards[i][index] = reward
    } else {
      cumulativeRewards[i][index] = total
    }
    rewards[i][index] = reward
    // Average reward
    scores[i][index] = total / (index + 1)
  })
})

console.log(cumulativeRewards)
const csv = Array(times).fill(0).map((_, i) => {
  const col1 = cumulativeRewards[0][i]
  const col2 = cumulativeRewards[1][i]
  const col3 = cumulativeRewards[2][i]
  const prob1 = rewards[0][i]
  const prob2 = rewards[1][i]
  const prob3 = rewards[2][i]
  const score1 = scores[0][i]
  const score2 = scores[1][i]
  const score3 = scores[2][i]
  return [i + 1, col1, col2, col3, prob1, prob2, prob3, score1, score2, score3].join(',')
}).join('\n')

console.log(cumulativeRewards[1].length)
fs.writeFile('softmax.csv', csv, (err, ok) => {
  if (err) {
    throw err
  }
  console.log('wrote to file successfully')
})
