// The Chaos pieces fill the whole window, so this layout adds nothing around them. Each page
// sets its own title and description (page.tsx, hotdog/page.tsx): a title set here would stop
// the " | Raffi Keklikian" ending from the root layout reaching the pages below.
export default function ChaosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
