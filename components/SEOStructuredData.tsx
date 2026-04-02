import React from "react";
import { absoluteUrl, getBusinessJsonLdId } from "../lib/site";

interface SEOStructuredDataProps {
  type?: "Service" | "Organization" | "WebPage";
  name?: string;
  description?: string;
  /** Absolute URL, or use `pathname` instead */
  url?: string;
  /** Preferred: path only (e.g. `/pricing`); resolved with canonical origin */
  pathname?: string;
  image?: string;
  price?: string;
  serviceType?: string;
}

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({
  type = "Service",
  name,
  description,
  url,
  pathname,
  image,
  price,
  serviceType,
}) => {
  const pageUrl =
    pathname !== undefined ? absoluteUrl(pathname) : url;

  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      name,
      description,
      url: pageUrl,
    };

    if (type === "Service") {
      return {
        ...baseData,
        provider: {
          "@id": getBusinessJsonLdId(),
        },
        ...(serviceType ? { serviceType } : {}),
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                price,
                priceCurrency: "USD",
              },
            }
          : {}),
        ...(image ? { image } : {}),
      };
    }

    if (type === "WebPage") {
      return {
        ...baseData,
        isPartOf: {
          "@type": "WebSite",
          name: "Serene Spaces",
          url: absoluteUrl("/"),
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: absoluteUrl("/"),
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
