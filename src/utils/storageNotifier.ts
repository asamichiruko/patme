const listeners: (() => void)[] = []

export function subscribe(listener: () => void) {
  listeners.push(listener)
}

export function notify() {
  listeners.forEach((listener) => listener())
}
