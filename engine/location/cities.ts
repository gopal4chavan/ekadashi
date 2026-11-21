import type { ObserverLocation } from '../astronomy/types'

export interface City extends ObserverLocation {
  id: string
  name: string
  country: string
}

export const cities: City[] = [
  { id: 'hyderabad', name: 'Hyderabad', country: 'India', latitude: 17.385, longitude: 78.4867, elevationMeters: 505, timezone: 'Asia/Kolkata' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, elevationMeters: 14, timezone: 'Asia/Kolkata' },
  { id: 'new-delhi', name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.209, elevationMeters: 216, timezone: 'Asia/Kolkata' },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276, elevationMeters: 11, timezone: 'Europe/London' },
  { id: 'new-york', name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, elevationMeters: 10, timezone: 'America/New_York' }
]
