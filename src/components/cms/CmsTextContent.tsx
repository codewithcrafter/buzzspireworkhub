export function CmsTextContent({ content }: { content: any }) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 text-foreground">
            {content.heading}
          </h2>
        )}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: content.content || "" }}
        />
      </div>
    </section>
  );
}
