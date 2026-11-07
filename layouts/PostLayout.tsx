import PostShell, { type PostShellProps } from '@/components/post/PostShell'

// Default post layout: contents rail on the left, notes on the right.
export default function PostLayout(props: PostShellProps) {
  return <PostShell {...props} toc />
}
