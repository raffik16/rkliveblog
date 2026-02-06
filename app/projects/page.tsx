import ProjectsContent from '@/components/ProjectsContent'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'A showcase of projects and experiments - from web applications to interactive experiences.',
})

export default function Projects() {
  return <ProjectsContent />
}
