import Script from "next/script";

type FAQ = {
  question: string;
  answer: string;
};

type BlogSchemaProps = {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  authorName: string;
  authorUrl?: string;
  imageUrl: string;
  category?: string;
  faqs?: FAQ[];
};

export default function BlogSchema({
  slug,
  title,
  description,
  publishedDate,
  modifiedDate,
  authorName,
  authorUrl,
  imageUrl,
  category,
  faqs = [],
}: BlogSchemaProps) {
  const baseUrl = "https://www.buzzspiremedia.com";
  const pageUrl = `${baseUrl}/blog/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        "headline": title,
        "description": description,
        "url": pageUrl,
        "image": {
          "@type": "ImageObject",
          "url": imageUrl
        },
        "datePublished": publishedDate,
        ...(modifiedDate && {
          "dateModified": modifiedDate
        }),
        "author": {
          "@type": "Person",
          "name": authorName,
          ...(authorUrl && {
            "url": authorUrl
          })
        },
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        ...(category && {
          "articleSection": category
        }),
        "mainEntityOfPage": {
          "@id": `${pageUrl}#webpage`
        },
        "inLanguage": "en-US"
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
          "@id": `${pageUrl}#article`
        },
        "breadcrumb": {
          "@id": `${pageUrl}#breadcrumb`
        },
        "inLanguage": "en-US"
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
            "name": "Blog",
            "item": `${baseUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": pageUrl
          }
        ]
      },

      ...(faqs.length > 0
        ? [
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
        : [])
    ]
  };

  return (
    <Script
      id={`blog-schema-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
