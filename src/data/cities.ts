/** Tier-1 states first (UP, MH, HR, UK, CG), then capitals/metros. */
export type City = {
  slug: string;
  name: string;
  state: string;
  tier: 1 | 2 | 3;
  /** Decimal degrees, north positive. */
  lat: number;
  /** Decimal degrees, east positive. */
  lon: number;
  /** Metres above sea level; used for the sunrise/sunset horizon. */
  elevation: number;
  /** IANA timezone — never inferred from the visitor's device for a chosen city. */
  timezone: string;
};

const IST = 'Asia/Kolkata';

export const cities: City[] = [
  // Uttar Pradesh
  { slug: 'lucknow', name: 'Lucknow', state: 'UP', tier: 1, lat: 26.8467, lon: 80.9462, elevation: 123, timezone: IST },
  { slug: 'kanpur', name: 'Kanpur', state: 'UP', tier: 1, lat: 26.4499, lon: 80.3319, elevation: 126, timezone: IST },
  { slug: 'varanasi', name: 'Varanasi', state: 'UP', tier: 1, lat: 25.3176, lon: 82.9739, elevation: 81, timezone: IST },
  { slug: 'prayagraj', name: 'Prayagraj', state: 'UP', tier: 1, lat: 25.4358, lon: 81.8463, elevation: 98, timezone: IST },
  { slug: 'agra', name: 'Agra', state: 'UP', tier: 1, lat: 27.1767, lon: 78.0081, elevation: 171, timezone: IST },
  { slug: 'meerut', name: 'Meerut', state: 'UP', tier: 1, lat: 28.9845, lon: 77.7064, elevation: 219, timezone: IST },
  { slug: 'ghaziabad', name: 'Ghaziabad', state: 'UP', tier: 1, lat: 28.6692, lon: 77.4538, elevation: 214, timezone: IST },
  { slug: 'noida', name: 'Noida', state: 'UP', tier: 1, lat: 28.5355, lon: 77.391, elevation: 200, timezone: IST },
  { slug: 'gorakhpur', name: 'Gorakhpur', state: 'UP', tier: 1, lat: 26.7606, lon: 83.3732, elevation: 84, timezone: IST },
  { slug: 'bareilly', name: 'Bareilly', state: 'UP', tier: 1, lat: 28.367, lon: 79.4304, elevation: 268, timezone: IST },
  { slug: 'aligarh', name: 'Aligarh', state: 'UP', tier: 1, lat: 27.8974, lon: 78.088, elevation: 178, timezone: IST },
  { slug: 'moradabad', name: 'Moradabad', state: 'UP', tier: 1, lat: 28.8386, lon: 78.7733, elevation: 198, timezone: IST },
  { slug: 'jhansi', name: 'Jhansi', state: 'UP', tier: 1, lat: 25.4484, lon: 78.5685, elevation: 285, timezone: IST },
  { slug: 'ayodhya', name: 'Ayodhya', state: 'UP', tier: 1, lat: 26.7922, lon: 82.1998, elevation: 93, timezone: IST },
  { slug: 'mathura', name: 'Mathura', state: 'UP', tier: 1, lat: 27.4924, lon: 77.6737, elevation: 174, timezone: IST },
  // Maharashtra
  { slug: 'mumbai', name: 'Mumbai', state: 'MH', tier: 1, lat: 19.076, lon: 72.8777, elevation: 14, timezone: IST },
  { slug: 'pune', name: 'Pune', state: 'MH', tier: 1, lat: 18.5204, lon: 73.8567, elevation: 560, timezone: IST },
  { slug: 'nagpur', name: 'Nagpur', state: 'MH', tier: 1, lat: 21.1458, lon: 79.0882, elevation: 310, timezone: IST },
  { slug: 'nashik', name: 'Nashik', state: 'MH', tier: 1, lat: 19.9975, lon: 73.7898, elevation: 584, timezone: IST },
  { slug: 'aurangabad', name: 'Aurangabad', state: 'MH', tier: 1, lat: 19.8762, lon: 75.3433, elevation: 568, timezone: IST },
  { slug: 'thane', name: 'Thane', state: 'MH', tier: 1, lat: 19.2183, lon: 72.9781, elevation: 7, timezone: IST },
  { slug: 'solapur', name: 'Solapur', state: 'MH', tier: 1, lat: 17.6599, lon: 75.9064, elevation: 457, timezone: IST },
  { slug: 'kolhapur', name: 'Kolhapur', state: 'MH', tier: 1, lat: 16.705, lon: 74.2433, elevation: 569, timezone: IST },
  { slug: 'amravati', name: 'Amravati', state: 'MH', tier: 1, lat: 20.9374, lon: 77.7796, elevation: 343, timezone: IST },
  // Haryana
  { slug: 'gurugram', name: 'Gurugram', state: 'HR', tier: 1, lat: 28.4595, lon: 77.0266, elevation: 217, timezone: IST },
  { slug: 'faridabad', name: 'Faridabad', state: 'HR', tier: 1, lat: 28.4089, lon: 77.3178, elevation: 198, timezone: IST },
  { slug: 'panipat', name: 'Panipat', state: 'HR', tier: 1, lat: 29.3909, lon: 76.9635, elevation: 219, timezone: IST },
  { slug: 'ambala', name: 'Ambala', state: 'HR', tier: 1, lat: 30.3752, lon: 76.7821, elevation: 264, timezone: IST },
  { slug: 'karnal', name: 'Karnal', state: 'HR', tier: 1, lat: 29.6857, lon: 76.9905, elevation: 252, timezone: IST },
  { slug: 'hisar', name: 'Hisar', state: 'HR', tier: 1, lat: 29.1492, lon: 75.7217, elevation: 215, timezone: IST },
  { slug: 'rohtak', name: 'Rohtak', state: 'HR', tier: 1, lat: 28.8955, lon: 76.6066, elevation: 220, timezone: IST },
  { slug: 'yamunanagar', name: 'Yamunanagar', state: 'HR', tier: 1, lat: 30.129, lon: 77.2674, elevation: 255, timezone: IST },
  // Uttarakhand
  { slug: 'dehradun', name: 'Dehradun', state: 'UK', tier: 1, lat: 30.3165, lon: 78.0322, elevation: 640, timezone: IST },
  { slug: 'haridwar', name: 'Haridwar', state: 'UK', tier: 1, lat: 29.9457, lon: 78.1642, elevation: 314, timezone: IST },
  { slug: 'rishikesh', name: 'Rishikesh', state: 'UK', tier: 1, lat: 30.0869, lon: 78.2676, elevation: 372, timezone: IST },
  { slug: 'haldwani', name: 'Haldwani', state: 'UK', tier: 1, lat: 29.2183, lon: 79.5130, elevation: 424, timezone: IST },
  { slug: 'roorkee', name: 'Roorkee', state: 'UK', tier: 1, lat: 29.8543, lon: 77.8880, elevation: 274, timezone: IST },
  { slug: 'nainital', name: 'Nainital', state: 'UK', tier: 1, lat: 29.3919, lon: 79.4542, elevation: 2084, timezone: IST },
  // Chhattisgarh
  { slug: 'raipur', name: 'Raipur', state: 'CG', tier: 1, lat: 21.2514, lon: 81.6296, elevation: 298, timezone: IST },
  { slug: 'bilaspur', name: 'Bilaspur', state: 'CG', tier: 1, lat: 22.0797, lon: 82.1409, elevation: 264, timezone: IST },
  { slug: 'durg', name: 'Durg', state: 'CG', tier: 1, lat: 21.1904, lon: 81.2849, elevation: 289, timezone: IST },
  { slug: 'bhilai', name: 'Bhilai', state: 'CG', tier: 1, lat: 21.2092, lon: 81.4285, elevation: 297, timezone: IST },
  { slug: 'korba', name: 'Korba', state: 'CG', tier: 1, lat: 22.3595, lon: 82.7501, elevation: 304, timezone: IST },
  { slug: 'raigarh', name: 'Raigarh', state: 'CG', tier: 1, lat: 21.8974, lon: 83.3950, elevation: 218, timezone: IST },
  // Capitals / metros (tier 2)
  { slug: 'delhi', name: 'Delhi', state: 'DL', tier: 2, lat: 28.6139, lon: 77.209, elevation: 216, timezone: IST },
  { slug: 'bengaluru', name: 'Bengaluru', state: 'KA', tier: 2, lat: 12.9716, lon: 77.5946, elevation: 920, timezone: IST },
  { slug: 'chennai', name: 'Chennai', state: 'TN', tier: 2, lat: 13.0827, lon: 80.2707, elevation: 6, timezone: IST },
  { slug: 'kolkata', name: 'Kolkata', state: 'WB', tier: 2, lat: 22.5726, lon: 88.3639, elevation: 9, timezone: IST },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'TS', tier: 2, lat: 17.385, lon: 78.4867, elevation: 542, timezone: IST },
  { slug: 'jaipur', name: 'Jaipur', state: 'RJ', tier: 2, lat: 26.9124, lon: 75.7873, elevation: 431, timezone: IST },
  { slug: 'bhopal', name: 'Bhopal', state: 'MP', tier: 2, lat: 23.2599, lon: 77.4126, elevation: 527, timezone: IST },
  { slug: 'patna', name: 'Patna', state: 'BR', tier: 2, lat: 25.5941, lon: 85.1376, elevation: 53, timezone: IST },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'CH', tier: 2, lat: 30.7333, lon: 76.7794, elevation: 321, timezone: IST },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'GJ', tier: 2, lat: 23.0225, lon: 72.5714, elevation: 53, timezone: IST },
];

