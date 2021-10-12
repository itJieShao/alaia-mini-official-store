function isDef(value) {
  return value !== undefined && value !== null
}

function isObj(x) {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

function isNumber(value) {
  return /^\d+$/.test(value)
}

function oneOf(value, list) {
  return list.includes(value)
}

export {
  isObj, isDef, isNumber, oneOf,
}
