// // https:// github.com/iosband/iosband.github.io/blob/master/js/ber_bandits.js
// // ------------------------------------------------------------------------------
// // Generating random Beta in Javascript (taken from StackExchange)

// console.log('HELLO BITCHES')

// // javascript shim for Python's built-in 'sum'
// function sum (nums) {
//   var accumulator = 0
//   for (var i = 0, l = nums.length; i < l; i++) { accumulator += nums[i] }
//   return accumulator
// }

// // From Python source, so I guess it's PSF Licensed
// var SG_MAGICCONST = 1 + Math.log(4.5)
// var LOG4 = Math.log(4.0)
// var SQRT2PI = Math.sqrt(Math.PI * 2)
// function pgamma (z) {
//   // Reflection to right half of complex plane
//   if (z < 0.5) {
//     return Math.PI / Math.sin(Math.PI * z) / pgamma(1 - z)
//   }
//   // Lanczos approximation with g=7
//   var az = z + 6.5
//   return Math.pow(az, (z - 0.5)) / Math.exp(az) * SQRT2PI * sum([
//     0.9999999999995183,
//     676.5203681218835 / z,
//     -1259.139216722289 / (z + 1.0),
//     771.3234287757674 / (z + 2.0),
//     -176.6150291498386 / (z + 3.0),
//     12.50734324009056 / (z + 4.0),
//     -0.1385710331296526 / (z + 5.0),
//     0.9934937113930748e-05 / (z + 6.0),
//     0.1659470187408462e-06 / (z + 7.0)
//   ])
// }

// function rgamma (alpha, beta) {
//   // does not check that alpha > 0 && beta > 0
//   if (alpha > 1) {
//     // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
//     // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
//     var ainv = Math.sqrt(2.0 * alpha - 1.0)
//     var bbb = alpha - LOG4
//     var ccc = alpha + ainv

//     while (true) {
//       var u1 = Math.random()
//       if (!((u1 > 1e-7) && (u1 < 0.9999999))) {
//         continue
//       }
//       var u2 = 1.0 - Math.random()
//       v = Math.log(u1 / (1.0 - u1)) / ainv
//       x = alpha * Math.exp(v)
//       var z = u1 * u1 * u2
//       var r = bbb + ccc * v - x
//       if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
//         return x * beta
//       }
//     }
//   } else if (alpha == 1.0) {
//     var u = Math.random()
//     while (u <= 1e-7) {
//       u = Math.random()
//     }
//     return -Math.log(u) * beta
//   } else { // 0 < alpha < 1
//     // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
//     while (true) {
//       var u3 = Math.random()
//       var b = (Math.E + alpha) / Math.E
//       var p = b * u3
//       if (p <= 1.0) {
//         x = Math.pow(p, (1.0 / alpha))
//       } else {
//         x = -Math.log((b - p) / alpha)
//       }
//       var u4 = Math.random()
//       if (p > 1.0) {
//         if (u4 <= Math.pow(x, (alpha - 1.0))) {
//           break
//         }
//       } else if (u4 <= Math.exp(-x)) {
//         break
//       }
//     }
//     return x * beta
//   }
// }

// // like betavariate, but more like R's name
// function rbeta (alpha, beta) {
//   var alpha_gamma = rgamma(alpha, 1)
//   return alpha_gamma / (alpha_gamma + rgamma(beta, 1))
// }

// // ------------------------------------------------------------------------------
// // Basic bandit functions
// // All of this is specific to independent bernoulli bandits

// function init_counts (n_arms) {
//     // init_counts is a function to initialize empty counts for the bandit
//     // algorithm of with n_arms independent arms.
//     //
//     // Args:
//     //  n_arms - int - number of arms for bandit
//     //
//     // Returns:
//     //  arm_counts - n_arms x 2 - array of counts set to zero
//   var arm_counts = []
//   for (i = 0; i < n_arms; i++) {
//     arm_counts.push([0, 0])
//   }
//   return arm_counts
// }

// function init_arms (n_arms) {
//     // init_arms is a function to initialize random uniform probalities for
//     // the arms in the bandit problem
//     //
//     // Args:
//     //  n_arms - int - number of arms for bandit
//     //
//     // Returns:
//     //  p_true - n_arms x 1 - array of success probabilities (unknown to agent)
//   var p_true = []
//   for (i = 0; i < n_arms; i++) {
//     p_true.push(Math.random())
//   }
//   return p_true
// }

