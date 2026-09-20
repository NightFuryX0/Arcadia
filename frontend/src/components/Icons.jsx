// Small inline SVG icon set (no icon library needed).
const base = {
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false,
}
const icon = (children, extra) => (props) => <svg {...base} {...extra} {...props}>{children}</svg>

export const HomeIcon = icon(<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />)
export const CompassIcon = icon(<><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6z" /></>)
export const LibraryIcon = icon(<><rect x="4" y="4" width="4" height="16" rx="1" /><rect x="10" y="4" width="4" height="16" rx="1" /><path d="m16 6.5 4 1-3.5 13-4-1z" /></>)
export const UserIcon = icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>)
export const SearchIcon = icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>)
export const PlusIcon = icon(<path d="M12 5v14M5 12h14" />)
export const CheckIcon = icon(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const CloseIcon = icon(<path d="M6 6l12 12M18 6 6 18" />)
export const ArrowRightIcon = icon(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ArrowLeftIcon = icon(<path d="M19 12H5M11 6l-6 6 6 6" />)
export const AlertIcon = icon(<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>)
export const GamepadIcon = icon(<><path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.2 2L15 15H9l-1.8 2A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4z" /><path d="M8 10.5v3M6.5 12h3M15.5 11.5h.01M17.5 13h.01" /></>)
export const StarIcon = icon(
  <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  { fill: 'currentColor', stroke: 'none' },
)
