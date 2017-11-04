
const fs = require('fs')
const seedrandom = require('seedrandom')
const EpsilonGreedy = require('../bandit/epsilon-greedy')
const Thompson = require('../bandit/thompson-sampling')
const UCB1 = require('../bandit/ucb1')
const UCB2 = require('../bandit/ucb2')
const Softmax = require('../bandit/softmax')
const AnnealingSoftmax = require('../bandit/annealing-softmax')
const BernoulliArm = require('../bandit/bernoulli-arm')

seedrandom('hello.', { global: true })
function simulate (algo, arms, horizon) {
  const chosenArms = Array(horizon).fill()
  const rewards = Array(horizon).fill()
  const cumulativeRewards = Array(horizon).fill()
  const optimalScores = Array(horizon).fill()

  let cumulativeReward = 0
  let optimalScore = 0

  for (let t = 0; t < horizon; t += 1) {
    const i = algo.selectArm()
    const arm = arms[i]
    const reward = arm.pull()

    const bestArm = algo.values.indexOf(Math.max(...algo.values))
    optimalScore += (bestArm === i ? 1 : 0)
    optimalScores[t] = optimalScore

    algo.update(i, reward)

    chosenArms[t] = i
    rewards[t] = reward

    cumulativeReward += reward
    cumulativeRewards[t] = cumulativeReward
  }

  return { chosenArms, rewards, cumulativeRewards, optimalScores }
}

function setupTest (...algorithms) {
  return algorithms.map(algo => runTest(algo))
}

function runTest (algo) {
  const horizon = 1000
  const probabilities = [0.1, 0.1, 0.9].map(_ => Math.random())
  console.log('probabilities:', probabilities)
  const arms = probabilities.map(v => new BernoulliArm(v))
  const results = simulate(algo, arms, horizon)

  const maxP = Math.max(...probabilities)
  console.log('maxP is:', maxP)

  const totalReward = results.cumulativeRewards[results.cumulativeRewards.length - 1]
  console.log('totalReward is:', totalReward)

  const maxReward = maxP * horizon
  console.log('maxReward is:', maxReward)

  const regret = maxReward - totalReward
  console.log('regret is:', regret)

  const { cumulativeRewards, optimalScores } = results

  const data = Array(horizon).fill().map((_, i) => {
    const averageOptimal = optimalScores[i] / (i + 1)
    const averageReward = cumulativeRewards[i] / (i + 1)
    return [ isNaN(averageOptimal) ? 0 : averageOptimal, isNaN(averageReward) ? 0 : averageReward ]
  })
  return data
}

function main () {
  // Run the test and get the results
  const results = setupTest(
    new EpsilonGreedy({ n: 3, epsilon: 0.1 }),
    new UCB1({ n: 3 }),
    new UCB2({ n: 3 }),
    new Softmax({ n: 3, epsilon: 0.1 }),
    new AnnealingSoftmax({ n: 3 }),
    new Thompson({ n: 3 })
  )

  const data = Array(1000).fill().map((_, i) => {
    const epsilonBestArm = results[0][i][0]
    const ucb1BestArm = results[1][i][0]
    const ucb2BestArm = results[2][i][0]
    const softmaxBestArm = results[3][i][0]
    const annealingSoftmaxBestArm = results[4][i][0]
    const thompsonBestArm = results[5][i][0]
    return [epsilonBestArm, ucb1BestArm, ucb2BestArm, softmaxBestArm, annealingSoftmaxBestArm, thompsonBestArm].join(',')
  })
  const headers = [['epsilon-greedy', 'ucb1', 'ucb2', 'softmax', 'annealing-softmax', 'thompson'].join(',')]
  writeCSV('plots/probability-best-arm.csv', headers.concat(data).join('\n'))

  const data2 = Array(1000).fill().map((_, i) => {
    const epsilonBestArm = results[0][i][1]
    const ucb1BestArm = results[1][i][1]
    const ucb2BestArm = results[2][i][1]
    const softmaxBestArm = results[3][i][1]
    const annealingSoftmaxBestArm = results[4][i][1]
    const thompsonBestArm = results[5][i][1]
    return [epsilonBestArm, ucb1BestArm, ucb2BestArm, softmaxBestArm, annealingSoftmaxBestArm, thompsonBestArm].join(',')
  })

  writeCSV('plots/average-reward.csv', headers.concat(data2).join('\n'))
}

main()

function writeCSV (fileName, data) {
  fs.writeFile(fileName, data, (err, ok) => {
    if (err) {
      throw err
    }
    console.log('done writing')
  })
}
