'use client';

import { useState } from 'react';
import { Star, CalendarDays, User, MapPin, Wrench, Lightbulb, TrendingUp, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { portfolioData } from '@/data/portfolio';
import { categoryMeta } from '@/lib/categories';

type Project = (typeof portfolioData.projects)[number];

function ProjectDialog({ project }: { project: Project }) {
  const meta = categoryMeta(project.category);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Case Study
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="max-h-[70vh] pr-4">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">
                <span aria-hidden="true">{meta.icon}</span>
                {meta.label}
              </Badge>
              {project.featured && (
                <Badge className="gap-1">
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  Featured
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl md:text-2xl leading-snug">{project.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground whitespace-pre-line">
              {project.description}
            </DialogDescription>
          </DialogHeader>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">
            {project.client && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client}</p>
                </div>
              </div>
            )}
            {project.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>
            )}
            {project.role && (
              <div className="flex items-start gap-2">
                <Wrench className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                  <p className="font-medium">{project.role}</p>
                </div>
              </div>
            )}
            {project.duration && (
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                  <p className="font-medium">{project.duration}</p>
                </div>
              </div>
            )}
          </div>

          {/* Narrative */}
          <div className="mt-6 space-y-5">
            {project.challenges && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <Wrench className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  Challenges
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.challenges}</p>
              </div>
            )}
            {project.solutions && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                  Solutions
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.solutions}</p>
              </div>
            )}
            {project.results && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  Results
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.results}</p>
              </div>
            )}
          </div>

          {/* Specifications */}
          {project.specifications && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Technical Specifications</h4>
              <dl className="rounded-lg border border-border divide-y divide-border text-sm">
                {Object.entries(project.specifications as unknown as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 px-3 py-2">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="col-span-2 font-mono text-xs leading-relaxed">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full border border-border bg-background text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function Projects() {
  const [category, setCategory] = useState<string>('all');

  const published = portfolioData.projects.filter((project) => project.published);
  const categories = ['all', ...Array.from(new Set(published.map((project) => project.category)))];
  const visible =
    category === 'all' ? published : published.filter((project) => project.category === category);

  return (
    <section id="projects" className="py-20 md:py-24 bg-muted/30 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work in UHP piping, cleanrooms & engineering software"
          description="Case studies from KAUST research facilities, semiconductor tool installations, and the tools I built to design them faster."
        />

        <Tabs value={category} onValueChange={setCategory} className="mb-10">
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map((cat) => {
              const meta = cat === 'all' ? { label: 'All', icon: '🗂️' } : categoryMeta(cat);
              const count = cat === 'all' ? published.length : published.filter((p) => p.category === cat).length;
              return (
                <TabsTrigger key={cat} value={cat} className="text-xs md:text-sm gap-1.5">
                  <span aria-hidden="true">{meta.icon}</span>
                  {meta.label}
                  <span className="text-muted-foreground">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((project) => {
            const meta = categoryMeta(project.category);
            return (
              <Card key={project.id} className="project-card flex flex-col overflow-hidden">
                {/* Gradient cover */}
                <div className={`relative h-36 bg-gradient-to-br ${meta.gradient} border-b border-border flex items-center justify-center`}>
                  <span className="text-5xl drop-shadow" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <Badge variant="secondary" className="absolute top-3 left-3 backdrop-blur">
                    {meta.label}
                  </Badge>
                  {project.featured && (
                    <Badge className="absolute top-3 right-3 gap-1">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                      Featured
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <h3 className="font-semibold leading-snug text-base md:text-lg">{project.title}</h3>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.shortDesc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] rounded-full border border-border bg-background text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] text-muted-foreground">
                        +{project.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{project.duration}</span>
                  {project.slug === 'pipeforge-3d-piping-platform' ? (
                    <Button size="sm" asChild>
                      <a href={portfolioData.owner.portfolio} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Live App
                      </a>
                    </Button>
                  ) : (
                    <ProjectDialog project={project} />
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
