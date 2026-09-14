import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioData } from '@/data/portfolio';

const CATEGORY_LABELS: Record<string, string> = {
  'gas-piping': 'Gas Piping & Welding',
  cleanroom: 'Cleanroom Systems',
  equipment: 'Equipment & Materials',
  software: 'Software & BIM',
  management: 'Management & QA/QC',
};

const CATEGORY_ORDER = ['gas-piping', 'software', 'equipment', 'cleanroom', 'management'];

function LevelDots({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Proficiency ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < level ? 'bg-primary' : 'bg-muted-foreground/25'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function Skills() {
  const { skills } = portfolioData;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section id="skills" className="py-20 md:py-24 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title="Technical toolkit built on the tools of the trade"
          description="Hands-on proficiency across welding, materials, BIM software, and project governance — rated by depth of field experience."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grouped.map((group) => (
            <Card key={group.category} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{group.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm min-w-0">
                      <span aria-hidden="true">{skill.icon}</span>
                      <span className="truncate">{skill.name}</span>
                    </span>
                    <LevelDots level={skill.level} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
