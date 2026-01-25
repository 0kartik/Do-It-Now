const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))

if (Array.isArray(raw)) {
  // old format (before versioning)
  return raw
}

if (raw?.version === 1) {
  return raw.habits || []
}

return []