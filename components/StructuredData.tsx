export default function StructuredData() {
  const baseUrl = 'https://cyber-tmsah.vercel.app'

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Cyber TMSAH',
    alternateName: 'Cyber TMSAH - المنصة الأكاديمية الشاملة',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: 'منصة تعليمية متكاملة للأمن السيبراني تجمع بين الجداول الدراسية والمصادر التعليمية ودليل الأمن السيبراني',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressRegion: 'Cairo',
    },
    sameAs: [
      'https://github.com/phoenixcrypto',
      'https://www.linkedin.com',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@cyber-tmsah.com',
    },
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cyber TMSAH',
    url: baseUrl,
    description: 'منصة تعليمية متكاملة للأمن السيبراني',
    inLanguage: ['ar', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
