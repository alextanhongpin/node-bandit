function sum (x) {
  return x.reduce((a, b) => a + b, 0)
}

function mean (x) {
  return sum(x) / x.length
}

function min (x) {
  return Math.min(...x)
}

function max (x) {
  return Math.max(...x)
}

function variance (x) {
  const xMean = mean(x)
  const deviations = x.map((i) => Math.pow(i - xMean, 2))
  return mean(deviations)
}

// Probability Distribution Function Beta
function pdfBeta (x, a, b) {
  const _beta = beta(a, b)
  return x.map((i) => {
    return (Math.pow(i, a - 1) * Math.pow(1 - i, b - 1)) / _beta
  })
}

function beta (a, b) {
  const logN = Math.log(a) * (a - 0.5) + Math.log(b) * (b - 0.5)
  const logD = Math.log(a + b) * (a + b - 0.5)
  return Math.sqrt(2 * Math.PI) * Math.exp(logN - logD)
}

function rBeta (a, b) {
  const p = a / b // ratio
  const sum = a + b
  const min = Math.min(a, b)
  const lambda = min <= 1 ? min : Math.sqrt((2 * a * b - a - b) / (sum - 2))
  while (true) {
    const r1 = Math.random()
    const r2 = Math.random()
    const y = Math.pow((1.0 / r1 - 1.0), 1.0 / lambda)
    const lhs = 4 * r1 * r2 * r2
    const rhs = Math.pow(y, a - lambda) * Math.pow((1.0 + p) / (1 + p * y), sum)
    if (lhs < rhs) {
      return (p * y) / (1 + p * y)
    }
  }
}
module.exports = {
  sum,
  mean,
  min,
  max,
  variance,
  beta,
  rBeta,
  pdfBeta
}
