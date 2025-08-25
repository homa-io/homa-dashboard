// Avatar colors with light and dark mode variants
const AVATAR_COLORS_LIGHT = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F', '#AED6F1',
  '#A569BD', '#5DADE2', '#F39C12', '#58D68D', '#EC7063', '#5499C7', '#F7DC6F', '#7FB3D3',
  '#CD6155', '#48C9B0', '#F4A261', '#52BE80', '#E74C3C', '#3498DB', '#F39C12', '#27AE60',
  '#9B59B6', '#2980B9', '#E67E22', '#16A085', '#E91E63', '#8E44AD', '#D35400', '#1ABC9C',
  '#FF5722', '#673AB7', '#FF9800', '#009688', '#795548', '#607D8B', '#FF4081', '#7C4DFF',
  '#FFC107', '#4CAF50', '#6D4C41', '#546E7A', '#E91E63', '#9C27B0', '#FFEB3B', '#8BC34A',
  '#5D4037', '#455A64', '#F06292', '#BA68C8', '#CDDC39', '#66BB6A', '#8D6E63', '#78909C'
]

// Darker, more muted colors for dark mode backgrounds
const AVATAR_COLORS_DARK = [
  '#DC2626', '#059669', '#2563EB', '#7C3AED', '#EA580C', '#BE185D', '#0891B2', '#65A30D',
  '#7C2D12', '#374151', '#991B1B', '#064E3B', '#1E3A8A', '#581C87', '#9A3412', '#9F1239',
  '#0E7490', '#365314', '#450A0A', '#1F2937', '#7F1D1D', '#022C22', '#1E1B4B', '#4C1D95',
  '#7C2D12', '#831843', '#164E63', '#1A2E05', '#431407', '#111827', '#6B1A1A', '#14532D',
  '#312E81', '#6B21A8', '#9A3412', '#BE123C', '#155E75', '#3F6212', '#7C2D12', '#1F2937',
  '#92400E', '#1E40AF', '#7E22CE', '#B91C1C', '#0F766E', '#166534', '#5B21B6', '#DC2626',
  '#0369A1', '#16A34A', '#8B5CF6', '#EF4444', '#10B981', '#3B82F6', '#8B5A2B', '#6B7280',
  '#DC2626', '#059669', '#2563EB', '#7C3AED', '#EA580C', '#BE185D', '#0891B2', '#65A30D'
]

// Simple string hash function
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Get consistent color for a given name/text with dark mode support
export function getAvatarColor(text: string, isDarkMode: boolean = false): string {
  if (!text) return isDarkMode ? AVATAR_COLORS_DARK[0] : AVATAR_COLORS_LIGHT[0]
  const hash = hashString(text.toLowerCase().trim())
  const colors = isDarkMode ? AVATAR_COLORS_DARK : AVATAR_COLORS_LIGHT
  return colors[hash % colors.length]
}

// Get initials from a name
export function getInitials(name: string): string {
  if (!name) return 'NA'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}