export function loadFromLocalStorage<T>(key: string): Record<string, T> {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : {}
}

export function saveToLocalStorage<T>(key: string, data: Record<string, T>): void {
  localStorage.setItem(key, JSON.stringify(data))
}
