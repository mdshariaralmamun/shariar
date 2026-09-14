import { Briefcase, CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { portfolioData } from '@/data/portfolio';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  if (!month) return year;
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

function formatRange(start: string, end?: string, current?: boolean): string {
  return `${formatMonth(start)} — ${current ? 'Present' : end ? formatMonth(end) : ''}`;
}

export function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-20 md:py-24 bg-muted/30 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title="15+ years across research facilities & semiconductor cleanrooms"
          description="From field plumbing draftsman to piping design lead — a career built inside world-class laboratory environments."
        />

        <ol className="relative max-w-3xl mx-auto border-l border-border space-y-12 pl-8 md:pl-10">
          {experience.map((job) => (
            <li key={job.id} className="relative">
              {/* Timeline dot */}
              <span
                className="absolute -left-[41px] md:-left-[49px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary"
                aria-hidden="true"
              />
              {job.current && (
                <span className="absolute -left-[41px] md:-left-[49px] top-1.5 h-4 w-4 rounded-full bg-primary animate-ping opacity-40" aria-hidden="true" />
              )}

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold leading-snug">{job.title}</h3>
                  <p className="mt-1 font-medium text-primary flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                    {job.company}
                    <span className="text-muted-foreground font-normal flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {job.location}
                    </span>
                  </p>
                </div>
                <Badge variant={job.current ? 'default' : 'secondary'} className="whitespace-nowrap">
                  <CalendarDays className="mr-1.5 h-3 w-3" aria-hidden="true" />
                  {formatRange(job.startDate, job.endDate, job.current)}
                </Badge>
              </div>

              <p className="mt-3 text-muted-foreground leading-relaxed text-sm md:text-base">
                {job.description}
              </p>

              <ul className="mt-4 space-y-2">
                {job.achievements.map((achievement, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5" aria-hidden="true">▸</span>
                    {achievement}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-full border border-border bg-background text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
