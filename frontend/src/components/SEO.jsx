import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteTitle = "Talent-BridgeX — Career Intelligence Platform";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || "A professional intelligence platform guiding the next generation of global talent from education to excellence.";
  const siteImage = image || "/og-image.jpg";
  const siteUrl = url || "https://talentbridgex.com";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
    </Helmet>
  );
};

export default SEO;
