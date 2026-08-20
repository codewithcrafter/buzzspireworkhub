import Image from "next/image";

export function CmsImageText({ content }: { content: any }) {
  const isRight = content.imagePosition !== "left";

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className={`space-y-6 ${!isRight ? "lg:order-2" : "lg:order-1"}`}>
          {content.heading && (
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
              {content.heading}
            </h2>
          )}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.content || "" }}
          />
        </div>
        
        <div className={`relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border/50 ${!isRight ? "lg:order-1" : "lg:order-2"}`}>
          {content.imageUrl ? (
            <Image
              src={content.imageUrl}
              alt={content.heading || "Image"}
              fill
              className="object-cover"
              sizes="(max-w-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-mono text-sm">Image Placeholder</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
