import React from "react";

interface SEOStructuredDataProps {
  type?: "Service" | "Organization" | "WebPage";
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  price?: string;
  serviceType?: string;
}

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({
  type = "Service",
  name,
  description,
  url,
  image,
  price,
  serviceType,
}) => {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      name: name,
      description: description,
      url: url,
    };

    if (type === "Service") {
      return {
        ...baseData,
        provider: {
          "@type": "LocalBusiness",
          name: "Serene Spaces",
          url: "https://loveserenespaces.com",
          email: "loveserenespaces@gmail.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Crystal Lake",
            addressRegion: "IL",
            postalCode: "60014",
            addressCountry: "US",
          },
        },
        serviceType: serviceType,
        offers: price
          ? {
              "@type": "Offer",
              price: price,
              priceCurrency: "USD",
            }
          : undefined,
        image: image,
      };
    }

    if (type === "WebPage") {
      return {
        ...baseData,
        isPartOf: {
          "@type": "WebSite",
          name: "Serene Spaces",
          url: "https://loveserenespaces.com",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://loveserenespaces.com",
            },
          ],
        },
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  );
};

export default SEOStructuredData;
