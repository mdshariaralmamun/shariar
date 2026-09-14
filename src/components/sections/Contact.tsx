'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { portfolioData } from '@/data/portfolio';

export function Contact() {
  const { owner } = portfolioData;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ''}`);
    window.location.href = `mailto:${owner.email}?subject=${subject}&body=${body}`;
  };

  const contactMethods = [
    { icon: Mail, label: 'Email', value: owner.email, href: `mailto:${owner.email}` },
    { icon: Phone, label: 'Phone', value: owner.phone, href: `tel:${owner.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Location', value: owner.location },
  ];

  return (
    <section id="contact" className="py-20 md:py-24 bg-muted/30 border-t border-border/60">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk UHP piping, cleanrooms, or custom engineering tools"
          description="Open to consulting, design reviews, and project collaborations — usually replying within a day."
        />

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact info */}
          <div className="space-y-4">
            {contactMethods.map(({ icon: Icon, label, value, href }) => (
              <Card key={label}>
                <CardContent className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium truncate hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" asChild>
                <a href={owner.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={owner.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={owner.portfolio} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  PipeForge
                </a>
              </Button>
            </div>
          </div>

          {/* Message form (composes an email) */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project — gas systems scope, cleanroom class, timelines…"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Send Message
                </Button>
                <p className="text-xs text-muted-foreground">
                  This opens your email client with the message pre-filled — no data is stored or sent anywhere else.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
