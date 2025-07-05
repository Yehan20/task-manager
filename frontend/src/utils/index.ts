
// Display messages if only in dev
export function log(...args: any[]) {
  if (import.meta.env.VITE_APP_ENVIRNOMENT_DEV) {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`%c[${timestamp}]`, 'color: gray', ...args)
  }
}