import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  Info,
  LoaderCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField'
import PredictionResult from '../components/PredictionResult'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import { carFeatureGroups } from '../data/carFeatures'
import { vehicleSuggestions } from '../data/vehicleSuggestions'
import { predictCarPrice, PredictionApiError } from '../services/predictionApi'
import type {
  CarFormValues,
  CarPredictionRequest,
  CarPredictionResponse,
} from '../types/prediction'
import './EstimatePage.css'

const initialFormValues: CarFormValues = {
  make: '',
  model: '',
  fuel: null,
  car_documents: null,
  assembly: null,
  transmission: null,
  registration_type: null,
  registration_location_group: null,
  seller_city: null,
  seller_location_type: null,
  year: '',
  km_driven: '',
  abs: false,
  am_fm_radio: false,
  air_bags: false,
  air_conditioning: false,
  alloy_rims: false,
  cd_player: false,
  cassette_player: false,
  climate_control: false,
  cool_box: false,
  cruise_control: false,
  dvd_player: false,
  front_camera: false,
  front_speakers: false,
  heated_seats: false,
  immobilizer_key: false,
  keyless_entry: false,
  navigation_system: false,
  power_locks: false,
  power_mirrors: false,
  power_steering: false,
  power_windows: false,
  rear_ac_vents: false,
  rear_camera: false,
  rear_seat_entertainment: false,
  rear_speakers: false,
  steering_switches: false,
  sun_roof: false,
  usb_and_auxillary_cable: false,
}

