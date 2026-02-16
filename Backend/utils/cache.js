const cache = new Map()

export function setCache(key, value, ttl = 300000) {
  cache.set(key, {
    data: value,
    expiry: Date.now() + ttl
  })
}

export function getCache(key) {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data
}