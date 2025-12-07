export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function generateRandomColor(seed: string): string {
  let hash = 0;

  for (const char of seed) {
    hash = char.charCodeAt(0) + hash * 41;
  }

  const hue = hash % 360;
  return `hsl(${hue}, 50%, 40%)`;
}
