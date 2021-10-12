const PREFIX = ''

export default function bem(name, conf) {
  const mods = []
  name = PREFIX + name
  modResolver(mods, conf)
  const bemClass = mods.map((m) => `${name}-${m}`)
  bemClass.unshift(name)
  return bemClass
}

function modResolver(mods, conf) {
  if (typeof conf === 'string') {
    mods.push(conf)
  } else if (Array.isArray(conf)) {
    conf.forEach((c) => modResolver(mods, c))
  } else if (typeof conf === 'object') {
    Object.keys(conf).forEach((k) => conf[k] && mods.push(k))
  }
}
