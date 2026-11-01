// The root template remounts when the top-level route segment changes (e.g. /blog -> /projects),
// so this CSS animation replays then; it does not replay within a section (/blog -> /blog/post).
// It is CSS-only on purpose: content is in the server HTML and does not wait for hydration (works
// without JS), and the fade only runs for users who have not asked for reduced motion.
const pageFadeCss = `
@keyframes rk-page-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  .rk-page-fade { animation: rk-page-fade-in 250ms ease-out; }
}
`

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageFadeCss }} />
      <div className="rk-page-fade min-h-screen">{children}</div>
    </>
  )
}
