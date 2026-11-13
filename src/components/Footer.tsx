import React from 'react';
import { CONTACT_EMAIL } from '../config';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="py-16 hairline">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <a href="#home" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight mb-3">
              <span className="w-2 h-2 rounded-full bg-accent" />
              melodycraft
            </a>
            <p className="text-stone-400 max-w-sm leading-relaxed">
              Custom songs, written and produced just for you. Delivered in 24 hours.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-stone-400">
            {/* min-h-6: at least 24 px tall, the WCAG 2.2 minimum touch target. */}
            <a href="#how-it-works" className="inline-flex items-center min-h-6 hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="inline-flex items-center min-h-6 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="inline-flex items-center min-h-6 hover:text-white transition-colors">FAQ</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center min-h-6 hover:text-white transition-colors">Support</a>
            <a href="/privacy" className="inline-flex items-center min-h-6 hover:text-white transition-colors">Privacy</a>
          </div>
        </div>

        {/* The page is prerendered at build time; after New Year the build year and the
            visitor's year differ until the next build, which is fine — no hydration warning. */}
        <div className="mt-12 pt-8 border-t border-white/8 text-sm text-stone-400" suppressHydrationWarning>
          © {year} MelodyCraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
