// Referral (affiliate) links used in posts. A link is treated as one when it goes to a host
// below and carries that programme's referral code, so a plain link to the same company stays
// an ordinary link. components/Link.tsx adds rel="sponsored nofollow" to the ones that match.
//
// When a post gets a referral link to a new programme, add its host and code pattern here, and
// say so near the top of the post ("Some links in this post are referral links...").
const referralLinks: { host: string; code: RegExp }[] = [
  // https://gostellar.app/signup?ref=...
  { host: 'gostellar.app', code: /[?&]ref=/ },
  // https://accessibe.com/a/...
  { host: 'accessibe.com', code: /^\/a\// },
  // https://ipqualityscore.com/?r=...
  { host: 'ipqualityscore.com', code: /[?&]r=/ },
]

export function isReferralLink(href?: string): boolean {
  if (!href) return false
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }
  const host = url.hostname.replace(/^www\./, '')
  return referralLinks.some(
    (link) => host === link.host && link.code.test(url.pathname + url.search)
  )
}

export default referralLinks
