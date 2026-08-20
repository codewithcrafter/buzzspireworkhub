import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CmsHero({ content }: { content: any }) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background border-b border-border/40">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight text-foreground leading-[1.1]">
          {content.heading}
        </h1>
        {content.description && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
        )}
        {(content.buttonText && content.buttonUrl) && (
          <div className="flex justify-center pt-4">
            <Link href={content.buttonUrl}>
              <Button size="lg" variant="premium" className="rounded-full shadow-lg h-14 px-8 text-base font-bold">
                {content.buttonText} <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
