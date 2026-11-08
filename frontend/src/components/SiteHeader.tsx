import { ArrowUpRight, LineChart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import BrandMark from './BrandMark'

function SiteHeader() {
  const { pathname } = useLocation()
  const isLandingPage = pathname === '/'

  return (
    <header className="cq-shared-header flex min-h-[76px] items-center justify-between py-4">
      <Link aria-label="CarQeemat home" className="no-underline" to="/">
        <BrandMark />
      </Link>

      <nav
        aria-label="Main navigation"
        className="flex items-center gap-3 md:gap-8"
      >
        {isLandingPage ? (
          <>
            <a
              className="hidden text-xs font-bold tracking-wide text-[#392216] transition-colors hover:text-black md:inline-flex"
              href="#how-it-works"
            >
              How it works
            </a>
            <a
              className="hidden text-xs font-bold tracking-wide text-[#392216] transition-colors hover:text-black md:inline-flex"
              href="#our-approach"
            >
              Our approach
            </a>
          </>
        ) : (
          <Link
            className="hidden text-xs font-bold tracking-wide text-[#392216] transition-colors hover:text-black md:inline-flex"
            to="/"
          >
            Home
          </Link>
        )}
        <Link
          aria-label="Market insights"
          aria-current={pathname === '/insights' ? 'page' : undefined}
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#392216] no-underline transition-colors hover:text-black"
          to="/insights"
        >
          <LineChart aria-hidden="true" className="sm:hidden" size={18} />
          <span className="hidden sm:inline">Insights</span>
        </Link>
      </nav>

      <Link
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-3 py-2.5 text-xs font-semibold text-paper no-underline shadow-[0_3px_12px_#ef6b3233] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292b29] hover:shadow-[0_7px_18px_#ef6b3266] active:translate-y-0 active:scale-[0.98] sm:px-5 sm:py-3"
        to="/estimate"
      >
        <span className="sm:hidden">Estimate</span>
        <span className="hidden sm:inline">Estimate your car</span>
        <ArrowUpRight
          aria-hidden="true"
          className="hidden sm:block"
          size={16}
        />
      </Link>
    </header>
  )
}

export default SiteHeader
