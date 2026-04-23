// [server-serialization] Footer has no interactivity — removed "use client" to make
// it a React Server Component. This avoids shipping this component's JS to the browser.
import Link from "next/link";
import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <h3 className="text-xl font-black tracking-widest text-foreground uppercase">
              OKOJIN.LOG
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              개발에 대한 열정과 배움을 공유하는 공간입니다. 새로운 기술과 경험을 기록하고 나눕니다.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              NAVIGATION
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/articles" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest">
                ARTICLES
              </Link>
              <Link href="/algorithm" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest">
                ALGORITHMS
              </Link>
              <Link href="/about" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest">
                ABOUT
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              CONTACT
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/Jinoko01"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:dswvgw1234@gmail.com"
                className="p-2 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            © {new Date().getFullYear()} OKOJIN.LOG — BUILT WITH REACT & TYPESCRIPT
          </p>
        </div>
      </div>
    </footer>
  );
}
