import PostShell, { type PostShellProps } from '@/components/post/PostShell'

// Visual layout: the first image in `images` runs wide under the header; comments under the
// article.
export default function PostBanner(props: PostShellProps) {
  return <PostShell {...props} banner comments />
}
