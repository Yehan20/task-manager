// Display messages if only in dev
export function log(...args: any[]) {
  if (import.meta.env.VITE_APP_ENVIRNOMENT_DEV) {
    const timestamp = new Date().toLocaleTimeString()

    // Create an error to capture the stack trace
    const stack = new Error().stack

    // Extract the caller location (3rd line of stack trace usually)
    const callerLine = stack?.split('\n')[2]?.trim() || ''
    const cleanCaller = callerLine.replace(/^at\s+/, '')

    console.log(
      `%c[${timestamp}] %c${cleanCaller}`,
      'color: gray',
      'color: blue; font-style: italic',
      ...args
    )
  }
}


//  Get color of the priority
export const getTagColor = (tag: string): string => {
  let color = 'grey';

  switch (tag) {
    case 'low':
      color = 'green'
      break;
    case 'high':
      color = 'red'
      break;
    case 'normal':
      color = 'blue'
      break;
    default:
      color = 'grey-lighten-2'
      break;  
  }
 
   return color
};

//  Format title of the page to Ex Taskmanager 1.2 | Home
export default function formatLabel(str='') {
  if (!str) return '';

  return str
    .split(/[\.\_\-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}