const fs = require('fs')

const BernoulliArm = require('../../src/bernoulli-arm')

function writeToFile (Algo, fileName, callback) {
  const means = [0.1, 0.1, 0.1, 0.1, 0.9]
  const nArms = means.length
  const numSims = 5000
  const horizons = 250
  const arms = means.map((p) => new BernoulliArm(p))

  const header = ['epsilon', 'simNums', 'times', 'chosenArms', 'rewards', 'cumulativeRewards']
  const output = [header]

  const epsilons = [0.1, 0.2, 0.3, 0.4, 0.5]
  epsilons.forEach(epsilon => {
    const algo = new Algo(epsilon, [], [])
    algo.initialize(nArms)

    const results = testAlgorithm(algo, arms, numSims, horizons)

    Array(numSims).fill(0).forEach((_, i) => {
      const out = [epsilon].concat(results.map((_, j) => results[j][i])).join(',')
      output.push(out)
    })
  })

  const text = output.join('\n')
  fs.writeFile(fileName, text, 'utf-8', callback)
}

function testAlgorithm (algo, arms, numSims, horizon) {
  const chosenArms = Array(numSims * horizon).fill(0.0)
  const rewards = Array(numSims * horizon).fill(0.0)
  const cumulativeRewards = Array(numSims * horizon).fill(0.0)
  const simNums = Array(numSims * horizon).fill(0.0)
  const times = Array(numSims * horizon).fill(0.0)

  for (let i = 0, armsLen = arms.length; i < numSims; i += 1) {
    const sim = i + 1
    algo.initialize(armsLen)

    for (let j = 0; j < horizon; j += 1) {
      const t = j + 1
      const index = (sim - 1) * horizon + t - 1
      simNums[index] = sim
      times[index] = t

      const chosenArm = algo.selectArm()
      chosenArms[index] = chosenArm

      const reward = arms[chosenArms[index]].draw()
      rewards[index] = reward

      if (t === 1) {
        cumulativeRewards[index] = reward
      } else {
        cumulativeRewards[index] = cumulativeRewards[index - 1] + reward
      }

      algo.update(chosenArm, reward)
    }
  }
  return [simNums, times, chosenArms, rewards, cumulativeRewards]
}

module.exports = {
  writeToFile
}
