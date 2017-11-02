
// function categoricalDraw (probs) {
//   const z = Math.random()
//   let cumulativeProb = 0
//   for (let i = 0; i < probs.length; i += 1) {
//     const prob = probs[i]
//     cumulativeProb += prob
//     if (cumulativeProb > z) {
//       return i
//     }
//   }
//   return probs.length - 1
// }

// function simulate (AlgoClass, options, arms, horizon) {
//   const chosenArm = Array(horizon).fill()
//   const rewards = Array(horizon).fill()
//   const cumulativeRewards = Array(horizon).fill()

//   const algo = new AlgoClass(options)
//   let cumulativeReward = 0

//   for (let t = 0; t < horizon; t += 1) {
//     const i = algo.selectArm()
//     const arm = arms[i]
//     const reward = arm.pull()
//     algo.update(i, reward)

//     chosenArm[t] = i
//     rewards[t] = reward
//     cumulativeReward += reward
//     cumulativeRewards[t] = cumulativeReward
//   }
//   return { chosenArm, rewards, cumulativeRewards, algo }
// }

// function testEpsilonGreedy () {
//   const means = [0.1, 0.1, 0.1, 0.1, 0.9]
//   const nArms = means.length
//   const horizon = 100000
//   const arms = means.map(v => new BernoulliArm(v))
//   const results = simulate(EpsilonGreedy, { epsilon: 0.1, n: nArms }, arms, horizon)

//   console.log(arms)
//   console.log(results.chosenArm[99999])
//   console.log(results.cumulativeRewards[99999])

//   // maxReward = horizon * maxP = 100000 * 0.1 = 10000
//   // regret = maxReward - totalReward = 10000 - 8906 = 1094
//   // maxReward * epsilon = 10000 * 0.1 = 1000 = 1094 = regret
// }

// function testSoftmax () {
//   const means = [0.1, 0.1, 0.1, 0.1, 0.9]
//   const nArms = means.length
//   const horizon = 100000
//   const arms = means.map((mean) => new BernoulliArm(mean))
//   const results = simulate(Softmax, { temperature: 0.1, n: nArms }, arms, horizon)
//   console.log(results.chosenArm[horizon - 1])
//   console.log(results.cumulativeRewards[horizon - 1])
// }

// function testAnnealingSoftmax () {
//   const means = [0.1, 0.1, 0.1, 0.1, 0.9]
//   const nArms = means.length
//   const horizon = 1000
//   const arms = means.map((mean) => new BernoulliArm(mean))
//   const results = simulate(AnnealingSoftmax, { n: nArms }, arms, horizon)
//   console.log(results.chosenArm[horizon - 1])
//   console.log(results.cumulativeRewards[horizon - 1])
// }

// function testUCB () {
//   const means = [0.1, 0.1, 0.1, 0.1, 0.9]
//   const nArms = means.length
//   const horizon = 1000
//   const arms = means.map((mean) => new BernoulliArm(mean))
//   const results = simulate(UCB1, { n: nArms }, arms, horizon)
//   console.log(results.chosenArm[horizon - 1])
//   console.log(results.cumulativeRewards[horizon - 1])
// }

// testUCB()
