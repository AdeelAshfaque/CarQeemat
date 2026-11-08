export interface CarPredictionRequest {
  make: string
  model: string
  fuel: string | null
  car_documents: string | null
  assembly: string | null
  transmission: string | null
  registration_type: string | null
  registration_location_group: string | null
  seller_city: string | null
  seller_location_type: string | null
  year: number
  km_driven: number
  abs: boolean
  am_fm_radio: boolean
  air_bags: boolean
  air_conditioning: boolean
  alloy_rims: boolean
  cd_player: boolean
  cassette_player: boolean
  climate_control: boolean
  cool_box: boolean
  cruise_control: boolean
  dvd_player: boolean
  front_camera: boolean
  front_speakers: boolean
  heated_seats: boolean
  immobilizer_key: boolean
  keyless_entry: boolean
  navigation_system: boolean
  power_locks: boolean
  power_mirrors: boolean
  power_steering: boolean
  power_windows: boolean
  rear_ac_vents: boolean
  rear_camera: boolean
  rear_seat_entertainment: boolean
  rear_speakers: boolean
  steering_switches: boolean
  sun_roof: boolean
  usb_and_auxillary_cable: boolean
}

export interface CarPredictionResponse {
  success: true
  predicted_price: number
  currency: 'PKR'
  message: string
}

export type CarFormValues = Omit<
  CarPredictionRequest,
  'year' | 'km_driven'
> & {
  year: string
  km_driven: string
}

export type CarFeatureField = {
  [Key in keyof CarPredictionRequest]: CarPredictionRequest[Key] extends boolean
    ? Key
    : never
}[keyof CarPredictionRequest]
