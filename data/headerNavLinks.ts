// Home stays first for the mobile menu; the desktop header skips it (the logo links home).
// Tags and WebMCP are reachable from the /blog filters and the /lab page.
const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/blog', title: 'Blog' },
  { href: '/lab', title: 'Lab' },
  { href: '/projects', title: 'Projects' },
  { href: '/about', title: 'About' },
]

export default headerNavLinks