function EstimatePage() {
  const [values, setValues] = useState(initialFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<CarPredictionResponse | null>(null)
  const [submittedCar, setSubmittedCar] =
    useState<CarPredictionRequest | null>(null)

  function updateField<Field extends keyof CarFormValues>(
    field: Field,
    value: CarFormValues[Field],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    setApiError(null)
    setPrediction(null)
    setSubmittedCar(null)
  }

  function toPredictionRequest(): CarPredictionRequest {
    return {
      ...values,
      year: Number(values.year),
      km_driven: Number(values.km_driven),
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setApiError(null)
    setPrediction(null)
    setSubmittedCar(null)
    setIsSubmitting(true)

    const request = toPredictionRequest()
    try {
      const result = await predictCarPrice(request)
      setPrediction(result)
      setSubmittedCar(request)
    } catch (error) {
      if (error instanceof PredictionApiError) {
        setApiError(error.message)
      } else {
        console.error('Unexpected error while requesting a car estimate.', error)
        setApiError('We could not complete the estimate. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function makeAnotherPrediction() {
    setPrediction(null)
    setSubmittedCar(null)
    setApiError(null)
  }

  if (prediction && submittedCar) {
    return (
      <PredictionResult
        car={submittedCar}
        onMakeAnotherPrediction={makeAnotherPrediction}
        prediction={prediction}
      />
    )
  }

  return (
    <div className="cq-dark-page min-h-screen">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        <SiteHeader />

        <main className="pb-16 pt-8 sm:pb-24 sm:pt-12">
          <Link
            className="inline-flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-ink"
            to="/"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to home
          </Link>

          <div className="mt-8 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Your vehicle
            </p>
            <h1 className="text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-6xl">
              Tell us about your car.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">
              Add the details you know. Suggestions come from categories
              represented in the trained model; you can also enter another
              value.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
            <form
              aria-busy={isSubmitting}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <fieldset
                className="space-y-6 border-0 p-0"
                disabled={isSubmitting}
              >
              <section
                aria-labelledby="basic-info-title"
                className="rounded-2xl border border-line bg-white/70 p-5 sm:p-8"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    01 · Required
                  </p>
                  <h2
                    className="mt-2 text-xl font-semibold tracking-[-0.035em]"
                    id="basic-info-title"
                  >
                    Basic information
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="make"
                    label="Make"
                    onChange={(value) => updateField('make', value)}
                    placeholder="e.g. Honda"
                    required
                    suggestions={vehicleSuggestions.make}
                    value={values.make}
                  />
                  <FormField
                    id="model"
                    label="Model"
                    onChange={(value) => updateField('model', value)}
                    placeholder="e.g. Civic Oriel"
                    required
                    suggestions={vehicleSuggestions.model}
                    value={values.model}
                  />
                  <FormField
                    id="year"
                    label="Manufacturing year"
                    min={1}
                    onChange={(value) => updateField('year', value)}
                    placeholder="e.g. 2018"
                    required
                    step={1}
                    type="number"
                    value={values.year}
                  />
                  <FormField
                    id="km_driven"
                    label="Kilometers driven"
                    min={0}
                    onChange={(value) => updateField('km_driven', value)}
                    placeholder="e.g. 72000"
                    required
                    step="any"
                    type="number"
                    value={values.km_driven}
                  />
                </div>
              </section>

              <section
                aria-labelledby="specifications-title"
                className="rounded-2xl border border-line bg-white/70 p-5 sm:p-8"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    02 · Vehicle
                  </p>
                  <h2
                    className="mt-2 text-xl font-semibold tracking-[-0.035em]"
                    id="specifications-title"
                  >
                    Vehicle specifications
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Optional details. Choose a suggestion or type the value that
                    matches your car.
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="fuel"
                    label="Fuel"
                    onChange={(value) =>
                      updateField('fuel', value === '' ? null : value)
                    }
                    placeholder="Select or type fuel"
                    suggestions={vehicleSuggestions.fuel}
                    value={values.fuel ?? ''}
                  />
                  <FormField
                    id="transmission"
                    label="Transmission"
                    onChange={(value) =>
                      updateField('transmission', value === '' ? null : value)
                    }
                    placeholder="Select or type transmission"
                    suggestions={vehicleSuggestions.transmission}
                    value={values.transmission ?? ''}
                  />
                  <FormField
                    id="assembly"
                    label="Assembly"
                    onChange={(value) =>
                      updateField('assembly', value === '' ? null : value)
                    }
                    placeholder="Select or type assembly"
                    suggestions={vehicleSuggestions.assembly}
                    value={values.assembly ?? ''}
                  />
                  <FormField
                    id="car_documents"
                    label="Car documents"
                    onChange={(value) =>
                      updateField('car_documents', value === '' ? null : value)
                    }
                    placeholder="Select or type document status"
                    suggestions={vehicleSuggestions.car_documents}
                    value={values.car_documents ?? ''}
                  />
                </div>
              </section>

              <section
                aria-labelledby="registration-title"
                className="rounded-2xl border border-line bg-white/70 p-5 sm:p-8"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    03 · Registration
                  </p>
                  <h2
                    className="mt-2 text-xl font-semibold tracking-[-0.035em]"
                    id="registration-title"
                  >
                    Registration information
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="registration_type"
                    label="Registration type"
                    onChange={(value) =>
                      updateField('registration_type', value === '' ? null : value)
                    }
                    placeholder="Select or type registration type"
                    suggestions={vehicleSuggestions.registration_type}
                    value={values.registration_type ?? ''}
                  />
                  <FormField
                    id="registration_location_group"
                    label="Registration location group"
                    onChange={(value) =>
                      updateField(
                        'registration_location_group',
                        value === '' ? null : value,
                      )
                    }
                    placeholder="Select or type location"
                    suggestions={vehicleSuggestions.registration_location_group}
                    value={values.registration_location_group ?? ''}
                  />
                </div>
              </section>

              <section
                aria-labelledby="seller-title"
                className="rounded-2xl border border-line bg-white/70 p-5 sm:p-8"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    04 · Seller
                  </p>
                  <h2
                    className="mt-2 text-xl font-semibold tracking-[-0.035em]"
                    id="seller-title"
                  >
                    Seller information
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="seller_city"
                    label="Seller city"
                    onChange={(value) =>
                      updateField('seller_city', value === '' ? null : value)
                    }
                    placeholder="Select or type city"
                    suggestions={vehicleSuggestions.seller_city}
                    value={values.seller_city ?? ''}
                  />
                  <FormField
                    id="seller_location_type"
                    label="Seller location type"
                    onChange={(value) =>
                      updateField(
                        'seller_location_type',
                        value === '' ? null : value,
                      )
                    }
                    placeholder="Select or type location type"
                    suggestions={vehicleSuggestions.seller_location_type}
                    value={values.seller_location_type ?? ''}
                  />
                </div>
              </section>

              <details className="group rounded-2xl border border-line bg-white/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-8">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                      05 · Optional
                    </span>
                    <span className="mt-2 block text-xl font-semibold tracking-[-0.035em]">
                      Car features
                    </span>
                    <span className="mt-2 block text-sm text-muted">
                      Select the features included in your car.
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-xs text-muted">
                    28 features
                    <ChevronDown
                      aria-hidden="true"
                      className="transition-transform group-open:rotate-180"
                      size={18}
                    />
                  </span>
                </summary>
                <div className="space-y-7 border-t border-line px-5 py-6 sm:px-8">
                  {carFeatureGroups.map((group) => (
                    <fieldset className="border-0 p-0" key={group.title}>
                      <legend className="mb-3 text-sm font-medium text-ink">
                        {group.title}
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {group.features.map(({ field, label }) => (
                          <label
                            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-line px-3 text-sm text-ink transition-colors hover:border-accent/60"
                            key={field}
                          >
                            <input
                              checked={values[field]}
                              className="size-4 accent-accent"
                              name={field}
                              onChange={(event) =>
                                updateField(field, event.target.checked)
                              }
                              type="checkbox"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </details>

              </fieldset>

              {apiError && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-900"
                  role="alert"
                >
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    size={18}
                  />
                  <p>{apiError}</p>
                </div>
              )}

              {isSubmitting && (
                <p
                  className="flex items-center gap-2 text-sm text-muted"
                  role="status"
                >
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={17}
                  />
                  Requesting an estimate from the CarQeemat model…
                </p>
              )}

              {prediction && (
                <section
                  aria-labelledby="estimate-result-title"
                  className="rounded-2xl border border-line bg-white/80 p-6 sm:p-8"
                  role="status"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    <BadgeCheck aria-hidden="true" size={16} />
                    Live model response
                  </div>
                  <h2
                    className="mt-4 text-lg font-medium text-muted"
                    id="estimate-result-title"
                  >
                    Estimated asking price
                  </h2>
                  <p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                    <span className="mr-2 text-base font-medium tracking-normal text-muted">
                      PKR
                    </span>
                    {new Intl.NumberFormat('en-IN', {
                      maximumFractionDigits: 0,
                    }).format(prediction.predicted_price)}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {prediction.message}
                  </p>
                </section>
              )}

              <div>
                <button
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-accent px-7 text-sm font-semibold text-ink shadow-[0_3px_12px_#00000038] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a5f] hover:shadow-[0_7px_18px_#00000050] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Estimating…' : 'Estimate my car'}
                  {isSubmitting ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="animate-spin"
                      size={17}
                    />
                  ) : (
                    <ArrowUpRight aria-hidden="true" size={17} />
                  )}
                </button>
              </div>
            </form>

            <aside className="space-y-5 lg:sticky lg:top-8">
              <section className="rounded-2xl border border-line bg-white/70 p-6">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Info aria-hidden="true" size={17} />
                  </span>
                  <div>
                    <h2 className="font-semibold tracking-[-0.02em]">
                      A helpful estimate
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      The model is based on historical OLX Pakistan asking
                      prices. An estimate is not a guaranteed sale price.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-ink p-6 text-paper">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Before you begin
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <li>Make, model, year, and mileage are required.</li>
                  <li>Kilometers driven must be zero or more.</li>
                  <li>Other vehicle details are optional.</li>
                </ul>
              </section>
            </aside>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

export default EstimatePage
