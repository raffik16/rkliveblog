/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { isReferralLink } from '@/data/referralLinks'

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  // A referral link can pay a commission, so it is marked "sponsored" (and "nofollow", for
  // search engines that don't read "sponsored"), as Google's rules on paid links ask.
  const rel = isReferralLink(href)
    ? 'sponsored nofollow noopener noreferrer'
    : 'noopener noreferrer'

  return <a className="break-words" target="_blank" rel={rel} href={href} {...rest} />
}

export default CustomLink
