interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
      <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full border border-primary/20">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
