export function oneAtTheTime(fn: () => Promise<void>) {
  let currentCall: null | Promise<void> = null

  return async () => {
    if (currentCall != null) {
      return await currentCall
    }

    try {
      currentCall = fn()
      await currentCall
    } finally {
      currentCall = null
    }
  }
}
