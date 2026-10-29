import type { SiteSettings } from '@/db/schema';

interface TopBarProps {
  siteSettings?: SiteSettings;
}

export default function TopBar({ siteSettings }: TopBarProps) {
  const email = siteSettings?.contactEmail || 'info@aercghana.net';
  const location = `${siteSettings?.addressCity || 'Greater Accra Region'}, ${siteSettings?.addressCountry || 'Ghana'}`;

  const twitter = siteSettings?.socialTwitter || 'https://x.com/aercgh';
  const linkedin = siteSettings?.socialLinkedin || 'https://www.linkedin.com/company/alliance-for-empowering-rural-communities';
  const instagram = siteSettings?.socialInstagram || 'https://www.instagram.com/ghanaaerc/';
  const facebook = siteSettings?.socialFacebook || 'https://www.facebook.com/aercgh';
  const youtube = siteSettings?.socialYoutube || 'https://www.youtube.com/@aercghana3755';
  const whatsappChannel = siteSettings?.socialWhatsappChannel;

  return (
    <div className="site-top-bar">
      <div className="container site-top-bar-row">
        <div className="top-bar-left">
          <div className="top-bar-item">
            <i className="fa-regular fa-paper-plane"></i>
            <span>{email}</span>
          </div>
          <div className="top-bar-item">
            <i className="fa-solid fa-location-dot"></i>
            <span>{location}</span>
          </div>
        </div>

        <div className="top-bar-right">
          <span style={{ fontSize: '0.78rem', marginRight: '6px', opacity: 0.7 }}>Follow our grassroots movement:</span>
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          )}
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          )}
          {whatsappChannel && (
            <a href={whatsappChannel} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
