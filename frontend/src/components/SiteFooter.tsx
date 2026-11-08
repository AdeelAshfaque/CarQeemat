import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'

function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            aria-label="CarQeemat home"
            className="inline-flex no-underline"
            to="/"
          >
            <BrandMark />
          </Link>
          <p className="mt-3 text-sm text-muted">Know Your Car&apos;s Worth.</p>
        </div>
        <div className="max-w-xl text-sm leading-6 text-muted lg:text-right">
          Estimates are based on historical OLX Pakistan asking prices. They are
          for guidance only and are not guaranteed final selling prices.
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:justify-between">
        <span>Pakistan · Used-car price estimates</span>
        <span>CarQeemat</span>
      </div>
    </footer>
  )
}

export default SiteFooter
