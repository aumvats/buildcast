import type { Metadata } from 'next';
import Link from 'next/link';
import { CloudSun, Hammer, Paintbrush, Home, TowerControl, Shovel, HardHat, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BuildCast — Know Before You Go | Construction Weather Intelligence',
  description:
    'Construction-grade weather intelligence for job sites. Get instant go/no-go verdicts for concrete pours, painting, roofing, crane operations, and excavation.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun size={28} className="text-primary" />
            <span className="text-xl font-bold text-text-primary">BuildCast</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary min-h-[44px] flex items-center px-3 transition-colors duration-fast"
            >
              Log In
            </Link>
            <Link
              href="/check"
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-md text-sm font-medium min-h-[44px] hover:bg-primary-hover shadow-sm hover:shadow transition-all duration-fast active:scale-[0.98]"
            >
              Check Your Job Site <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main>
      {/* Hero */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[28px] md:text-4xl font-bold text-text-primary leading-tight mb-4 animate-fade-in-up">
            Know before you go.
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            Construction-grade weather intelligence for job sites. Get instant go/no-go verdicts for concrete pours, painting, roofing, and more.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <Link
              href="/check"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md text-base font-semibold min-h-[48px] hover:bg-primary-hover shadow-sm hover:shadow-md transition-all duration-fast active:scale-[0.98]"
            >
              Check Your Job Site — Free <ArrowRight size={18} />
            </Link>
            <p className="mt-3 text-sm text-text-secondary">No signup required. Results in 15 seconds.</p>
          </div>
        </div>
      </section>

      {/* Activity Icons */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: Hammer, label: 'Concrete Pour', desc: '48h cure tracking' },
              { icon: Paintbrush, label: 'Painting', desc: 'Humidity & dry time' },
              { icon: Home, label: 'Roofing', desc: 'Wind & ice alerts' },
              { icon: TowerControl, label: 'Crane Ops', desc: 'Gust & visibility' },
              { icon: Shovel, label: 'Excavation', desc: 'Ground saturation' },
              { icon: HardHat, label: 'General', desc: 'Overall conditions' },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 bg-surface border border-border rounded-lg text-center hover:border-primary/30 hover:shadow-sm transition-all duration-normal group cursor-default"
              >
                <Icon size={28} className="text-primary group-hover:scale-110 transition-transform duration-normal" />
                <span className="text-sm font-semibold text-text-primary">{label}</span>
                <span className="text-xs text-text-secondary">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points / Personas */}
      <section className="py-16 px-4 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] font-semibold text-text-primary text-center mb-10">
            Built for crews who can&apos;t afford weather surprises
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Mike — General Contractor',
                pain: 'Lost $8,000 from a cracked driveway pour. His phone weather app said 40°F but didn\'t show the overnight freeze.',
                solution: 'BuildCast shows the full 48-hour cure window with exact freeze times.',
              },
              {
                name: 'Sandra — Painting Ops Manager',
                pain: 'Sends crews to sites that are too humid at 7am. $300 in wasted wages per idle morning, 2-3 times a month.',
                solution: 'BuildCast shows "delay start to 10:30am" with the exact humidity clearance time.',
              },
              {
                name: 'Carlos — Concrete Sub',
                pain: 'Gets pressured to pour on marginal days with no data to push back.',
                solution: 'Shares a BuildCast link showing the freeze risk. GC agrees to reschedule.',
              },
            ].map(({ name, pain, solution }) => (
              <div key={name} className="p-5 bg-bg rounded-lg hover:shadow-sm transition-shadow duration-normal">
                <h3 className="text-[15px] font-semibold text-text-primary mb-2">{name}</h3>
                <p className="text-sm text-text-secondary mb-3">{pain}</p>
                <p className="text-sm text-primary font-medium">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] font-semibold text-text-primary text-center mb-10">
            Three steps to weather confidence
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter your site address', desc: 'Auto-detects your location. Type any address or city.' },
              { step: '2', title: 'Pick your activity', desc: 'Concrete, painting, roofing, crane, excavation, or general.' },
              { step: '3', title: 'Get your verdict', desc: '7-day go/no-go calendar with exact reasons and hourly charts.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-3 shadow-sm">
                  {step}
                </div>
                <h3 className="text-[15px] font-semibold text-text-primary mb-1">{title}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-4 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Activity-specific rules', desc: 'Not just "sunny" or "rainy." Each activity has different thresholds for temperature, wind, humidity, and precipitation.' },
            { icon: Shield, title: 'Professional-grade data', desc: '7-day hourly forecasts with 48-hour cure windows, 24-hour precipitation tracking, and wind gust monitoring.' },
            { icon: CheckCircle, title: 'Share with your team', desc: 'Send a forecast link to your GC, crew lead, or client. They see the verdict without logging in.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary mb-1">{title}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[22px] font-semibold text-text-primary mb-2">Simple pricing</h2>
          <p className="text-text-secondary mb-8">Free to start. Upgrade when you need more sites.</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="p-5 bg-surface border border-border rounded-lg hover:border-primary/20 hover:shadow-sm transition-all duration-normal">
              <div className="text-lg font-bold text-text-primary">Free</div>
              <div className="text-2xl font-bold text-text-primary mt-1">$0<span className="text-sm font-normal text-text-secondary">/mo</span></div>
              <p className="text-sm text-text-secondary mt-2">1 job site, 1 activity type</p>
            </div>
            <div className="p-5 bg-surface border-2 border-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-normal">
              <div className="text-lg font-bold text-primary">Pro</div>
              <div className="text-2xl font-bold text-text-primary mt-1">$14.99<span className="text-sm font-normal text-text-secondary">/mo</span></div>
              <p className="text-sm text-text-secondary mt-2">10 sites, all 6 activities</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4 transition-colors duration-fast"
          >
            View full plan details <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[22px] font-semibold text-white mb-3">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-blue-100 mb-6">Check your job site weather in 15 seconds.</p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-md text-base font-semibold min-h-[48px] hover:bg-bg shadow-sm hover:shadow-md transition-all duration-fast active:scale-[0.98]"
          >
            Check Your Job Site <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudSun size={20} className="text-primary" />
            <span className="text-sm font-semibold text-text-primary">BuildCast</span>
          </div>
          <nav aria-label="Footer navigation" className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/check" className="hover:text-text-primary transition-colors duration-fast">Quick Check</Link>
            <Link href="/pricing" className="hover:text-text-primary transition-colors duration-fast">Pricing</Link>
            <Link href="/auth/signup" className="hover:text-text-primary transition-colors duration-fast">Sign Up</Link>
          </nav>
          <p className="text-xs text-text-secondary">Weather data from Open-Meteo.com</p>
        </div>
      </footer>
    </div>
  );
}
