import { ArrowLeft, ArrowUpRight, BadgeCheck } from 'lucide-react'
import type {
  CarPredictionRequest,
  CarPredictionResponse,
} from '../types/prediction'
import { Link } from 'react-router-dom'
import { carFeatureGroups } from '../data/carFeatures'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

interface PredictionResultProps {
  car: CarPredictionRequest
  prediction: CarPredictionResponse
  onMakeAnotherPrediction: () => void
}

function PredictionResult({
  car,
  prediction,
  onMakeAnotherPrediction,
}: PredictionResultProps) {
  const selectedFeatures = carFeatureGroups
    .flatMap((group) => group.features)
    .filter(({ field }) => car[field])

  const details = [
    { label: 'Fuel', value: car.fuel },
    { label: 'Transmission', value: car.transmission },
    { label: 'Assembly', value: car.assembly },
    { label: 'Car documents', value: car.car_documents },
    { label: 'Registration type', value: car.registration_type },
    {
      label: 'Registration location',
      value: car.registration_location_group,
    },
    { label: 'Seller city', value: car.seller_city },
    { label: 'Seller location type', value: car.seller_location_type },
  ].filter(
    (detail): detail is { label: string; value: string } =>
      detail.value !== null,
  )

  return (
    <div className="cq-dark-page min-h-screen">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        <SiteHeader />

        <main className="pb-16 pt-8 sm:pb-24 sm:pt-12">
          <div className="mx-auto max-w-5xl">
            <button
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
              onClick={onMakeAnotherPrediction}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Edit vehicle details
            </button>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <section
                aria-labelledby="prediction-result-title"
                className="flex min-h-[360px] flex-col justify-between rounded-[1.75rem] bg-ink p-7 text-paper sm:min-h-[420px] sm:p-10"
              >
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-accent">
                    <BadgeCheck aria-hidden="true" size={16} />
                    Model estimate
                  </p>
                  <h1
                    className="mt-8 max-w-lg text-3xl font-medium leading-tight tracking-[-0.05em] text-paper sm:text-5xl"
                    id="prediction-result-title"
                  >
                    Your car&apos;s estimated asking price.
                  </h1>
                </div>

                <div className="mt-12" aria-live="polite">
                  <p className="text-sm text-white/55">Estimated price</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                    <span className="text-sm font-medium uppercase tracking-[0.12em] text-accent">
                      {prediction.currency}
                    </span>
                    <span className="text-5xl font-medium tracking-[-0.06em] text-paper sm:text-7xl">
                      {new Intl.NumberFormat('en-IN', {
                        maximumFractionDigits: 0,
                      }).format(prediction.predicted_price)}
                    </span>
                  </p>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-white/60">
                    {prediction.message}
                  </p>
                </div>
              </section>

              <section
                aria-labelledby="vehicle-summary-title"
                className="rounded-[1.75rem] border border-line bg-white/70 p-6 sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Your submission
                </p>
                <h2
                  className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl"
                  id="vehicle-summary-title"
                >
                  {car.make} {car.model}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {car.year}
                  <span className="mx-2 text-line">·</span>
                  {new Intl.NumberFormat('en-IN', {
                    maximumFractionDigits: 1,
                  }).format(car.km_driven)}{' '}
                  km driven
                </p>

                {details.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-6">
                    {details.map(({ label, value }) => (
                      <div className="min-w-0" key={label}>
                        <dt className="text-xs text-muted">{label}</dt>
                        <dd className="mt-1 break-words text-sm font-medium text-ink">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-7 border-t border-line pt-6">
                  <h3 className="text-sm font-medium text-ink">
                    Car features
                  </h3>
                  {selectedFeatures.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {selectedFeatures.map(({ field, label }) => (
                        <li
                          className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-muted"
                          key={field}
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">
                      No additional features selected.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="text-sm font-medium text-ink">
                  Looking at another car?
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Start a new estimate with a different set of details.
                </p>
              </div>
              <button
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-ink shadow-[0_3px_12px_#00000038] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a5f] hover:shadow-[0_7px_18px_#00000050] active:translate-y-0 active:scale-[0.98]"
                onClick={onMakeAnotherPrediction}
                type="button"
              >
                Make another prediction
                <ArrowUpRight aria-hidden="true" size={16} />
              </button>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">
              The current estimate does not include feature-level explanations.
              <Link
                className="ml-1 font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                to="/insights"
              >
                Learn what insights are available.
              </Link>
            </p>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

export default PredictionResult
