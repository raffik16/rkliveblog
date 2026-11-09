import ProjectsContent from '@/components/ProjectsContent'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'Websites Raffi Keklikian has built for production companies, post houses, studios and brands. The full case studies are on raffi.website.',
  path: '/projects',
})

export default function Projects() {
  return <ProjectsContent />
}
