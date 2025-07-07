//  Get color of the priority
export const getTagColor = (tag: string): string => {
  let color = 'grey';

  switch (tag) {
    case 'low':
      color = 'green';
      break;
    case 'high':
      color = 'red';
      break;
    case 'normal':
      color = 'blue';
      break;
    default:
      color = 'grey-lighten-2';
      break;
  }

  return color;
};

//  Format title of the page to Ex Taskmanager 1.2 | Home
export default function formatLabel(str = '') {
  if (!str) return '';

  return str
    .split(/[\.\_\-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
