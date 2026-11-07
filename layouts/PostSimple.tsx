import PostShell, { type PostShellProps } from '@/components/post/PostShell'

// Essay layout: no contents rail, with comments under the article.
export default function PostSimple(props: PostShellProps) {
  return <PostShell {...props} comments />
}
