import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/db';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy – ${settings.organizationShortName || 'AERCGH'}`,
    description: `Official Privacy Policy of ${settings.organizationName} in compliance with the Ghana Data Protection Act 2012 (Act 843).`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  const defaultContent = `
# Privacy Policy & Data Protection Notice

**Effective Date:** January 1, 2026  
**Applicable Framework:** Ghana Data Protection Act 2012 (Act 843)

${settings.organizationName} ("${settings.organizationShortName || 'AERCGH'}", "we", "our", or "us") is dedicated to protecting the privacy, confidentiality, and data protection rights of our community members, frontline partners, volunteers, donors, and website visitors.

---

## 1. Scope & Commitment
This Privacy Policy outlines our practices regarding the collection, processing, storage, and retention of personal data collected through our public website (aercghana.net), contact forms, volunteer applications, and partner proposals.

## 2. Personal Information We Collect
We collect personal information solely for lawful operational, research, and non-commercial advocacy purposes:
- **Contact & Communication Data:** Full name, email address, telephone/WhatsApp number, postal address, and message inquiries.
- **Volunteer & Partnership Submissions:** Institutional affiliation, professional background, geographic location, curriculum vitae details, and project proposals.
- **Donation Processing:** Financial transaction logs, donor names, contact details, and Mobile Money / Card confirmation IDs (handled via secure encrypted gateways).

## 3. Legal Basis for Processing Under Act 843
We process personal data on the following legal bases:
- **Consent:** When you voluntarily submit forms, subscribe to our newsletter dispatches, or register interest in field projects.
- **Legitimate Interest:** To respond to public inquiries, process community grant collaborations, and safeguard our portal from automated abuse.
- **Legal Compliance:** To meet nonprofit financial reporting, NGO regulatory oversight, and auditing standards in Ghana.

## 4. Anti-Spam & Technical Security Measures
We deploy modern server-side protections including cryptographic verification, honeypot bot traps, submission rate-limiting, and HTTPS encryption to prevent unauthorized interception of personal data.

## 5. Data Retention & Erasure Schedule
In line with our administrative data retention policy, contact inquiries and general interaction records are retained for a default retention period of **365 days** unless an active ongoing collaboration requires continued archival. Expired records are routinely purged or anonymized.

## 6. Your Rights as a Data Subject
Under the Data Protection Act (Act 843), you have the right to:
1. **Access:** Request a copy of the personal information we hold about you.
2. **Rectification:** Request correction of inaccurate or outdated details.
3. **Erasure:** Request the deletion of your personal records from our active registers.
4. **Objection:** Opt out of newsletter updates or communications at any time.

## 7. Contact Our Data Compliance Desk
For inquiries regarding this privacy notice or to exercise your rights, please contact our administrative desk:
- **Email:** ${settings.contactEmail || 'info@aercghana.net'}
- **Telephone:** ${settings.phonePrimary || '+233 24 698 0091'}
- **Physical Address:** ${settings.addressStreet || 'Afienya-Mataheko, opposite Grace Bio'}, ${settings.addressCity || 'Greater Accra Region'}, ${settings.addressCountry || 'Ghana'}.
`;

  const contentToRender = settings.privacyPolicyContent || defaultContent;

  return (
    <>
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Privacy Policy</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Privacy Policy</span></li>
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
              <i className="fa-solid fa-shield-halved"></i> Data Protection Act 2012 (Act 843) Compliant
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
                Last reviewed &amp; confirmed: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleDateString() : 'October 2026'}
              </span>
              <Link href="/contact" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Contact Compliance Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
