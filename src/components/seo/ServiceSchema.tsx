import Script from "next/script";

type FAQ = {
  question: string;
  answer: string;
};

type ServiceSchemaProps = {
  slug: string;
  serviceName: string;
  serviceType: string;
  description: string;
  title: string;
  faqs: FAQ[];
};

export default function ServiceSchema({
  slug,
  serviceName,
  serviceType,
  description,
  title,
  faqs,
}: ServiceSchemaProps) {
  const baseUrl = "https://www.buzzspiremedia.com";
  const pageUrl = `${baseUrl}/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        "name": serviceName,
        "serviceType": serviceType,
        "description": description,
        "url": pageUrl,
        "provider": {
          "@id": `${baseUrl}/#organization`
        },
        "areaServed": {
          "@type": "City",
          "name": "Delhi"
        }
      },

      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": title,
        "description": description,
        "isPartOf": {
          "@id": `${baseUrl}/#website`
        },
        "about": {
          "@id": `${pageUrl}#service`
        },
        "breadcrumb": {
          "@id": `${pageUrl}#breadcrumb`
        },
        "inLanguage": "en-US"
      },

      {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        "name": "BuzzSpire Media",
        "url": baseUrl,
        "telephone": "+919205386625",
        "email": "sales@buzzspiremedia.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress":
            "Ground Floor, Ram Dutt Enclave, B-16, Block D, Ram Datt Enclave, Uttam Nagar",
          "addressLocality": "New Delhi",
          "addressRegion": "Delhi",
          "postalCode": "110059",
          "addressCountry": "IN"
        },
        "areaServed": {
          "@type": "City",
          "name": "Delhi"
        },
        "parentOrganization": {
          "@id": `${baseUrl}/#organization`
        }
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": serviceName,
            "item": pageUrl
          }
        ]
      },

      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <Script
      id={`schema-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
