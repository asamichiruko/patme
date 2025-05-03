const listeners = []

export function subscribe(listener) {
  listeners.push(listener)
}

export function notify() {
  listeners.forEach((listener) => listener())
}
