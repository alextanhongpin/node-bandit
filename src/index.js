const UCB1 = require('./ucb1')
const UCB2 = require('./ucb2')
const Softmax = require('./softmax')
const AnnealingSoftmax = require('./annealing-softmax')
const EpsilonGreedy = require('./epsilon-greedy')
const ThompsonSampling = require('./thompson-sampling')

const handler = {
  construct (Class, args, a) {
    const newClass = new Class(...args)
    const hasArgs = args.length > 0
    if (!hasArgs) {
      return new Proxy(newClass, handler)
    }

    const hasOneArgs = args.length === 1
    const hasTwoArgs = args.length === 2
    const hasThreeArgs = args.length === 3

    switch (newClass.constructor.name) {
      case 'EpsilonGreedy':
        if (hasOneArgs) {
          const temperature = args[0]
          if (temperature < 0 || temperature > 1) {
            throw new Error('epsilon must be in range 0 <= n <= 1')
          }
        }
        if (hasTwoArgs) {
          const nArms = args[1].length
          const defaultValues = Array(nArms).fill(0.0)
          return new Proxy(new Class(...args, defaultValues), handler)
        }

        if (hasThreeArgs) {
          if (args[1].length !== args[2].length) {
            throw new Error('unequal counts and values length')
          }
        }
        return new Proxy(newClass, handler)
      case 'AnnealingSoftmax':
      case 'Softmax':
        if (hasOneArgs) {
          const temperature = args[0]
          if (temperature < 0) {
            throw new Error('temperature cannot be lower than 0')
          }
        }
        if (hasTwoArgs) {
          const nArms = args[1].length
          const defaultValues = Array(nArms).fill(0.0)
          return new Proxy(new Class(...args, defaultValues), handler)
        }

        if (hasThreeArgs) {
          if (args[1].length !== args[2].length) {
            throw new Error('unequal counts and values length')
          }
        }
        return new Proxy(newClass, handler)
      case 'UCB1':
      case 'UCB2':
      case 'ThompsonSampling':
        if (hasOneArgs) {
          const nArms = args[0].length
          const defaultValues = Array(nArms).fill(0.0)
          return new Proxy(new Class(...args, defaultValues), handler)
        }
        if (hasTwoArgs) {
          // Compare the length
          if (args[0].length !== args[1].length) {
            throw new Error('unequal counts and values length')
          }
          return new Proxy(newClass, handler)
        }
        return new Proxy(newClass, handler)
      default:
        throw new Error('not valid')
    }
  },
  get (target, propKey, receiver) {
    const targetValue = Reflect.get(target, propKey, receiver)
    if (typeof targetValue === 'function') {
      return function (...args) {
        const method = propKey

        // Capture the methods and perform validation
        switch (method) {
          case 'initialize':
            const nArms = args[0]
            if (nArms <= 0) {
              throw new Error('nArms cannot be equal or less than zero')
            }
            break
          case 'selectArm':
            if (target.counts.length === 0 || target.values.length === 0) {
              throw new Error('no arms available')
            }
            break
          case 'update':
            if (!args.length) {
              throw new Error('missing arguments chosenArm and reward')
            }
            if (args.length === 1) {
              throw new Error('missing argument reward')
            }

            const chosenArm = args[0]
            const reward = args[1]
            if (chosenArm < 0) {
              throw new Error('chosenArm cannot be less than zero')
            }
            if (reward < 0) {
              throw new Error('reward cannot be less than zero')
            }
        }
        return targetValue.apply(this, args)
      }
    }
    return targetValue
  }
}

const algorithms = {
  ucb1: UCB1,
  ucb2: UCB2,
  softmax: Softmax,
  annealing: AnnealingSoftmax,
  epsilon: EpsilonGreedy,
  thompson: ThompsonSampling
}

module.exports = function (type) {
  const oneOf = type === 'ucb1' ||
    type === 'ucb2' ||
    type === 'softmax' ||
    type === 'annealing' ||
    type === 'epsilon' ||
    type === 'thompson'

  if (!type || !oneOf) {
    throw new Error(`unable to create factory bandit, type "${type}" does not exist`)
  }

  return new Proxy(algorithms[type], handler)
}
