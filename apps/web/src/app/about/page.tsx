import { Github, Mail, MapPin, Link as LinkIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center text-[color:var(--color-foreground)] mb-16 uppercase">
        ABOUT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-12 md:gap-16">
        {/* Profile Card (Left) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="w-48 h-48 md:w-full md:aspect-square rounded-3xl bg-[color:var(--color-secondary)]/50 border border-[color:var(--color-border)] overflow-hidden shadow-sm relative">
            {/* Image Placeholder */}
            <div className="absolute inset-0 bg-linear-to-tr from-[color:var(--color-primary)]/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-[color:var(--color-muted-foreground)]">
              <span className="text-xs font-bold tracking-widest uppercase">Photo</span>
            </div>
          </div>
          
          <div className="w-full">
            <h2 className="text-3xl font-black text-[color:var(--color-foreground)] uppercase">
              OKOJIN
            </h2>
            <p className="text-[color:var(--color-primary)] font-bold tracking-widest uppercase text-xs mt-2">
              Frontend Developer
            </p>
            
            <div className="mt-8 space-y-4 font-semibold text-sm text-[color:var(--color-muted-foreground)]">
              <span className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" /> Seoul, South Korea
              </span>
              <a href="mailto:contact@example.com" className="flex items-center gap-3 hover:text-[color:var(--color-foreground)] transition-colors group">
                <Mail className="w-4 h-4 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" /> contact@example.com
              </a>
              <a href="https://github.com/Jinoko01" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[color:var(--color-foreground)] transition-colors group">
                <Github className="w-4 h-4 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" /> @Jinoko01
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-[color:var(--color-foreground)] transition-colors group">
                <LinkIcon className="w-4 h-4 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" /> devblog.okojin.dev
              </a>
            </div>
          </div>
        </div>

        {/* Details Area (Right) */}
        <div className="space-y-12">
          <section>
            <h3 className="text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase mb-6 border-b border-[color:var(--color-border)]/50 pb-3">
              Introduction
            </h3>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-[color:var(--color-foreground)] font-medium leading-relaxed">
              <p className="text-lg font-bold leading-relaxed mb-4 text-[color:var(--color-card-foreground)]">
                Hello! I'm a frontend developer passionate about creating beautiful, functional, and user-centric interfaces.
              </p>
              <p className="text-[color:var(--color-muted-foreground)]">
                I specialize in building fast, accessible web applications using modern technologies. 
                I focus on delivering great user experiences through careful attention to detail in both code architecture and visual design. Everything from robust system design to the smallest micro-interaction matters.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase mb-6 border-b border-[color:var(--color-border)]/50 pb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Figma', 'Supabase', 'Framer Motion'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[color:var(--color-secondary)]/80 text-[color:var(--color-secondary-foreground)] rounded-md border border-[color:var(--color-border)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