export const defaultCitySlug = 'lucknow';

/** Full state names so the city search also matches "Uttar Pradesh" or "UP". */
export const stateNames: Record<string, string> = {
  UP: 'Uttar Pradesh',
  MH: 'Maharashtra',
  HR: 'Haryana',
  UK: 'Uttarakhand',
  CG: 'Chhattisgarh',
  DL: 'Delhi',
  KA: 'Karnataka',
  TN: 'Tamil Nadu',
  WB: 'West Bengal',
  TS: 'Telangana',
  RJ: 'Rajasthan',
  MP: 'Madhya Pradesh',
  BR: 'Bihar',
  CH: 'Chandigarh',
  GJ: 'Gujarat',
};

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function citiesByState(): Record<string, City[]> {
  return cities.reduce<Record<string, City[]>>((acc, city) => {
    (acc[city.state] ??= []).push(city);
    return acc;
  }, {});
}

/** Nearest listed city by great-circle distance — used when GPS gives coordinates only. */
export function nearestCity(lat: number, lon: number): { city: City; distanceKm: number } {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  let best = cities[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const city of cities) {
    const dLat = toRad(city.lat - lat);
    const dLon = toRad(city.lon - lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(city.lat)) * Math.sin(dLon / 2) ** 2;
    const distance = 2 * earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(a)));
    if (distance < bestDistance) {
      best = city;
      bestDistance = distance;
    }
  }

  return { city: best, distanceKm: bestDistance };
}
