import type {
  CarPredictionRequest,
  CarPredictionResponse,
} from '../types/prediction'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const baseUrl = configuredBaseUrl || '/api'

const fieldLabels: Record<string, string> = {
  make: 'Make',
  model: 'Model',
  fuel: 'Fuel',
  car_documents: 'Car documents',
  assembly: 'Assembly',
  transmission: 'Transmission',
  registration_type: 'Registration type',
  registration_location_group: 'Registration location group',
  seller_city: 'Seller city',
  seller_location_type: 'Seller location type',
  year: 'Manufacturing year',
  km_driven: 'Kilometers driven',
}

export class PredictionApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PredictionApiError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getValidationMessages(errors: unknown[]): string[] {
  return errors.flatMap((error) => {
    if (!isRecord(error) || typeof error.msg !== 'string') {
      return []
    }

    const location = Array.isArray(error.loc) ? error.loc : []
    const field = [...location]
      .reverse()
      .find((part): part is string => typeof part === 'string' && part !== 'body')
    const message = field
      ? `${fieldLabels[field] ?? field}: ${error.msg}`
      : error.msg

    return [message]
  })
}

function getApiErrorMessage(body: unknown, status: number): string {
  if (status >= 500) {
    return 'CarQeemat could not complete the estimate right now. Please try again.'
  }

  if (isRecord(body) && typeof body.detail === 'string') {
    return body.detail
  }

  if (isRecord(body) && Array.isArray(body.detail)) {
    const messages = getValidationMessages(body.detail)
    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return `The prediction service returned an error (${status}). Please try again.`
}

function isCarPredictionResponse(
  value: unknown,
): value is CarPredictionResponse {
  return (
    isRecord(value) &&
    value.success === true &&
    typeof value.predicted_price === 'number' &&
    Number.isInteger(value.predicted_price) &&
    value.predicted_price > 0 &&
    value.currency === 'PKR' &&
    typeof value.message === 'string'
  )
}

export async function predictCarPrice(
  request: CarPredictionRequest,
): Promise<CarPredictionResponse> {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  let response: Response

  try {
    response = await fetch(`${normalizedBaseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new PredictionApiError(
        'Could not connect to CarQeemat. Check that the backend is running and try again.',
      )
    }
    throw error
  }

  if (response.status >= 500) {
    throw new PredictionApiError(getApiErrorMessage(undefined, response.status))
  }

  let body: unknown
  try {
    body = await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new PredictionApiError(
        'The prediction service returned an unreadable response. Please try again.',
      )
    }
    throw error
  }

  if (!response.ok) {
    throw new PredictionApiError(getApiErrorMessage(body, response.status))
  }

  if (!isCarPredictionResponse(body)) {
    throw new PredictionApiError(
      'The prediction service returned an unexpected response. Please try again.',
    )
  }

  return body
}
