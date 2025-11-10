import ProjectsContent from '@/components/ProjectsContent'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return <ProjectsContent />
}
