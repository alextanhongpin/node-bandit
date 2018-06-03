const sum = (arr) => {
  return arr.reduce((total, val) => total + val, 0)
}

const maxIndex = (arr) => {
  return arr.indexOf(Math.max(...arr))
}

module.exports = {
  sum,
  maxIndex
}
