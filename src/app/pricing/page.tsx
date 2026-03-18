import type { Metadata } from 'next';
import Link from 'next/link';
import { CloudSun, Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — BuildCast',
  description:
    'Simple, transparent pricing. Free to start, upgrade when you need more job sites. Professional construction weather intelligence from $14.99/mo.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'For solo contractors testing on their current job.',
    features: [
      '1 job site',
      '1 activity type per site',
      '7-day forecast with daily verdicts',
      'Hourly detail view',
      'Share link (with BuildCast branding)',
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/mo',
    description: 'For contractors managing multiple active jobs.',
    features: [
      'Up to 10 job sites',
      'All 6 activity types per site',
      '7-day forecast with hourly verdicts',
      'Share links (clean, no branding)',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    href: '/auth/signup',
    highlighted: true,
    annual: '$12.49/mo billed annually',
  },
  {
    name: 'Business',
    price: '$39',
    period: '/mo',
    description: 'For operations managers with multiple crews.',
    features: [
      'Unlimited job sites',
      'Everything in Pro',
      'Team members (up to 10)',
      'Crew scheduling view',
      'CSV export of forecast data',
      'Priority data refresh (1h)',
    ],
    cta: 'Coming Soon',
    href: '#',
    highlighted: false,
    comingSoon: true,
    annual: '$32.50/mo billed annually',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity duration-fast hover:opacity-80">
            <CloudSun size={28} className="text-primary" />
            <span className="text-xl font-bold text-text-primary">BuildCast</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary min-h-[44px] flex items-center px-3 transition-colors duration-fast"
            >
              Log In
            </Link>
            <Link
              href="/check"
              className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2.5 rounded-md text-sm font-medium min-h-[44px] hover:bg-primary-hover shadow-sm hover:shadow transition-all duration-fast active:scale-[0.98]"
            >
              Try Free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-bold text-text-primary mb-2">
            Simple, transparent pricing
          </h1>
          <p className="text-text-secondary">
            Free to start. Upgrade when you need more sites. Save 2 months with annual billing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-surface rounded-lg p-6 flex flex-col transition-all duration-normal hover:shadow-md ${
                plan.highlighted
                  ? 'border-2 border-primary ring-1 ring-primary/10 shadow-sm'
                  : 'border border-border hover:border-primary/20'
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 self-start">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-bold text-text-primary">{plan.name}</h2>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-sm text-text-secondary">{plan.period}</span>
              </div>
              {plan.annual && (
                <p className="text-xs text-text-secondary mb-3">{plan.annual}</p>
              )}
              <p className="text-sm text-text-secondary mb-4">{plan.description}</p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-primary">
                    <Check size={16} className="text-success shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.comingSoon ? (
                <div className="text-center py-2.5 px-4 bg-bg text-text-secondary text-sm font-medium rounded-md min-h-[44px] flex items-center justify-center">
                  Coming Soon
                </div>
              ) : (
                <Link
                  href={plan.href}
                  className={`text-center py-2.5 px-4 rounded-md text-sm font-medium min-h-[44px] flex items-center justify-center transition-all duration-fast active:scale-[0.98] ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow'
                      : 'bg-surface text-text-primary border border-border hover:bg-bg'
                  }`}
                >
                  {plan.cta} {!plan.comingSoon && <ArrowRight size={14} className="ml-1" />}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-secondary">
            All plans include 7-day hourly forecasts, activity-specific verdicts, and shareable links.
          </p>
        </div>
      </main>
    </div>
  );
}