// function pull_arm (p_true, action) {
//     // pull_arm is a function to evaluate one step of the bandit algorithm
//     //
//     // Args:
//     //  p_true - n_arm x 1 - array of success probabilities
//     //  action - int - choice of arm to pull
//     //
//     // Returns:
//     //  reward - int - binary outcome of slot machine
//   if (Math.random() < p_true[action]) {
//     return 1
//   } else {
//     return 0
//   }
// }

// function run_bandit (p_true, bandit_alg, t_steps) {
//     // run_bandit runs a bandit algorithm for t_steps
//     //
//     // Args:
//     //  p_true - n_arm x 1 - array of success probabilities
//     //  bandit_alg - funciton - bandit algorithm to use
//     //
//     // Returns:
//     //  cum_rewards - t_step x 1 - array of cumulative rewards through time
//   var cum_rewards = []
//   var arm_counts = init_counts(p_true.length)

//   for (t = 0; t < 100; t++) {
//     choice = bandit_alg(arm_counts, t + 1)
//     reward = pull_arm(p_true, choice)
//     if (t === 0) {
//       cum_rewards.push(reward)
//     } else {
//       cum_rewards.push(reward + cum_rewards[t - 1])
//     }
//     arm_counts[choice][1 - reward] += 1
//   }
//   return cum_rewards
// }

// // ------------------------------------------------------------------------------
// // Bandit algorithms (e-greedy, posterior sampling and UCB)
// // Note that for ease of transfer we have added the dummy timestep variable
// // for ease of transfer in the run_bandit algorithm

// function ps_choice (arm_counts) {
//     // ps_choice uses posterior sampling to make a choice of arm.
//     //
//     // Args:
//     //  arm_counts - n_arms x 2 - array of observed counts
//     //
//     // Returns:
//     //  choice - int - arm to be pulled at the next timestep (0 index)
//   var p_max = -1
//   var choice = -1
//   var prior_a = 1
//   var prior_b = 1
//   for (i = 0; i < arm_counts.length; i++) {
//     var p_sample = rbeta(arm_counts[i][0] + prior_a,
//                              arm_counts[i][1] + prior_b)
//     if (p_sample > p_max) {
//       p_max = p_sample
//       choice = i
//     }
//   }
//   return choice
// }

// function greedy_choice (arm_counts) {
//     // greedy_choice uses the greedy empirical estimate to choose an arm.
//     //
//     // Args:
//     //  arm_counts - n_arms x 2 - array of observed counts
//     //
//     // Returns:
//     //  choice - int - arm to be pulled at the next timestep (0 index)
//   var p_max = -1
//   var choice = -1
//   for (i = 0; i < arm_counts.length; i++) {
//     var n_pull = (arm_counts[i][0] + arm_counts[i][1])
//     if (n_pull < 0.5) {
//       n_pull = 1
//     }
//     p_hat = arm_counts[i][0] / n_pull
//     if (p_hat > p_max) {
//       p_max = p_hat
//       choice = i
//     }
//   }
//   return choice
// }

// function egreedy_choice (arm_counts) {
//     // egreedy_choice uses epsilon-greedy to choose an arm.
//     //
//     // Args:
//     //  arm_counts - n_arms x 2 - array of observed counts
//     //  epsilon - double - probability of random action - now fixed within
//     //
//     // Returns:
//     //  choice - int - arm to be pulled at the next timestep (0 index)
//   var epsilon = 0.1
//   var choice = -1
//   if (Math.random() < epsilon) {
//     choice = Math.floor((Math.random() * arm_counts.length))
//   } else {
//     choice = greedy_choice(arm_counts)
//   }
//   return choice
// }

// function ucb_choice (arm_counts, timestep) {
//     // ucb_choice uses the UCB algoirthm to choose an arm.
//     //
//     // Args:
//     //  arm_counts - n_arms x 2 - array of observed counts
//     //  timestep - int - number of timesteps elapsed
//     //
//     // Returns:
//     //  choice - int - arm to be pulled at the next timestep (0 index)
//   var p_max = -1
//   var choice = -1
//   for (i = 0; i < arm_counts.length; i++) {
//     var n_pull = (arm_counts[i][0] + arm_counts[i][1])
//     if (n_pull < 0.5) {
//       n_pull = 1
//     }
//     var p_hat = arm_counts[i][0] / n_pull
//     var p_upper = p_hat + Math.sqrt(Math.log(timestep) / n_pull)
//     if (p_upper > p_max) {
//       p_max = p_upper
//       choice = i
//     }
//   }
//   return choice
// }
// a
