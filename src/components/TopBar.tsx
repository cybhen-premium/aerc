export default function TopBar() {
  return (
    <div className="site-top-bar">
      <div className="container site-top-bar-row">
        <div className="top-bar-left">
          <div className="top-bar-item">
            <i className="fa-regular fa-paper-plane"></i>
            <span>info@aercghana.net</span>
          </div>
          <div className="top-bar-item">
            <i className="fa-solid fa-location-dot"></i>
            <span>Greater Accra Region, Ghana</span>
          </div>
        </div>

        <div className="top-bar-right">
          <span style={{ fontSize: '0.78rem', marginRight: '6px', opacity: 0.7 }}>Follow our grassroots movement:</span>
          <a href="https://x.com/aercgh" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/company/alliance-for-empowering-rural-communities" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://www.instagram.com/ghanaaerc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/aercgh" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="https://www.youtube.com/@aercghana3755" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
