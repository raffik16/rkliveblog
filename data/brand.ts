// Links back to raffi.website, the main site this blog belongs to. The blog uses the same
// design system (css/edition.css); these are the places the two sites hand off to each other.
const mainSite = 'https://raffi.website'

const brand = {
  name: 'Raffi Keklikian',
  place: 'Los Angeles',
  mainSite,
  /** Label shown next to the logo in the navbar (the main site shows "Los Angeles" there) */
  section: 'Blog',
  contact: `${mainSite}/contact`,
  mainNav: [
    { href: `${mainSite}/work`, title: 'Work' },
    { href: `${mainSite}/services`, title: 'Services' },
    { href: `${mainSite}/about`, title: 'About' },
    { href: `${mainSite}/contact`, title: 'Contact' },
  ],
}

export default brand
