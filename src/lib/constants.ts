export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'blue' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'red' },
] as const

export const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'gray' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
] as const

export const PERMISSION_OPTIONS = [
  { value: 'VIEW', label: 'View Only' },
  { value: 'EDIT', label: 'Can Edit' },
] as const

export const KEYBOARD_SHORTCUTS = {
  NEW_TODO: 'n',
  SEARCH: '/',
  TOGGLE_THEME: 't',
  TOGGLE_SIDEBAR: 's',
  CLOSE_MODAL: 'Escape',
} as const

export const ITEMS_PER_PAGE = 20
