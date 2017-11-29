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

// // Probability Distribution Function Beta
// function pdfBeta (x, a, b) {
//   const _beta = beta(a, b)
//   return x.map((i) => {
//     return (Math.pow(i, a - 1) * Math.pow(1 - i, b - 1)) / _beta
//   })
// }

// function beta (a, b) {
//   const logN = Math.log(a) * (a - 0.5) + Math.log(b) * (b - 0.5)
//   const logD = Math.log(a + b) * (a + b - 0.5)
//   return Math.sqrt(2 * Math.PI) * Math.exp(logN - logD)
// }

// function rBeta (a, b) {
//   const p = a / b // ratio
//   const sum = a + b
//   const min = Math.min(a, b)
//   const lambda = min <= 1 ? min : Math.sqrt((2 * a * b - a - b) / (sum - 2))
//   while (true) {
//     const r1 = Math.random()
//     const r2 = Math.random()
//     const y = Math.pow((1.0 / r1 - 1.0), 1.0 / lambda)
//     const lhs = 4 * r1 * r2 * r2
//     const rhs = Math.pow(y, a - lambda) * Math.pow((1.0 + p) / (1 + p * y), sum)
//     if (lhs < rhs) {
//       return (p * y) / (1 + p * y)
//     }
//   }
// }

function rbeta (alpha, beta) {
  const alphaGamma = rgamma(alpha, 1)
  return alphaGamma / (alphaGamma + rgamma(beta, 1))
}

function rgamma (alpha, beta) {
// From Python source, so I guess it's PSF Licensed
  const SG_MAGICCONST = 1 + Math.log(4.5)
  const LOG4 = Math.log(4.0)

  // does not check that alpha > 0 && beta > 0
  if (alpha > 1) {
    // Uses R.C.H. Cheng, "The generation of Gamma variables with non-integral
    // shape parameters", Applied Statistics, (1977), 26, No. 1, p71-74
    const ainv = Math.sqrt(2.0 * alpha - 1.0)
    const bbb = alpha - LOG4
    const ccc = alpha + ainv

    while (true) {
      const u1 = Math.random()
      if (!((u1 > 1e-7) && (u1 < 0.9999999))) {
        continue
      }
      const u2 = 1.0 - Math.random()
      const v = Math.log(u1 / (1.0 - u1)) / ainv
      const x = alpha * Math.exp(v)
      const z = u1 * u1 * u2
      const r = bbb + ccc * v - x
      if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
        return x * beta
      }
    }
  } else if (alpha === 1.0) {
    let u = Math.random()
    while (u <= 1e-7) {
      u = Math.random()
    }
    return -Math.log(u) * beta
  } else { // 0 < alpha < 1
    let x
    // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
    while (true) {
      const u3 = Math.random()
      const b = (Math.E + alpha) / Math.E
      const p = b * u3
      if (p <= 1.0) {
        x = Math.pow(p, (1.0 / alpha))
      } else {
        x = -Math.log((b - p) / alpha)
      }
      const u4 = Math.random()
      if (p > 1.0) {
        if (u4 <= Math.pow(x, (alpha - 1.0))) {
          break
        }
      } else if (u4 <= Math.exp(-x)) {
        break
      }
    }
    return x * beta
  }
}
module.exports = {
  sum,
  mean,
  min,
  max,
  variance,
  rbeta
}
