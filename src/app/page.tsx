import { Search, Sparkles } from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayInput } from '@/components/clay/ClayInput';
import { SampleJobCard } from '@/components/jobs/SampleJobCard';
import { FilterChipStrip } from '@/components/home/FilterChipStrip';
import { SAMPLE_JOBS } from '@/features/jobs/sample-data';

/**
 * Phase 0 foundation preview. Everything here is intentionally static and
 * uses fictional data — the goal is to validate the design system and shell
 * before any real job engine is built. Do not read this page as a spec for
 * the real Home feature that ships in Phase 5.
 */
export default function HomePage() {
  return (
    <div className="space-y-6 px-4 pt-2 safe-top">
      {/* Brand + greeting */}
      <header className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-deep">
          MyNextJob
        </p>
        <h1 className="text-[26px] font-semibold leading-tight text-foreground">
          Good morning, Kiran.
        </h1>
        <p className="text-[15px] text-secondary">Your next job could be here.</p>
      </header>

      {/* Freshness stat */}
      <ClayCard depth="raised" radius="xl" padding="lg" className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-clay-lg bg-primary text-primary-foreground shadow-clay-raised">
          <Sparkles size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-foreground">12 new opportunities</p>
          <p className="text-sm text-secondary">Freshly discovered in the last hour.</p>
        </div>
      </ClayCard>

      {/* Search */}
      <ClayInput
        leading={<Search size={18} aria-hidden="true" />}
        placeholder="Search roles, companies, skills…"
        aria-label="Search jobs"
      />

      {/* Filters */}
      <FilterChipStrip />

      {/* Sample job cards */}
      <section aria-label="Sample job matches" className="space-y-4">
        {SAMPLE_JOBS.map((job) => (
          <SampleJobCard key={job.id} job={job} />
        ))}
      </section>

      <p className="pt-2 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        Sample data · Phase 0 foundation preview
      </p>
    </div>
  );
}
