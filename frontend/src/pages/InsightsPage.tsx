import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  BarChart3,
  CarFront,
  CircleDashed,
  LineChart,
  Sparkles,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'

const futureAnalytics = [
  {
    title: 'Popular manufacturers',
    description:
      'Manufacturer rankings will be shown when a real market analytics source is available.',
    icon: CarFront,
  },
  {
    title: 'Price distribution',
    description:
      'Price ranges will be based on verified listing data, not illustrative figures.',
    icon: BarChart3,
  },
  {
    title: 'Market trends',
    description:
      'Time-based insights will appear when historical market data is available.',
    icon: LineChart,
  },
]

function InsightsPage() {
  return (
    <div className="cq-dark-page cq-insights-page min-h-screen">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        <SiteHeader />

        <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Transparency &amp; market context
            </p>
            <h1 className="text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-6xl">
              Insights, when the data is ready.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Explanations and market analytics belong in CarQeemat. They will
              appear here once the backend provides real data for them.
            </p>
          </div>

          <section
            aria-labelledby="explainability-title"
            className="mt-12 grid gap-8 rounded-2xl bg-ink p-6 text-paper sm:mt-16 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16"
            id="explainability"
          >
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                <Sparkles aria-hidden="true" size={15} />
                Model explainability
              </p>
              <h2
                className="mt-4 text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl"
                id="explainability-title"
              >
                Understand what shapes an estimate.
              </h2>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-paper">
                  Feature-level explanation
                </p>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/65">
                  <CircleDashed aria-hidden="true" size={14} />
                  Not available yet
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/60">
                The current prediction endpoint returns a price estimate only;
                it does not return SHAP values or feature contributions. This
                section will connect to an explainability endpoint when one is
                available. No explanations are shown until then.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="market-analytics-title"
            className="mt-16 sm:mt-24"
            id="market-analytics"
          >
            <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Market analytics
                </p>
                <h2
                  className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl"
                  id="market-analytics-title"
                >
                  A clearer view of the market.
                </h2>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-muted">
                <CircleDashed aria-hidden="true" size={14} />
                Analytics endpoint unavailable
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {futureAnalytics.map(({ title, description, icon: Icon }) => (
                <article
                  className="flex min-h-56 flex-col rounded-2xl border border-line bg-white/60 p-6"
                  key={title}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-full bg-paper text-muted">
                      <Icon aria-hidden="true" size={18} strokeWidth={1.6} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
                      Unavailable
                    </span>
                  </div>
                  <h3 className="mt-7 text-lg font-medium tracking-[-0.025em]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 flex flex-col gap-5 rounded-2xl border border-line px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-sm font-medium text-ink">
                Need a car price estimate?
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                The prediction endpoint is available for individual vehicles.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-ink no-underline shadow-[0_3px_12px_#00000038] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a5f] hover:shadow-[0_7px_18px_#00000050] active:translate-y-0 active:scale-[0.98]"
              to="/estimate"
            >
              Estimate your car
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

export default InsightsPage
