import Image from "next/image";
import { Github, Mail, Link as LinkIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center text-foreground mb-16 uppercase">
        ABOUT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-12 md:gap-16">
        {/* Profile Card (Left) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="w-48 md:w-full aspect-square rounded-3xl bg-secondary/50 border border-border overflow-hidden shadow-sm relative">
            <Image 
              src="/about-profile.png" 
              alt="Profile" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 192px, (max-width: 1200px) 320px, 320px"
              priority
            />
          </div>
          
          <div className="w-full">
            <h2 className="text-3xl font-black text-foreground uppercase">
              OKOJIN
            </h2>
            <p className="text-primary font-bold tracking-widest uppercase text-xs mt-2">
              Frontend Developer
            </p>
            
            <div className="mt-8 space-y-4 font-semibold text-sm text-muted-foreground">
              <a href="mailto:dswvgw1234@gmail.com" className="flex items-center gap-3 hover:text-foreground transition-colors group">
                <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> dswvgw1234@gmail.com
              </a>
              <a href="https://github.com/Jinoko01" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-foreground transition-colors group">
                <Github className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> @Jinoko01
              </a>
            </div>
          </div>
        </div>

        {/* Details Area (Right) */}
        <div className="space-y-12">
          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 border-b border-border/50 pb-3">
              Introduction
            </h3>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground font-medium leading-relaxed">
              <p className="text-lg font-bold leading-relaxed mb-4 text-card-foreground">
                Hello! I&apos;m a frontend developer passionate about creating beautiful, functional, and user-centric interfaces.
              </p>
              <p className="text-muted-foreground">
                I specialize in building fast, accessible web applications using modern technologies. 
                I focus on delivering great user experiences through careful attention to detail in both code architecture and visual design. Everything from robust system design to the smallest micro-interaction matters.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 border-b border-border/50 pb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Figma', 'Supabase', 'Framer Motion'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-secondary/80 text-secondary-foreground rounded-md border border-border"
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

