/** Whether a nav link points at the current section. Tag pages count as the blog. */
export const isActivePath = (pathname: string, href: string) =>
  href === '/'
    ? pathname === '/'
    : pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (href === '/blog' && pathname.startsWith('/tags/'))
