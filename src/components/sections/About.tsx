import { GraduationCap, Award, Mail, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { portfolioData } from '@/data/portfolio';

export function About() {
  const { owner, siteSettings, education, certifications } = portfolioData;
  const paragraphs = siteSettings.aboutText.split('\n\n').filter(Boolean);

  return (
    <section id="about" className="py-20 md:py-24 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="UHP systems specialist, from BIM model to first weld"
          description={owner.title}
        />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-5">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed md:text-lg">
                {paragraph}
              </p>
            ))}

            <div className="pt-4">
              <p className="text-xl font-semibold gradient-text">{owner.name}</p>
              <p className="text-sm text-muted-foreground">{owner.title}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['UHP Gas Distribution', 'Orbital Welding QA/QC', 'Cleanroom Utilities', 'BIM / Revit MEP', 'Procore Governance'].map(
                (tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Profile card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  MS
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg leading-tight">{owner.name}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {owner.location}
                </p>
                <a
                  href={`mailto:${owner.email}`}
                  className="text-xs text-primary hover:underline flex items-center gap-1.5 mt-1"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {owner.email}
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Education */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                  Education
                </h3>
                <ul className="space-y-4">
                  {education.map((edu) => (
                    <li key={edu.id} className="text-sm">
                      <p className="font-medium leading-snug">{edu.degree}</p>
                      <p className="text-muted-foreground">
                        {edu.institution}
                        {edu.location ? ` · ${edu.location}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {edu.startDate} – {edu.endDate}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                  Certifications
                </h3>
                <ul className="space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="text-sm">
                      <p className="font-medium leading-snug">{cert.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {cert.issuer} · {cert.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
