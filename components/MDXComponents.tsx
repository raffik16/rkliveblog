import type { ComponentProps } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

// The post's title is the page's one <h1> (components/post/PostShell.tsx). A "# Heading" inside
// a post's body would be a second, so it renders as an <h2> instead. css/blog.css styles the two
// alike, so the post looks the same either way.
const BodyH1 = ({ children, ...rest }: ComponentProps<'h2'>) => <h2 {...rest}>{children}</h2>

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  h1: BodyH1,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
}
