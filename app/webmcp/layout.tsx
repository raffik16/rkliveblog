export default function WebMCPLayout({ children }: { children: React.ReactNode }) {
  // The toolkit keeps its own look; the frame only clears the fixed navbar.
  return <div className="ed-demo-frame">{children}</div>
}
