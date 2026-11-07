import { LOGO_PATHS } from '@/lib/edition/logoPaths'

// The Raffi.Website wordmark from the raffi.website navbar. Decorative by default; pass a
// title to give it an accessible name.
export default function Logo({
  className = 'ed-logo',
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 904 349"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMid meet"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      <g transform="translate(0.000000,349.000000) scale(0.100000,-0.100000)">
        {LOGO_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
