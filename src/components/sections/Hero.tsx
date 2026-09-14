'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/data/portfolio';

const Scene3D = dynamic(
  () => import('@/components/three/Scene3D').then((m) => m.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] lg:h-[500px] rounded-lg bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden="true" />
          <p className="text-sm">Loading 3D gas distribution scene…</p>
        </div>
      </div>
    ),
  }
);

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Semiconductor Tools Installed' },
  { value: '$150k', label: 'Max Material Asset Scope' },
  { value: '60%', label: 'Design Time Reduction' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const { owner, siteSettings } = portfolioData;

  return (
    <section id="home" className="relative overflow-hidden hero-bg pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text column */}
        <motion.div
          className="flex flex-col items-start gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-medium text-primary">Available for new projects</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="text-sm md:text-base font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {owner.name} · {owner.location}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
              Engineering Precision in{' '}
              <span className="gradient-text">Ultra-High Purity</span>
            </h1>
          </motion.div>

          <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            {siteSettings.heroSubtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">Get in Touch</Link>
            </Button>
            <div className="flex items-center gap-1 ml-2">
              <Button variant="ghost" size="icon" asChild>
                <a href={owner.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={owner.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${owner.email}`} aria-label="Send email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
            {owner.title}
          </motion.p>
        </motion.div>

        {/* 3D scene column */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/20 rounded-2xl blur-2xl" aria-hidden="true" />
          <div className="relative rounded-lg border border-border overflow-hidden">
            <Scene3D type="gas-piping" className="h-[400px] lg:h-[500px]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pointer-events-none">
              <p className="text-xs text-white/80 font-mono">
                UHP gas distribution — interactive scene (drag to orbit, hover pipes for specs)
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="container mt-16 md:mt-20">
        <motion.dl
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-6 text-center"
            >
              <dt className="order-2 text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</dt>
              <dd className="order-1 text-3xl md:text-4xl font-bold gradient-text">{stat.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
