import { CmsHero } from "./CmsHero";
import { CmsTextContent } from "./CmsTextContent";
import { CmsImageText } from "./CmsImageText";
import { CmsFaq } from "./CmsFaq";
import { CmsCta } from "./CmsCta";

const ComponentRegistry: Record<string, React.FC<{ content: any }>> = {
  Hero: CmsHero,
  TextContent: CmsTextContent,
  ImageText: CmsImageText,
  FAQ: CmsFaq,
  CTA: CmsCta,
};

export function CmsSectionRenderer({ sections }: { sections: any[] }) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  // Ensure sections are sorted by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {sortedSections.map((section, index) => {
        if (!section.isEnabled) return null;

        const Component = ComponentRegistry[section.sectionType];
        
        if (!Component) {
          console.warn(`Unknown section type: ${section.sectionType}`);
          return null;
        }

        return <Component key={section.id || index} content={section.content} />;
      })}
    </>
  );
}
