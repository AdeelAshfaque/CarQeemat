import type { CarFeatureField } from '../types/prediction'

interface CarFeature {
  field: CarFeatureField
  label: string
}

interface CarFeatureGroup {
  title: string
  features: CarFeature[]
}

export const carFeatureGroups: CarFeatureGroup[] = [
  {
    title: 'Safety & security',
    features: [
      { field: 'abs', label: 'ABS' },
      { field: 'air_bags', label: 'Air Bags' },
      { field: 'immobilizer_key', label: 'Immobilizer Key' },
      { field: 'keyless_entry', label: 'Keyless Entry' },
    ],
  },
  {
    title: 'Comfort & convenience',
    features: [
      { field: 'air_conditioning', label: 'Air Conditioning' },
      { field: 'climate_control', label: 'Climate Control' },
      { field: 'cool_box', label: 'Cool Box' },
      { field: 'cruise_control', label: 'Cruise Control' },
      { field: 'heated_seats', label: 'Heated Seats' },
      { field: 'power_locks', label: 'Power Locks' },
      { field: 'power_mirrors', label: 'Power Mirrors' },
      { field: 'power_steering', label: 'Power Steering' },
      { field: 'power_windows', label: 'Power Windows' },
      { field: 'rear_ac_vents', label: 'Rear AC Vents' },
      { field: 'sun_roof', label: 'Sun Roof' },
    ],
  },
  {
    title: 'Audio & technology',
    features: [
      { field: 'am_fm_radio', label: 'AM/FM Radio' },
      { field: 'cd_player', label: 'CD Player' },
      { field: 'cassette_player', label: 'Cassette Player' },
      { field: 'dvd_player', label: 'DVD Player' },
      { field: 'front_speakers', label: 'Front Speakers' },
      { field: 'navigation_system', label: 'Navigation System' },
      { field: 'rear_seat_entertainment', label: 'Rear Seat Entertainment' },
      { field: 'rear_speakers', label: 'Rear speakers' },
      { field: 'steering_switches', label: 'Steering Switches' },
      {
        field: 'usb_and_auxillary_cable',
        label: 'USB and Auxillary Cable',
      },
    ],
  },
  {
    title: 'Exterior & visibility',
    features: [
      { field: 'alloy_rims', label: 'Alloy Rims' },
      { field: 'front_camera', label: 'Front Camera' },
      { field: 'rear_camera', label: 'Rear Camera' },
    ],
  },
]
