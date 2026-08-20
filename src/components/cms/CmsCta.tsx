import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CmsCta({ content }: { content: any }) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
        {content.heading && (
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight leading-tight">
            {content.heading}
          </h2>
        )}
        {content.description && (
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
        )}
        {(content.buttonText && content.buttonUrl) && (
          <div className="pt-6">
            <Link href={content.buttonUrl}>
              <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-base font-bold shadow-xl hover:scale-105 transition-transform text-primary bg-white hover:bg-white/90">
                {content.buttonText} <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
