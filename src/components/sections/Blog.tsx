import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { portfolioData } from '@/data/portfolio';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function coverIcon(tags: string[]): string {
  const joined = tags.join(' ').toLowerCase();
  if (joined.includes('weld')) return '🔥';
  if (joined.includes('cleanroom') || joined.includes('semiconductor')) return '🏥';
  if (joined.includes('pipeforge') || joined.includes('three') || joined.includes('cad')) return '💻';
  return '📄';
}

export function Blog() {
  const posts = portfolioData.blogPosts.filter((post) => post.published);

  return (
    <section id="blog" className="py-20 md:py-24 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="Blog"
          title="Technical writing on welding, cleanrooms & building for the web"
          description="Deep dives from the field — orbital welding parameters, cleanroom classification, and lessons from shipping a browser-based CAD tool."
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="project-card flex flex-col overflow-hidden">
              <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 border-b border-border flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">
                  {coverIcon(post.tags)}
                </span>
                {post.featured && (
                  <Badge className="absolute top-3 right-3">Featured</Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-semibold leading-snug">{post.title}</h3>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-border bg-background text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                <Badge variant="outline" className="gap-1 font-normal">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  Full article coming soon
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
