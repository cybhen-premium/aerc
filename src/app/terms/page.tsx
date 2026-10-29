import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/db';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms of Service – ${settings.organizationShortName || 'AERCGH'}`,
    description: `Official Terms of Service for accessing and referencing materials on ${settings.organizationName}.`,
  };
}

export default async function TermsOfServicePage() {
  const settings = await getSiteSettings();

  const defaultContent = `
# Terms of Service

**Effective Date:** January 1, 2026  
**Governing Law:** Republic of Ghana

Welcome to the official digital portal of ${settings.organizationName} ("${settings.organizationShortName || 'AERCGH'}"). By accessing, browsing, or utilizing this portal, you agree to be bound by these Terms of Service.

---

## 1. Non-Profit & Public Advocacy Mission
The website (aercghana.net) is maintained for public education, grassroots climate advocacy, research dissemination, and community empowerment. Materials are provided in good faith to promote sustainable development in Ghana and across the African continent.

## 2. Intellectual Property & Open Access Licensing
- **Original Research & Publications:** AERC Ghana champions open scientific access. Unless otherwise stated, research reports, policy briefs, and educational toolkits are released under Creative Commons principles. You are encouraged to read, download, quote, and distribute them with proper attribution to "${settings.organizationName}".
- **Photographs & Field Media:** Media assets documenting community participants and grassroots field projects are the property of AERC Ghana and its partner communities and may not be used for commercial advertising without written permission.

## 3. Acceptable Use of Interactive Forms
Users submitting contact inquiries, volunteer applications, or partner proposals agree to:
- Provide accurate, authentic, and truthful information.
- Refrain from automated spamming, crawling, script injection, or malicious payload submissions.
- Respect community privacy and personal boundaries.

## 4. Third-Party Links & Coalitions
Our website features links to partner organizations, environmental coalitions, and research repositories. AERC Ghana does not endorse or accept responsibility for the content or operational privacy practices of external third-party sites.

## 5. Limitation of Liability
While we strive for accurate, timely, and verified scientific and policy reporting, AERC Ghana provides information on an "as-is" basis without warranties of uninterrupted service.

## 6. Amendments & Contact Information
We reserve the right to update these terms to reflect evolving legal and operational guidelines. For questions regarding these terms, contact us at:
- **Email:** ${settings.contactEmail || 'info@aercghana.net'}
- **Telephone:** ${settings.phonePrimary || '+233 24 698 0091'}
- **Address:** ${settings.addressStreet || 'Afienya-Mataheko, opposite Grace Bio'}, ${settings.addressCity || 'Greater Accra Region'}, ${settings.addressCountry || 'Ghana'}.
`;

  const contentToRender = settings.termsOfServiceContent || defaultContent;

  return (
    <>
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Terms of Service</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Terms of Service</span></li>
          </ul>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div
            style={{
              background: '#ffffff',
              padding: '50px 40px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '24px',
              }}
            >
              <i className="fa-solid fa-scale-balanced"></i> Public Interest Open Access Terms
            </div>

            <div
              className="prose prose-slate max-w-none"
              style={{
                fontFamily: 'var(--font-body)',
                color: '#334155',
                lineHeight: 1.8,
                fontSize: '1rem',
                whiteSpace: 'pre-line',
              }}
            >
              {contentToRender}
            </div>

            <div
              style={{
                marginTop: '40px',
                paddingTop: '25px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Governed under the laws of the Republic of Ghana
              </span>
              <Link href="/contact" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Contact Secretariat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
