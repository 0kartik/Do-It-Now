let _now = () => Date.now()

export function now() {
  return _now()
}

export function setNow(fn) {
  _now = fn
}

export function resetNow() {
  _now = () => Date.now()
}