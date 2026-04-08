/**
 * Top ~100 cities in the Western world for SEO city pages.
 * Each city has an English slug, coordinates, country code, GeoNames ID,
 * and the locales it should be available in (always 'en' + local language).
 */

interface City {
  id: number;         // GeoNames ID
  slug: string;       // English URL slug (lowercase, hyphenated)
  lat: number;
  lon: number;
  country: string;    // ISO 3166-1 alpha-2
  /** Locales this city should appear in (en + local language) */
  locales: string[];
  /** Sitemap priority: 0.8 = capital/major, 0.7 = default, 0.5 = small/niche */
  priority?: number;
}

// Locale assignments:
// US/UK/AU/CA(en)/IE/NZ: en only (+ es for US)
// Sweden: en, sv
// Norway: en, no
// Denmark: en, da
// Germany/Austria/Switzerland(de): en, de
// Italy: en, it
// Spain: en, es
// France: en, fr
// Portugal/Brazil: en, pt

const cities: City[] = [
  // ── Scandinavia ───────────────────────────────────────────
  { id: 2673730, slug: 'stockholm', lat: 59.33, lon: 18.07, country: 'SE', locales: ['en', 'sv'], priority: 0.8 },
  { id: 2711537, slug: 'gothenburg', lat: 57.71, lon: 11.97, country: 'SE', locales: ['en', 'sv'] },
  { id: 2692969, slug: 'malmo', lat: 55.61, lon: 13.04, country: 'SE', locales: ['en', 'sv'] },
  { id: 2666199, slug: 'uppsala', lat: 59.86, lon: 17.64, country: 'SE', locales: ['en', 'sv'] },
  { id: 2664454, slug: 'vasteras', lat: 59.62, lon: 16.55, country: 'SE', locales: ['en', 'sv'] },
  { id: 2686657, slug: 'orebro', lat: 59.27, lon: 15.21, country: 'SE', locales: ['en', 'sv'] },
  { id: 2694762, slug: 'linkoping', lat: 58.41, lon: 15.63, country: 'SE', locales: ['en', 'sv'] },

  { id: 3143244, slug: 'oslo', lat: 59.91, lon: 10.75, country: 'NO', locales: ['en', 'no'], priority: 0.8 },
  { id: 3161732, slug: 'bergen', lat: 60.39, lon: 5.32, country: 'NO', locales: ['en', 'no'] },
  { id: 3133880, slug: 'trondheim', lat: 63.43, lon: 10.40, country: 'NO', locales: ['en', 'no'] },
  { id: 3137115, slug: 'stavanger', lat: 58.97, lon: 5.73, country: 'NO', locales: ['en', 'no'] },
  { id: 3133895, slug: 'tromso', lat: 69.65, lon: 18.96, country: 'NO', locales: ['en', 'no'] },

  { id: 2618425, slug: 'copenhagen', lat: 55.68, lon: 12.57, country: 'DK', locales: ['en', 'da'], priority: 0.8 },
  { id: 2624652, slug: 'aarhus', lat: 56.15, lon: 10.21, country: 'DK', locales: ['en', 'da'] },
  { id: 2615876, slug: 'odense', lat: 55.40, lon: 10.39, country: 'DK', locales: ['en', 'da'] },
  { id: 2624886, slug: 'aalborg', lat: 57.05, lon: 9.92, country: 'DK', locales: ['en', 'da'] },

  // ── Germany / Austria / Switzerland ───────────────────────
  { id: 2950159, slug: 'berlin', lat: 52.52, lon: 13.41, country: 'DE', locales: ['en', 'de'], priority: 0.8 },
  { id: 2867714, slug: 'munich', lat: 48.14, lon: 11.58, country: 'DE', locales: ['en', 'de'], priority: 0.8 },
  { id: 2911298, slug: 'hamburg', lat: 53.55, lon: 9.99, country: 'DE', locales: ['en', 'de'], priority: 0.8 },
  { id: 2925533, slug: 'frankfurt', lat: 50.11, lon: 8.68, country: 'DE', locales: ['en', 'de'] },
  { id: 2886242, slug: 'cologne', lat: 50.94, lon: 6.96, country: 'DE', locales: ['en', 'de'] },
  { id: 2825297, slug: 'stuttgart', lat: 48.78, lon: 9.18, country: 'DE', locales: ['en', 'de'] },
  { id: 2934246, slug: 'dusseldorf', lat: 51.23, lon: 6.78, country: 'DE', locales: ['en', 'de'] },
  { id: 2861650, slug: 'nuremberg', lat: 49.45, lon: 11.08, country: 'DE', locales: ['en', 'de'] },
  { id: 2879139, slug: 'leipzig', lat: 51.34, lon: 12.37, country: 'DE', locales: ['en', 'de'] },
  { id: 2935022, slug: 'dresden', lat: 51.05, lon: 13.74, country: 'DE', locales: ['en', 'de'] },
  { id: 2910831, slug: 'hanover', lat: 52.37, lon: 9.74, country: 'DE', locales: ['en', 'de'] },

  { id: 2761369, slug: 'vienna', lat: 48.21, lon: 16.37, country: 'AT', locales: ['en', 'de'], priority: 0.8 },
  { id: 2766824, slug: 'salzburg', lat: 47.80, lon: 13.04, country: 'AT', locales: ['en', 'de'] },
  { id: 2775220, slug: 'innsbruck', lat: 47.26, lon: 11.39, country: 'AT', locales: ['en', 'de'] },

  { id: 2657896, slug: 'zurich', lat: 47.37, lon: 8.54, country: 'CH', locales: ['en', 'de'], priority: 0.8 },
  { id: 2660646, slug: 'geneva', lat: 46.20, lon: 6.14, country: 'CH', locales: ['en', 'fr'] },
  { id: 2661552, slug: 'bern', lat: 46.95, lon: 7.45, country: 'CH', locales: ['en', 'de'] },

  // ── Italy ─────────────────────────────────────────────────
  { id: 3169070, slug: 'rome', lat: 41.89, lon: 12.51, country: 'IT', locales: ['en', 'it'], priority: 0.8 },
  { id: 3173435, slug: 'milan', lat: 45.46, lon: 9.19, country: 'IT', locales: ['en', 'it'], priority: 0.8 },
  { id: 3172394, slug: 'naples', lat: 40.85, lon: 14.27, country: 'IT', locales: ['en', 'it'], priority: 0.8 },
  { id: 3165524, slug: 'turin', lat: 45.07, lon: 7.69, country: 'IT', locales: ['en', 'it'] },
  { id: 3176959, slug: 'florence', lat: 43.77, lon: 11.25, country: 'IT', locales: ['en', 'it'] },
  { id: 3164603, slug: 'venice', lat: 45.44, lon: 12.34, country: 'IT', locales: ['en', 'it'] },
  { id: 3181928, slug: 'bologna', lat: 44.49, lon: 11.34, country: 'IT', locales: ['en', 'it'] },
  { id: 2523920, slug: 'palermo', lat: 38.12, lon: 13.36, country: 'IT', locales: ['en', 'it'] },

  // ── Spain ─────────────────────────────────────────────────
  { id: 3128760, slug: 'barcelona', lat: 41.39, lon: 2.17, country: 'ES', locales: ['en', 'es'], priority: 0.8 },
  { id: 3117735, slug: 'madrid', lat: 40.42, lon: -3.70, country: 'ES', locales: ['en', 'es'], priority: 0.8 },
  { id: 2510911, slug: 'seville', lat: 37.39, lon: -5.98, country: 'ES', locales: ['en', 'es'] },
  { id: 2509954, slug: 'valencia', lat: 39.47, lon: -0.38, country: 'ES', locales: ['en', 'es'] },
  { id: 3128026, slug: 'bilbao', lat: 43.26, lon: -2.93, country: 'ES', locales: ['en', 'es'] },
  { id: 2514256, slug: 'malaga', lat: 36.72, lon: -4.42, country: 'ES', locales: ['en', 'es'] },
  { id: 2521978, slug: 'alicante', lat: 38.35, lon: -0.48, country: 'ES', locales: ['en', 'es'] },
  { id: 2512989, slug: 'palma-de-mallorca', lat: 39.57, lon: 2.65, country: 'ES', locales: ['en', 'es'] },

  // ── France ────────────────────────────────────────────────
  { id: 2988507, slug: 'paris', lat: 48.86, lon: 2.35, country: 'FR', locales: ['en', 'fr'], priority: 0.8 },
  { id: 2995469, slug: 'marseille', lat: 43.30, lon: 5.37, country: 'FR', locales: ['en', 'fr'], priority: 0.8 },
  { id: 2996944, slug: 'lyon', lat: 45.76, lon: 4.84, country: 'FR', locales: ['en', 'fr'], priority: 0.8 },
  { id: 3031582, slug: 'bordeaux', lat: 44.84, lon: -0.58, country: 'FR', locales: ['en', 'fr'] },
  { id: 2990440, slug: 'nice', lat: 43.70, lon: 7.27, country: 'FR', locales: ['en', 'fr'] },
  { id: 2990969, slug: 'nantes', lat: 47.22, lon: -1.55, country: 'FR', locales: ['en', 'fr'] },
  { id: 2973783, slug: 'strasbourg', lat: 48.57, lon: 7.75, country: 'FR', locales: ['en', 'fr'] },
  { id: 2972315, slug: 'toulouse', lat: 43.60, lon: 1.44, country: 'FR', locales: ['en', 'fr'] },

  // ── Portugal ──────────────────────────────────────────────
  { id: 2267057, slug: 'lisbon', lat: 38.72, lon: -9.14, country: 'PT', locales: ['en', 'pt'], priority: 0.8 },
  { id: 2735943, slug: 'porto', lat: 41.15, lon: -8.61, country: 'PT', locales: ['en', 'pt'] },
  { id: 2268339, slug: 'faro', lat: 37.02, lon: -7.94, country: 'PT', locales: ['en', 'pt'] },

  // ── United Kingdom / Ireland ──────────────────────────────
  { id: 2643743, slug: 'london', lat: 51.51, lon: -0.13, country: 'GB', locales: ['en'], priority: 0.8 },
  { id: 2644210, slug: 'liverpool', lat: 53.41, lon: -2.98, country: 'GB', locales: ['en'] },
  { id: 2643123, slug: 'manchester', lat: 53.48, lon: -2.24, country: 'GB', locales: ['en'] },
  { id: 2655603, slug: 'birmingham', lat: 52.49, lon: -1.89, country: 'GB', locales: ['en'] },
  { id: 2650225, slug: 'edinburgh', lat: 55.95, lon: -3.19, country: 'GB', locales: ['en'] },
  { id: 2648579, slug: 'glasgow', lat: 55.86, lon: -4.25, country: 'GB', locales: ['en'] },
  { id: 2654675, slug: 'bristol', lat: 51.45, lon: -2.59, country: 'GB', locales: ['en'] },
  { id: 2644688, slug: 'leeds', lat: 53.80, lon: -1.55, country: 'GB', locales: ['en'] },
  { id: 2964574, slug: 'dublin', lat: 53.33, lon: -6.26, country: 'IE', locales: ['en'], priority: 0.8 },

  // ── United States (en + es) ───────────────────────────────
  { id: 5128581, slug: 'new-york', lat: 40.71, lon: -74.01, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5368361, slug: 'los-angeles', lat: 34.05, lon: -118.24, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4887398, slug: 'chicago', lat: 41.88, lon: -87.63, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4699066, slug: 'houston', lat: 29.76, lon: -95.37, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4726206, slug: 'san-antonio', lat: 29.42, lon: -98.49, country: 'US', locales: ['en', 'es'] },
  { id: 5308655, slug: 'phoenix', lat: 33.45, lon: -112.07, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4560349, slug: 'philadelphia', lat: 39.95, lon: -75.17, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4684888, slug: 'dallas', lat: 32.78, lon: -96.80, country: 'US', locales: ['en', 'es'] },
  { id: 4164138, slug: 'miami', lat: 25.76, lon: -80.19, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5391811, slug: 'san-diego', lat: 32.72, lon: -117.16, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5391959, slug: 'san-francisco', lat: 37.77, lon: -122.42, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4180439, slug: 'atlanta', lat: 33.75, lon: -84.39, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5419384, slug: 'denver', lat: 39.74, lon: -104.98, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5809844, slug: 'seattle', lat: 47.61, lon: -122.33, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4930956, slug: 'boston', lat: 42.36, lon: -71.06, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5506956, slug: 'las-vegas', lat: 36.17, lon: -115.14, country: 'US', locales: ['en', 'es'], priority: 0.8 },

  // ── Canada ────────────────────────────────────────────────
  { id: 6167865, slug: 'toronto', lat: 43.65, lon: -79.38, country: 'CA', locales: ['en'], priority: 0.8 },
  { id: 6077243, slug: 'montreal', lat: 45.51, lon: -73.59, country: 'CA', locales: ['en', 'fr'], priority: 0.8 },
  { id: 6173331, slug: 'vancouver', lat: 49.28, lon: -123.12, country: 'CA', locales: ['en'], priority: 0.8 },
  { id: 5913490, slug: 'calgary', lat: 51.05, lon: -114.07, country: 'CA', locales: ['en'], priority: 0.8 },
  { id: 6094817, slug: 'ottawa', lat: 45.42, lon: -75.70, country: 'CA', locales: ['en'], priority: 0.8 },

  // ── Australia / New Zealand ───────────────────────────────
  { id: 2147714, slug: 'sydney', lat: -33.87, lon: 151.21, country: 'AU', locales: ['en'], priority: 0.8 },
  { id: 2158177, slug: 'melbourne', lat: -37.81, lon: 144.96, country: 'AU', locales: ['en'], priority: 0.8 },
  { id: 2174003, slug: 'brisbane', lat: -27.47, lon: 153.03, country: 'AU', locales: ['en'], priority: 0.8 },
  { id: 2063523, slug: 'perth', lat: -31.95, lon: 115.86, country: 'AU', locales: ['en'], priority: 0.8 },
  { id: 2193733, slug: 'auckland', lat: -36.85, lon: 174.76, country: 'NZ', locales: ['en'], priority: 0.8 },

  // ── Greece / Turkey / Other Mediterranean ─────────────────
  { id: 264371, slug: 'athens', lat: 37.98, lon: 23.73, country: 'GR', locales: ['en'], priority: 0.8 },
  { id: 745044, slug: 'istanbul', lat: 41.01, lon: 28.98, country: 'TR', locales: ['en'], priority: 0.8 },
  { id: 146268, slug: 'nicosia', lat: 35.17, lon: 33.37, country: 'CY', locales: ['en'], priority: 0.8 },

  // ── Netherlands / Belgium ─────────────────────────────────
  { id: 2759794, slug: 'amsterdam', lat: 52.37, lon: 4.90, country: 'NL', locales: ['en', 'nl'], priority: 0.8 },
  { id: 2800866, slug: 'brussels', lat: 50.85, lon: 4.35, country: 'BE', locales: ['en', 'fr', 'nl'], priority: 0.8 },

  // ── Poland / Czech Republic ───────────────────────────────
  { id: 756135, slug: 'warsaw', lat: 52.23, lon: 21.01, country: 'PL', locales: ['en', 'pl'], priority: 0.8 },
  { id: 3067696, slug: 'prague', lat: 50.09, lon: 14.42, country: 'CZ', locales: ['en'], priority: 0.8 },

  // ── Poland (additional cities) ────────────────────────────
  { id: 3094802, slug: 'krakow', lat: 50.06, lon: 19.94, country: 'PL', locales: ['en', 'pl'] },
  { id: 3099434, slug: 'gdansk', lat: 54.35, lon: 18.65, country: 'PL', locales: ['en', 'pl'] },
  { id: 3081368, slug: 'wroclaw', lat: 51.10, lon: 17.03, country: 'PL', locales: ['en', 'pl'] },
  { id: 3088171, slug: 'poznan', lat: 52.41, lon: 16.93, country: 'PL', locales: ['en', 'pl'] },
  { id: 3093133, slug: 'lodz', lat: 51.75, lon: 19.47, country: 'PL', locales: ['en', 'pl'] },
  { id: 3083829, slug: 'szczecin', lat: 53.43, lon: 14.53, country: 'PL', locales: ['en', 'pl'] },
  { id: 3102014, slug: 'bydgoszcz', lat: 53.12, lon: 18.01, country: 'PL', locales: ['en', 'pl'] },
  { id: 765876, slug: 'lublin', lat: 51.25, lon: 22.57, country: 'PL', locales: ['en', 'pl'] },
  { id: 3096472, slug: 'katowice', lat: 50.26, lon: 19.02, country: 'PL', locales: ['en', 'pl'] },
  { id: 3083271, slug: 'torun', lat: 53.01, lon: 18.61, country: 'PL', locales: ['en', 'pl'] },
  { id: 759734, slug: 'rzeszow', lat: 50.04, lon: 22.00, country: 'PL', locales: ['en', 'pl'] },
  { id: 3080165, slug: 'zielona-gora', lat: 51.94, lon: 15.51, country: 'PL', locales: ['en', 'pl'] },
  { id: 3098722, slug: 'gorzow-wielkopolski', lat: 52.73, lon: 15.23, country: 'PL', locales: ['en', 'pl'] },
  { id: 763166, slug: 'olsztyn', lat: 53.78, lon: 20.49, country: 'PL', locales: ['en', 'pl'] },
  { id: 3090048, slug: 'opole', lat: 50.67, lon: 17.93, country: 'PL', locales: ['en', 'pl'] },
  { id: 3099424, slug: 'gdynia', lat: 54.52, lon: 18.53, country: 'PL', locales: ['en', 'pl'] },
  { id: 3085151, slug: 'sopot', lat: 54.44, lon: 18.56, country: 'PL', locales: ['en', 'pl'] },
  { id: 769250, slug: 'kielce', lat: 50.87, lon: 20.63, country: 'PL', locales: ['en', 'pl'] },
  { id: 776069, slug: 'bialystok', lat: 53.13, lon: 23.16, country: 'PL', locales: ['en', 'pl'] },

  // ── Sweden (Google Trends top UV cities) ──────────────────
  { id: 2669415, slug: 'tanumshede', lat: 58.72, lon: 11.33, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2690580, slug: 'nacka', lat: 59.31, lon: 18.16, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2691440, slug: 'molnlycke', lat: 57.66, lon: 12.12, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2662689, slug: 'visby', lat: 57.64, lon: 18.30, country: 'SE', locales: ['en', 'sv'] },
  { id: 2664996, slug: 'varberg', lat: 57.11, lon: 12.25, country: 'SE', locales: ['en', 'sv'] },
  { id: 2696334, slug: 'lidingo', lat: 59.37, lon: 18.13, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 604490, slug: 'lulea', lat: 65.58, lon: 22.15, country: 'SE', locales: ['en', 'sv'] },
  { id: 602913, slug: 'skelleftea', lat: 64.75, lon: 20.95, country: 'SE', locales: ['en', 'sv'] },
  { id: 2691459, slug: 'molndal', lat: 57.66, lon: 12.01, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2693678, slug: 'lund', lat: 55.71, lon: 13.19, country: 'SE', locales: ['en', 'sv'] },
  { id: 602150, slug: 'umea', lat: 63.83, lon: 20.26, country: 'SE', locales: ['en', 'sv'] },
  { id: 3336568, slug: 'skanor-med-falsterbo', lat: 55.40, lon: 12.85, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2702979, slug: 'jonkoping', lat: 57.78, lon: 14.16, country: 'SE', locales: ['en', 'sv'] },
  { id: 2708365, slug: 'halmstad', lat: 56.67, lon: 12.86, country: 'SE', locales: ['en', 'sv'] },
  { id: 2674649, slug: 'staffanstorp', lat: 55.64, lon: 13.21, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2665452, slug: 'vallentuna', lat: 59.53, lon: 18.08, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2701680, slug: 'karlstad', lat: 59.38, lon: 13.50, country: 'SE', locales: ['en', 'sv'] },
  { id: 2702261, slug: 'kalmar', lat: 56.66, lon: 16.36, country: 'SE', locales: ['en', 'sv'] },
  { id: 2685750, slug: 'ostersund', lat: 63.18, lon: 14.64, country: 'SE', locales: ['en', 'sv'] },
  { id: 2670781, slug: 'sundsvall', lat: 62.39, lon: 17.31, country: 'SE', locales: ['en', 'sv'] },
  { id: 2715459, slug: 'falun', lat: 60.60, lon: 15.63, country: 'SE', locales: ['en', 'sv'] },
  { id: 2677234, slug: 'skovde', lat: 58.39, lon: 13.85, country: 'SE', locales: ['en', 'sv'] },
  { id: 2698739, slug: 'kungalv', lat: 57.87, lon: 11.98, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2675408, slug: 'sollentuna', lat: 59.43, lon: 17.95, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2712414, slug: 'gavle', lat: 60.67, lon: 17.14, country: 'SE', locales: ['en', 'sv'] },
  { id: 2720383, slug: 'borlange', lat: 60.49, lon: 15.44, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2720501, slug: 'boras', lat: 57.72, lon: 12.94, country: 'SE', locales: ['en', 'sv'] },
  { id: 2715953, slug: 'eskilstuna', lat: 59.37, lon: 16.51, country: 'SE', locales: ['en', 'sv'] },
  { id: 2706767, slug: 'helsingborg', lat: 56.05, lon: 12.69, country: 'SE', locales: ['en', 'sv'] },
  { id: 2698733, slug: 'kungsangen', lat: 59.48, lon: 17.75, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2688368, slug: 'norrkoping', lat: 58.59, lon: 16.18, country: 'SE', locales: ['en', 'sv'] },
  { id: 2701223, slug: 'katrineholm', lat: 59.00, lon: 16.21, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 2669772, slug: 'taby', lat: 59.44, lon: 18.07, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },
  { id: 603303, slug: 'robertsfors', lat: 64.19, lon: 20.85, country: 'SE', locales: ['en', 'sv'], priority: 0.5 },

  // ── Denmark (Google Trends) ───────────────────────────────
  { id: 2612057, slug: 'svebolle', lat: 55.65, lon: 11.29, country: 'DK', locales: ['en', 'da'], priority: 0.5 },

  // ── Spain (Google Trends) ─────────────────────────────────
  { id: 2522437, slug: 'adeje', lat: 28.12, lon: -16.73, country: 'ES', locales: ['en', 'es'] },
  { id: 2511106, slug: 'santanyi', lat: 39.35, lon: 3.13, country: 'ES', locales: ['en', 'es'] },
  { id: 2514042, slug: 'maspalomas', lat: 27.76, lon: -15.59, country: 'ES', locales: ['en', 'es'] },
  { id: 7576473, slug: 'cas-catala', lat: 39.55, lon: 2.60, country: 'ES', locales: ['en', 'es'], priority: 0.5 },
  { id: 6355021, slug: 'port-de-pollenca', lat: 39.91, lon: 3.08, country: 'ES', locales: ['en', 'es'], priority: 0.5 },
  { id: 6544333, slug: 'sa-coma', lat: 39.58, lon: 3.37, country: 'ES', locales: ['en', 'es'], priority: 0.5 },
  { id: 2512196, slug: 'puerto-de-la-cruz', lat: 28.42, lon: -16.55, country: 'ES', locales: ['en', 'es'] },

  // ── Portugal (Google Trends) ──────────────────────────────
  { id: 2272222, slug: 'albufeira', lat: 37.09, lon: -8.25, country: 'PT', locales: ['en', 'pt'] },

  // ── Germany (Google Trends) ───────────────────────────────
  { id: 2953416, slug: 'bad-kreuznach', lat: 49.84, lon: 7.87, country: 'DE', locales: ['en', 'de'] },

  // ── Belgium (Google Trends) ───────────────────────────────
  { id: 2799645, slug: 'dendermonde', lat: 51.03, lon: 4.10, country: 'BE', locales: ['en', 'nl'], priority: 0.5 },

  // ── Greece (Google Trends) ────────────────────────────────
  { id: 251399, slug: 'gerani', lat: 35.35, lon: 24.40, country: 'GR', locales: ['en'], priority: 0.5 },
  { id: 7303252, slug: 'kato-gouves', lat: 35.33, lon: 25.31, country: 'GR', locales: ['en'], priority: 0.5 },
  { id: 8145343, slug: 'maritsa', lat: 36.36, lon: 28.12, country: 'GR', locales: ['en'], priority: 0.5 },
  { id: 251280, slug: 'zakynthos', lat: 37.78, lon: 20.90, country: 'GR', locales: ['en'] },
  { id: 254352, slug: 'rethymno', lat: 35.37, lon: 24.48, country: 'GR', locales: ['en'] },

  // ── Cyprus (Google Trends) ────────────────────────────────
  { id: 146748, slug: 'ayia-napa', lat: 34.98, lon: 34.00, country: 'CY', locales: ['en'], priority: 0.5 },

  // ── Turkey (Google Trends) ────────────────────────────────
  { id: 301238, slug: 'side', lat: 36.77, lon: 31.39, country: 'TR', locales: ['en'], priority: 0.5 },

  // ── United States (Google Trends top UV cities) ───────────
  { id: 4461962, slug: 'corolla', lat: 36.38, lon: -75.83, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4172935, slug: 'siesta-key', lat: 27.27, lon: -82.55, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5852635, slug: 'puako', lat: 19.97, lon: -155.84, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4504003, slug: 'sea-isle-city', lat: 39.15, lon: -74.69, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4081696, slug: 'orange-beach', lat: 30.29, lon: -87.57, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5849616, slug: 'koloa', lat: 21.90, lon: -159.47, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4167695, slug: 'panama-city-beach', lat: 30.18, lon: -85.81, country: 'US', locales: ['en', 'es'] },
  { id: 7262800, slug: 'wailea-makena', lat: 20.66, lon: -156.43, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4065552, slug: 'gulf-shores', lat: 30.25, lon: -87.70, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4503351, slug: 'ocean-city', lat: 39.28, lon: -74.57, country: 'US', locales: ['en', 'es'] },
  { id: 4153188, slug: 'destin', lat: 30.39, lon: -86.50, country: 'US', locales: ['en', 'es'] },
  { id: 5852602, slug: 'princeville', lat: 22.22, lon: -159.48, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5325305, slug: 'avalon', lat: 33.34, lon: -118.33, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4492300, slug: 'sneads-ferry', lat: 34.55, lon: -77.40, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4578801, slug: 'folly-beach', lat: 32.66, lon: -79.94, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4151441, slug: 'cocoa-beach', lat: 28.32, lon: -80.61, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4168176, slug: 'pensacola-beach', lat: 30.33, lon: -87.14, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4581832, slug: 'hilton-head-island', lat: 32.19, lon: -80.74, country: 'US', locales: ['en', 'es'] },
  { id: 5849297, slug: 'kihei', lat: 20.76, lon: -156.45, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4579505, slug: 'garden-city-beach', lat: 33.57, lon: -79.00, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4588718, slug: 'myrtle-beach', lat: 33.69, lon: -78.89, country: 'US', locales: ['en', 'es'] },
  { id: 4163388, slug: 'marco-island', lat: 25.94, lon: -81.72, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4166208, slug: 'north-key-largo', lat: 25.27, lon: -80.32, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4160789, slug: 'key-biscayne', lat: 25.69, lon: -80.16, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4160812, slug: 'key-west', lat: 24.56, lon: -81.78, country: 'US', locales: ['en', 'es'] },
  { id: 4574989, slug: 'clemson', lat: 34.68, lon: -82.84, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5367929, slug: 'long-beach', lat: 33.77, lon: -118.19, country: 'US', locales: ['en', 'es'] },
  { id: 4151871, slug: 'coral-gables', lat: 25.72, lon: -80.27, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4504476, slug: 'toms-river', lat: 39.95, lon: -74.20, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4154568, slug: 'estero', lat: 26.44, lon: -81.81, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 7262761, slug: 'makakilo', lat: 21.35, lon: -158.09, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4499379, slug: 'wilmington', lat: 34.24, lon: -77.95, country: 'US', locales: ['en', 'es'] },
  { id: 4440076, slug: 'oxford', lat: 34.37, lon: -89.52, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4166280, slug: 'north-naples', lat: 26.22, lon: -81.79, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4574324, slug: 'charleston', lat: 32.78, lon: -79.93, country: 'US', locales: ['en', 'es'] },
  { id: 4160610, slug: 'jupiter', lat: 26.93, lon: -80.09, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4176527, slug: 'vineyards', lat: 26.22, lon: -81.73, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5392952, slug: 'santa-barbara', lat: 34.42, lon: -119.70, country: 'US', locales: ['en', 'es'] },
  { id: 5376890, slug: 'newport-beach', lat: 33.62, lon: -117.93, country: 'US', locales: ['en', 'es'] },
  { id: 5105433, slug: 'tinton-falls', lat: 40.30, lon: -74.10, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4834157, slug: 'fairfield', lat: 41.14, lon: -73.26, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4174793, slug: 'tangerine', lat: 28.76, lon: -81.63, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4148411, slug: 'boca-raton', lat: 26.36, lon: -80.08, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5137507, slug: 'seaford', lat: 40.67, lon: -73.49, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4159416, slug: 'hunters-creek', lat: 28.36, lon: -81.42, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5370082, slug: 'manhattan-beach', lat: 33.88, lon: -118.41, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5779334, slug: 'orem', lat: 40.30, lon: -111.69, country: 'US', locales: ['en', 'es'] },
  { id: 4174757, slug: 'tampa', lat: 27.95, lon: -82.46, country: 'US', locales: ['en', 'es'] },
  { id: 4939549, slug: 'hingham', lat: 42.24, lon: -70.89, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5099193, slug: 'holmdel', lat: 40.35, lon: -74.18, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5856195, slug: 'honolulu', lat: 21.31, lon: -157.86, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 5780026, slug: 'provo', lat: 40.23, lon: -111.66, country: 'US', locales: ['en', 'es'] },
  { id: 4850699, slug: 'cedar-falls', lat: 42.53, lon: -92.45, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4893983, slug: 'golf', lat: 42.06, lon: -87.79, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4153132, slug: 'delray-beach', lat: 26.46, lon: -80.07, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5368335, slug: 'los-altos', lat: 37.39, lon: -122.11, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4174715, slug: 'tallahassee', lat: 30.44, lon: -84.28, country: 'US', locales: ['en', 'es'] },
  { id: 5391791, slug: 'san-clemente', lat: 33.43, lon: -117.61, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4807310, slug: 'grafton', lat: 39.34, lon: -80.02, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5223593, slug: 'newport', lat: 41.49, lon: -71.31, country: 'US', locales: ['en', 'es'] },
  { id: 5126183, slug: 'massapequa', lat: 40.68, lon: -73.47, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4152872, slug: 'daytona-beach', lat: 29.21, lon: -81.02, country: 'US', locales: ['en', 'es'] },
  { id: 5113412, slug: 'commack', lat: 40.84, lon: -73.29, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5374920, slug: 'morro-bay', lat: 35.37, lon: -120.85, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4161580, slug: 'largo', lat: 27.91, lon: -82.79, country: 'US', locales: ['en', 'es'] },
  { id: 4167519, slug: 'palm-beach-gardens', lat: 26.82, lon: -80.14, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4145941, slug: 'altamonte-springs', lat: 28.66, lon: -81.37, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4165995, slug: 'niceville', lat: 30.52, lon: -86.48, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5346646, slug: 'encinitas', lat: 33.04, lon: -117.29, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4224413, slug: 'statesboro', lat: 32.45, lon: -81.78, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4535740, slug: 'edmond', lat: 35.65, lon: -97.48, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5313457, slug: 'scottsdale', lat: 33.51, lon: -111.90, country: 'US', locales: ['en', 'es'] },
  { id: 4094455, slug: 'tuscaloosa', lat: 33.21, lon: -87.57, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5777224, slug: 'lehi', lat: 40.39, lon: -111.85, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4682464, slug: 'college-station', lat: 30.63, lon: -96.33, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4747845, slug: 'blacksburg', lat: 37.23, lon: -80.41, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5527554, slug: 'odessa', lat: 31.85, lon: -102.37, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4835395, slug: 'greenwich', lat: 41.03, lon: -73.63, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5779451, slug: 'park-city', lat: 40.65, lon: -111.50, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4862034, slug: 'iowa-city', lat: 41.66, lon: -91.53, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4148533, slug: 'bonita-springs', lat: 26.34, lon: -81.78, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5317058, slug: 'tempe', lat: 33.41, lon: -111.91, country: 'US', locales: ['en', 'es'] },
  { id: 4148708, slug: 'bradenton', lat: 27.50, lon: -82.57, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 8449427, slug: 'howell-township', lat: 40.16, lon: -74.21, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4151316, slug: 'clearwater', lat: 27.97, lon: -82.80, country: 'US', locales: ['en', 'es'] },
  { id: 4167348, slug: 'oviedo', lat: 28.67, lon: -81.21, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4149962, slug: 'cape-coral', lat: 26.56, lon: -81.95, country: 'US', locales: ['en', 'es'] },
  { id: 5261457, slug: 'madison', lat: 43.07, lon: -89.40, country: 'US', locales: ['en', 'es'] },
  { id: 5034059, slug: 'lakeville', lat: 44.65, lon: -93.24, country: 'US', locales: ['en', 'es'] },
  { id: 4156404, slug: 'gainesville', lat: 29.65, lon: -82.32, country: 'US', locales: ['en', 'es'] },
  { id: 5028163, slug: 'golden-valley', lat: 45.01, lon: -93.35, country: 'US', locales: ['en', 'es'] },
  { id: 4171563, slug: 'saint-petersburg', lat: 27.77, lon: -82.68, country: 'US', locales: ['en', 'es'] },
  { id: 4552215, slug: 'stillwater', lat: 36.12, lon: -97.06, country: 'US', locales: ['en', 'es'] },
  { id: 5536630, slug: 'cedar-city', lat: 37.68, lon: -113.06, country: 'US', locales: ['en', 'es'] },
  { id: 4168590, slug: 'pinecrest', lat: 25.67, lon: -80.31, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 7259780, slug: 'four-corners', lat: 28.33, lon: -81.65, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4588165, slug: 'mount-pleasant', lat: 32.79, lon: -79.86, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4146844, slug: 'bay-lake', lat: 28.39, lon: -81.57, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4830796, slug: 'auburn', lat: 32.61, lon: -85.48, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4142412, slug: 'ellendale', lat: 38.81, lon: -75.42, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5546220, slug: 'st-george', lat: 37.10, lon: -113.58, country: 'US', locales: ['en', 'es'] },
  { id: 4164143, slug: 'miami-beach', lat: 25.79, lon: -80.13, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4165565, slug: 'naples', lat: 26.14, lon: -81.80, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4163971, slug: 'melbourne', lat: 28.08, lon: -80.61, country: 'US', locales: ['en', 'es'], priority: 0.8 },
  { id: 4176380, slug: 'venice', lat: 27.10, lon: -82.45, country: 'US', locales: ['en', 'es'] },
  { id: 4153759, slug: 'dunedin', lat: 28.02, lon: -82.77, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 5773066, slug: 'coalville', lat: 40.92, lon: -111.40, country: 'US', locales: ['en', 'es'], priority: 0.5 },
  { id: 4568127, slug: 'san-juan', lat: 18.47, lon: -66.11, country: 'PR', locales: ['en', 'es'] },

  // ── Canada (Google Trends) ────────────────────────────────
  { id: 6115383, slug: 'quispamsis', lat: 45.42, lon: -65.95, country: 'CA', locales: ['en'], priority: 0.5 },
  { id: 5920288, slug: 'charlottetown', lat: 46.23, lon: -63.13, country: 'CA', locales: ['en'], priority: 0.5 },
  { id: 6324733, slug: 'st-johns', lat: 47.56, lon: -52.71, country: 'CA', locales: ['en'], priority: 0.5 },

  // ── Australia (Google Trends) ─────────────────────────────
  { id: 2165087, slug: 'gold-coast', lat: -28.00, lon: 153.43, country: 'AU', locales: ['en'] },
  { id: 10630449, slug: 'sunshine-coast', lat: -26.66, lon: 153.08, country: 'AU', locales: ['en'] },
  { id: 2171507, slug: 'wollongong', lat: -34.42, lon: 150.89, country: 'AU', locales: ['en'] },
  { id: 2172517, slug: 'canberra', lat: -35.28, lon: 149.13, country: 'AU', locales: ['en'] },
  { id: 2152659, slug: 'port-macquarie', lat: -31.43, lon: 152.91, country: 'AU', locales: ['en'] },
  { id: 2165798, slug: 'geelong', lat: -38.15, lon: 144.36, country: 'AU', locales: ['en'] },
  { id: 11746859, slug: 'skinners-shoot', lat: -28.67, lon: 153.59, country: 'AU', locales: ['en'], priority: 0.5 },

  // ── New Zealand (Google Trends) ───────────────────────────
  { id: 2184975, slug: 'papamoa', lat: -37.73, lon: 176.30, country: 'NZ', locales: ['en'], priority: 0.5 },
  { id: 2208032, slug: 'tauranga', lat: -37.69, lon: 176.17, country: 'NZ', locales: ['en'] },
  { id: 2191562, slug: 'dunedin', lat: -45.87, lon: 170.50, country: 'NZ', locales: ['en'], priority: 0.5 },

  // ── United Kingdom (Google Trends) ────────────────────────
  { id: 2649715, slug: 'falmouth', lat: 50.15, lon: -5.07, country: 'GB', locales: ['en'], priority: 0.5 },
  { id: 2652698, slug: 'coalville', lat: 52.72, lon: -1.37, country: 'GB', locales: ['en'], priority: 0.5 },

  // ── Thailand ──────────────────────────────────────────────
  { id: 1117670, slug: 'ban-tai', lat: 9.58, lon: 99.97, country: 'TH', locales: ['en'], priority: 0.5 },
  { id: 1158377, slug: 'ao-nang', lat: 8.05, lon: 98.81, country: 'TH', locales: ['en'], priority: 0.5 },
  { id: 6692610, slug: 'karon', lat: 7.85, lon: 98.29, country: 'TH', locales: ['en'], priority: 0.5 },
  { id: 1154689, slug: 'ko-samui', lat: 9.54, lon: 99.94, country: 'TH', locales: ['en'] },

  // ── Egypt ─────────────────────────────────────────────────
  { id: 361291, slug: 'hurghada', lat: 27.26, lon: 33.81, country: 'EG', locales: ['en'] },
  { id: 349340, slug: 'sharm-el-sheikh', lat: 27.92, lon: 34.33, country: 'EG', locales: ['en'] },

  // ── Costa Rica ────────────────────────────────────────────
  { id: 3622193, slug: 'quepos', lat: 9.43, lon: -84.16, country: 'CR', locales: ['en', 'es'] },

  // ── Dominican Republic ────────────────────────────────────
  { id: 3494242, slug: 'punta-cana', lat: 18.58, lon: -68.40, country: 'DO', locales: ['en', 'es'] },

  // ── Mexico ────────────────────────────────────────────────
  { id: 3985710, slug: 'cabo-san-lucas', lat: 22.89, lon: -109.91, country: 'MX', locales: ['en', 'es'] },

  // ── Finland (#1 in UV search, 0 cities previously) ────────
  { id: 658225, slug: 'helsinki', lat: 60.17, lon: 24.93, country: 'FI', locales: ['en'], priority: 0.8 },
  { id: 660158, slug: 'espoo', lat: 60.21, lon: 24.66, country: 'FI', locales: ['en'] },
  { id: 634963, slug: 'tampere', lat: 61.50, lon: 23.76, country: 'FI', locales: ['en'] },
  { id: 633679, slug: 'turku', lat: 60.45, lon: 22.27, country: 'FI', locales: ['en'] },
  { id: 643492, slug: 'oulu', lat: 65.01, lon: 25.47, country: 'FI', locales: ['en'] },
  { id: 655194, slug: 'jyvaskyla', lat: 62.24, lon: 25.74, country: 'FI', locales: ['en'] },
  { id: 649360, slug: 'lahti', lat: 60.98, lon: 25.66, country: 'FI', locales: ['en'] },
  { id: 650224, slug: 'kuopio', lat: 62.89, lon: 27.68, country: 'FI', locales: ['en'] },
  { id: 638936, slug: 'rovaniemi', lat: 66.50, lon: 25.72, country: 'FI', locales: ['en'] },
  { id: 632978, slug: 'vaasa', lat: 63.10, lon: 21.62, country: 'FI', locales: ['en'] },

  // ── Estonia (#6, 0 cities previously) ────────────────────
  { id: 588409, slug: 'tallinn', lat: 59.44, lon: 24.75, country: 'EE', locales: ['en'], priority: 0.8 },
  { id: 588335, slug: 'tartu', lat: 58.38, lon: 26.73, country: 'EE', locales: ['en'] },
  { id: 590031, slug: 'narva', lat: 59.38, lon: 28.19, country: 'EE', locales: ['en'] },
  { id: 589580, slug: 'parnu', lat: 58.38, lon: 24.50, country: 'EE', locales: ['en'] },
  { id: 587577, slug: 'viljandi', lat: 58.36, lon: 25.60, country: 'EE', locales: ['en'] },

  // ── Croatia (#9, 0 cities previously) ────────────────────
  { id: 3186886, slug: 'zagreb', lat: 45.81, lon: 15.98, country: 'HR', locales: ['en'], priority: 0.8 },
  { id: 3190261, slug: 'split', lat: 43.51, lon: 16.44, country: 'HR', locales: ['en'] },
  { id: 3201047, slug: 'dubrovnik', lat: 42.65, lon: 18.09, country: 'HR', locales: ['en'] },
  { id: 3191648, slug: 'rijeka', lat: 45.34, lon: 14.41, country: 'HR', locales: ['en'] },
  { id: 3186952, slug: 'zadar', lat: 44.12, lon: 15.23, country: 'HR', locales: ['en'] },
  { id: 3193935, slug: 'osijek', lat: 45.56, lon: 18.70, country: 'HR', locales: ['en'] },
  { id: 3192224, slug: 'pula', lat: 44.87, lon: 13.85, country: 'HR', locales: ['en'] },
  { id: 3199180, slug: 'hvar', lat: 43.17, lon: 16.44, country: 'HR', locales: ['en'] },
  { id: 3191518, slug: 'rovinj', lat: 45.08, lon: 13.64, country: 'HR', locales: ['en'] },
  { id: 3195890, slug: 'makarska', lat: 43.30, lon: 17.02, country: 'HR', locales: ['en'] },

  // ── Netherlands (#8, only Amsterdam previously) ───────────
  { id: 2747891, slug: 'rotterdam', lat: 51.92, lon: 4.48, country: 'NL', locales: ['en', 'nl'], priority: 0.8 },
  { id: 2747373, slug: 'the-hague', lat: 52.08, lon: 4.31, country: 'NL', locales: ['en', 'nl'], priority: 0.8 },
  { id: 2745912, slug: 'utrecht', lat: 52.09, lon: 5.11, country: 'NL', locales: ['en', 'nl'] },
  { id: 2756253, slug: 'eindhoven', lat: 51.44, lon: 5.48, country: 'NL', locales: ['en', 'nl'] },
  { id: 2755251, slug: 'groningen', lat: 53.22, lon: 6.57, country: 'NL', locales: ['en', 'nl'] },
  { id: 2746301, slug: 'tilburg', lat: 51.56, lon: 5.08, country: 'NL', locales: ['en', 'nl'] },
  { id: 2759879, slug: 'almere', lat: 52.37, lon: 5.22, country: 'NL', locales: ['en', 'nl'] },
  { id: 2758401, slug: 'breda', lat: 51.59, lon: 4.78, country: 'NL', locales: ['en', 'nl'] },
  { id: 2750053, slug: 'nijmegen', lat: 51.85, lon: 5.87, country: 'NL', locales: ['en', 'nl'] },
  { id: 2759706, slug: 'apeldoorn', lat: 52.21, lon: 5.97, country: 'NL', locales: ['en', 'nl'] },
  { id: 2751773, slug: 'leiden', lat: 52.16, lon: 4.49, country: 'NL', locales: ['en', 'nl'] },
  { id: 2755003, slug: 'haarlem', lat: 52.38, lon: 4.64, country: 'NL', locales: ['en', 'nl'] },
  { id: 2759661, slug: 'arnhem', lat: 51.98, lon: 5.91, country: 'NL', locales: ['en', 'nl'] },
  { id: 2751283, slug: 'maastricht', lat: 50.85, lon: 5.69, country: 'NL', locales: ['en', 'nl'] },
  { id: 2751792, slug: 'leeuwarden', lat: 53.20, lon: 5.81, country: 'NL', locales: ['en', 'nl'] },
  { id: 2759821, slug: 'amersfoort', lat: 52.16, lon: 5.39, country: 'NL', locales: ['en', 'nl'] },
  { id: 2756071, slug: 'enschede', lat: 52.22, lon: 6.90, country: 'NL', locales: ['en', 'nl'] },
  { id: 2757345, slug: 'delft', lat: 52.01, lon: 4.36, country: 'NL', locales: ['en', 'nl'] },
  { id: 2756669, slug: 'dordrecht', lat: 51.81, lon: 4.67, country: 'NL', locales: ['en', 'nl'] },

  // ── Norway (more cities) ──────────────────────────────────
  { id: 3149318, slug: 'kristiansand', lat: 58.15, lon: 8.00, country: 'NO', locales: ['en', 'no'] },
  { id: 3156529, slug: 'fredrikstad', lat: 59.22, lon: 10.96, country: 'NO', locales: ['en', 'no'] },
  { id: 3159016, slug: 'drammen', lat: 59.74, lon: 10.21, country: 'NO', locales: ['en', 'no'] },
  { id: 3163392, slug: 'alesund', lat: 62.47, lon: 6.15, country: 'NO', locales: ['en', 'no'] },
  { id: 3160881, slug: 'bodo', lat: 67.28, lon: 14.38, country: 'NO', locales: ['en', 'no'] },
  { id: 3153623, slug: 'haugesund', lat: 59.41, lon: 5.27, country: 'NO', locales: ['en', 'no'] },

  // ── Denmark (more cities) ─────────────────────────────────
  { id: 2622447, slug: 'esbjerg', lat: 55.47, lon: 8.45, country: 'DK', locales: ['en', 'da'] },
  { id: 2615006, slug: 'randers', lat: 56.46, lon: 10.04, country: 'DK', locales: ['en', 'da'] },
  { id: 2610613, slug: 'vejle', lat: 55.71, lon: 9.54, country: 'DK', locales: ['en', 'da'] },
  { id: 2618528, slug: 'kolding', lat: 55.49, lon: 9.47, country: 'DK', locales: ['en', 'da'] },
  { id: 2619771, slug: 'horsens', lat: 55.86, lon: 9.85, country: 'DK', locales: ['en', 'da'] },
  { id: 2614030, slug: 'silkeborg', lat: 56.17, lon: 9.55, country: 'DK', locales: ['en', 'da'] },
  { id: 2620425, slug: 'herning', lat: 56.14, lon: 8.97, country: 'DK', locales: ['en', 'da'] },

  // ── Ireland (#14, only Dublin previously) ────────────────
  { id: 2965140, slug: 'cork', lat: 51.90, lon: -8.47, country: 'IE', locales: ['en'] },
  { id: 2964180, slug: 'galway', lat: 53.27, lon: -9.05, country: 'IE', locales: ['en'] },
  { id: 2962943, slug: 'limerick', lat: 52.66, lon: -8.63, country: 'IE', locales: ['en'] },
  { id: 2960992, slug: 'waterford', lat: 52.26, lon: -7.12, country: 'IE', locales: ['en'] },

  // ── Belgium (more cities) ─────────────────────────────────
  { id: 2803138, slug: 'antwerp', lat: 51.22, lon: 4.40, country: 'BE', locales: ['en', 'fr', 'nl'] },
  { id: 2797656, slug: 'ghent', lat: 51.05, lon: 3.72, country: 'BE', locales: ['en', 'fr', 'nl'] },
  { id: 2800931, slug: 'bruges', lat: 51.21, lon: 3.22, country: 'BE', locales: ['en', 'fr', 'nl'] },
  { id: 2792413, slug: 'liege', lat: 50.63, lon: 5.57, country: 'BE', locales: ['en', 'fr', 'nl'] },
  { id: 2800481, slug: 'charleroi', lat: 50.41, lon: 4.44, country: 'BE', locales: ['en', 'fr', 'nl'] },
  { id: 2792482, slug: 'leuven', lat: 50.88, lon: 4.70, country: 'BE', locales: ['en', 'nl'] },

  // ── New Zealand (more cities) ─────────────────────────────
  { id: 2179537, slug: 'wellington', lat: -41.29, lon: 174.78, country: 'NZ', locales: ['en'], priority: 0.8 },
  { id: 2192362, slug: 'christchurch', lat: -43.53, lon: 172.64, country: 'NZ', locales: ['en'] },
  { id: 2190324, slug: 'hamilton', lat: -37.79, lon: 175.28, country: 'NZ', locales: ['en'] },
  { id: 6204696, slug: 'queenstown', lat: -45.03, lon: 168.66, country: 'NZ', locales: ['en'] },
  { id: 2186313, slug: 'napier', lat: -39.49, lon: 176.91, country: 'NZ', locales: ['en'] },
  { id: 2185018, slug: 'palmerston-north', lat: -40.36, lon: 175.61, country: 'NZ', locales: ['en'] },
  { id: 2186280, slug: 'nelson', lat: -41.27, lon: 173.28, country: 'NZ', locales: ['en'] },
  { id: 6241325, slug: 'rotorua', lat: -38.14, lon: 176.25, country: 'NZ', locales: ['en'] },

  // ── Australia (more cities) ───────────────────────────────
  { id: 2078025, slug: 'adelaide', lat: -34.93, lon: 138.60, country: 'AU', locales: ['en'] },
  { id: 2163355, slug: 'hobart', lat: -42.88, lon: 147.33, country: 'AU', locales: ['en'] },
  { id: 2073124, slug: 'darwin', lat: -12.46, lon: 130.84, country: 'AU', locales: ['en'] },
  { id: 2172797, slug: 'cairns', lat: -16.92, lon: 145.77, country: 'AU', locales: ['en'] },
  { id: 2146142, slug: 'townsville', lat: -19.27, lon: 146.81, country: 'AU', locales: ['en'] },
  { id: 2155472, slug: 'newcastle', lat: -32.92, lon: 151.78, country: 'AU', locales: ['en'] },
  { id: 2146268, slug: 'toowoomba', lat: -27.56, lon: 151.95, country: 'AU', locales: ['en'] },
  { id: 2160517, slug: 'launceston', lat: -41.44, lon: 147.13, country: 'AU', locales: ['en'] },
  { id: 2176187, slug: 'bendigo', lat: -36.76, lon: 144.28, country: 'AU', locales: ['en'] },
  { id: 2177091, slug: 'ballarat', lat: -37.57, lon: 143.85, country: 'AU', locales: ['en'] },
  { id: 2159220, slug: 'mackay', lat: -21.15, lon: 149.17, country: 'AU', locales: ['en'] },
  { id: 2151437, slug: 'rockhampton', lat: -23.38, lon: 150.51, country: 'AU', locales: ['en'] },

  // ── Canada (more cities) ──────────────────────────────────
  { id: 5946768, slug: 'edmonton', lat: 53.55, lon: -113.49, country: 'CA', locales: ['en'], priority: 0.8 },
  { id: 6183235, slug: 'winnipeg', lat: 49.88, lon: -97.15, country: 'CA', locales: ['en'], priority: 0.8 },
  { id: 6324729, slug: 'halifax', lat: 44.65, lon: -63.57, country: 'CA', locales: ['en'] },
  { id: 6325494, slug: 'quebec-city', lat: 46.82, lon: -71.23, country: 'CA', locales: ['en', 'fr'], priority: 0.8 },
  { id: 6174041, slug: 'victoria', lat: 48.43, lon: -123.37, country: 'CA', locales: ['en'] },

  // ── Singapore (#17, 0 cities previously) ────────────────
  { id: 1880252, slug: 'singapore', lat: 1.29, lon: 103.85, country: 'SG', locales: ['en'], priority: 0.8 },

  // ── Israel (#22, 0 cities previously) ────────────────────
  { id: 293397, slug: 'tel-aviv', lat: 32.08, lon: 34.78, country: 'IL', locales: ['en'], priority: 0.8 },
  { id: 281184, slug: 'jerusalem', lat: 31.77, lon: 35.22, country: 'IL', locales: ['en'] },
  { id: 294801, slug: 'haifa', lat: 32.82, lon: 34.99, country: 'IL', locales: ['en'] },
  { id: 295530, slug: 'beer-sheva', lat: 31.25, lon: 34.79, country: 'IL', locales: ['en'] },
  { id: 295277, slug: 'eilat', lat: 29.56, lon: 34.95, country: 'IL', locales: ['en'] },

  // ── UAE (#26, 0 cities previously) ───────────────────────
  { id: 292223, slug: 'dubai', lat: 25.08, lon: 55.15, country: 'AE', locales: ['en'], priority: 0.8 },
  { id: 292968, slug: 'abu-dhabi', lat: 24.47, lon: 54.37, country: 'AE', locales: ['en'] },
  { id: 292672, slug: 'sharjah', lat: 25.36, lon: 55.39, country: 'AE', locales: ['en'] },

  // ── Serbia (#27, 0 cities previously) ────────────────────
  { id: 792680, slug: 'belgrade', lat: 44.80, lon: 20.47, country: 'RS', locales: ['en'], priority: 0.8 },
  { id: 3194360, slug: 'novi-sad', lat: 45.25, lon: 19.83, country: 'RS', locales: ['en'] },
  { id: 787657, slug: 'nis', lat: 43.32, lon: 21.90, country: 'RS', locales: ['en'] },

  // ── Chile (#28, 0 dedicated cities previously) ───────────
  { id: 3871336, slug: 'santiago', lat: -33.46, lon: -70.65, country: 'CL', locales: ['en', 'es'], priority: 0.8 },
  { id: 3868121, slug: 'vina-del-mar', lat: -33.02, lon: -71.55, country: 'CL', locales: ['en', 'es'] },
  { id: 3893894, slug: 'concepcion', lat: -36.82, lon: -73.04, country: 'CL', locales: ['en', 'es'] },
  { id: 3899539, slug: 'antofagasta', lat: -23.65, lon: -70.40, country: 'CL', locales: ['en', 'es'] },
  { id: 3887127, slug: 'iquique', lat: -20.22, lon: -70.14, country: 'CL', locales: ['en', 'es'] },
  { id: 3884373, slug: 'la-serena', lat: -29.91, lon: -71.25, country: 'CL', locales: ['en', 'es'] },

  // ── Slovakia (#29, 0 cities previously) ──────────────────
  { id: 3060972, slug: 'bratislava', lat: 48.15, lon: 17.11, country: 'SK', locales: ['en'], priority: 0.8 },
  { id: 724443, slug: 'kosice', lat: 48.72, lon: 21.26, country: 'SK', locales: ['en'] },
  { id: 3058531, slug: 'nitra', lat: 48.31, lon: 18.09, country: 'SK', locales: ['en'] },

  // ── Hong Kong (#30, 0 cities previously) ────────────────
  { id: 1819729, slug: 'hong-kong', lat: 22.28, lon: 114.16, country: 'HK', locales: ['en'], priority: 0.8 },

  // ── Czechia (more cities) ─────────────────────────────────
  { id: 3078610, slug: 'brno', lat: 49.19, lon: 16.60, country: 'CZ', locales: ['en'] },
  { id: 3068799, slug: 'ostrava', lat: 49.83, lon: 18.29, country: 'CZ', locales: ['en'] },
  { id: 3068160, slug: 'plzen', lat: 49.75, lon: 13.38, country: 'CZ', locales: ['en'] },

  // ── Hungary (capital, 0 cities previously) ────────────────
  { id: 3054643, slug: 'budapest', lat: 47.50, lon: 19.04, country: 'HU', locales: ['en'], priority: 0.8 },

  // ── Malta ──────────────────────────────────────────────────
  { id: 2562305, slug: 'valletta', lat: 35.90, lon: 14.51, country: 'MT', locales: ['en'] },

  // ── Montenegro ────────────────────────────────────────────
  { id: 3203106, slug: 'budva', lat: 42.29, lon: 18.84, country: 'ME', locales: ['en'] },
  { id: 3197538, slug: 'kotor', lat: 42.42, lon: 18.77, country: 'ME', locales: ['en'] },

  // ── Slovenia ──────────────────────────────────────────────
  { id: 3196359, slug: 'ljubljana', lat: 46.05, lon: 14.51, country: 'SI', locales: ['en'], priority: 0.8 },

  // ── Bulgaria ──────────────────────────────────────────────
  { id: 727011, slug: 'sofia', lat: 42.70, lon: 23.32, country: 'BG', locales: ['en'], priority: 0.8 },
  { id: 726050, slug: 'varna', lat: 43.22, lon: 27.91, country: 'BG', locales: ['en'] },
  { id: 728825, slug: 'nesebar', lat: 42.66, lon: 27.74, country: 'BG', locales: ['en'] },

  // ── Romania ───────────────────────────────────────────────
  { id: 683506, slug: 'bucharest', lat: 44.43, lon: 26.11, country: 'RO', locales: ['en'], priority: 0.8 },
  { id: 681290, slug: 'cluj-napoca', lat: 46.77, lon: 23.60, country: 'RO', locales: ['en'] },

  // ── Spain (more tourist destinations) ─────────────────────
  { id: 2511174, slug: 'santa-cruz-de-tenerife', lat: 28.47, lon: -16.25, country: 'ES', locales: ['en', 'es'] },
  { id: 2515270, slug: 'las-palmas', lat: 28.10, lon: -15.42, country: 'ES', locales: ['en', 'es'] },
  { id: 2516479, slug: 'ibiza', lat: 38.91, lon: 1.43, country: 'ES', locales: ['en', 'es'] },
  { id: 2514169, slug: 'marbella', lat: 36.52, lon: -4.89, country: 'ES', locales: ['en', 'es'] },
  { id: 2517117, slug: 'granada', lat: 37.19, lon: -3.61, country: 'ES', locales: ['en', 'es'] },

  // ── Italy (more tourist destinations) ─────────────────────
  { id: 2525473, slug: 'cagliari', lat: 39.23, lon: 9.12, country: 'IT', locales: ['en', 'it'] },
  { id: 2525068, slug: 'catania', lat: 37.49, lon: 15.07, country: 'IT', locales: ['en', 'it'] },
  { id: 3169361, slug: 'rimini', lat: 44.06, lon: 12.57, country: 'IT', locales: ['en', 'it'] },

  // ── Greece (major tourist islands & cities) ────────────────
  { id: 734077, slug: 'thessaloniki', lat: 40.64, lon: 22.93, country: 'GR', locales: ['en'] },
  { id: 261745, slug: 'heraklion', lat: 35.33, lon: 25.14, country: 'GR', locales: ['en'] },
  { id: 400666, slug: 'rhodes', lat: 36.44, lon: 28.22, country: 'GR', locales: ['en'] },
  { id: 252920, slug: 'santorini', lat: 36.42, lon: 25.43, country: 'GR', locales: ['en'] },
  { id: 257056, slug: 'mykonos', lat: 37.45, lon: 25.33, country: 'GR', locales: ['en'] },
  { id: 2463679, slug: 'corfu', lat: 39.62, lon: 19.92, country: 'GR', locales: ['en'] },

  // ── Portugal (more tourist destinations) ──────────────────
  { id: 2267827, slug: 'funchal', lat: 32.67, lon: -16.93, country: 'PT', locales: ['en', 'pt'] },
  { id: 2267226, slug: 'lagos', lat: 37.10, lon: -8.67, country: 'PT', locales: ['en', 'pt'] },

  // ── France (more tourist destinations) ────────────────────
  { id: 3028808, slug: 'cannes', lat: 43.55, lon: 7.01, country: 'FR', locales: ['en', 'fr'] },
  { id: 2992166, slug: 'montpellier', lat: 43.61, lon: 3.88, country: 'FR', locales: ['en', 'fr'] },
  { id: 3038334, slug: 'ajaccio', lat: 41.92, lon: 8.74, country: 'FR', locales: ['en', 'fr'] },

  // ── Croatia (more tourist spots) ──────────────────────────
  { id: 3190941, slug: 'sibenik', lat: 43.73, lon: 15.89, country: 'HR', locales: ['en'] },

  // ── Brazil ────────────────────────────────────────────────
  { id: 3448439, slug: 'sao-paulo', lat: -23.55, lon: -46.64, country: 'BR', locales: ['en', 'pt'], priority: 0.8 },
  { id: 3451190, slug: 'rio-de-janeiro', lat: -22.91, lon: -43.18, country: 'BR', locales: ['en', 'pt'], priority: 0.8 },
  { id: 3463237, slug: 'florianopolis', lat: -27.60, lon: -48.55, country: 'BR', locales: ['en', 'pt'] },

  // ── Argentina ─────────────────────────────────────────────
  { id: 3435910, slug: 'buenos-aires', lat: -34.61, lon: -58.38, country: 'AR', locales: ['en', 'es'], priority: 0.8 },

  // ── Colombia ──────────────────────────────────────────────
  { id: 3688689, slug: 'bogota', lat: 4.61, lon: -74.08, country: 'CO', locales: ['en', 'es'], priority: 0.8 },
  { id: 3674962, slug: 'medellin', lat: 6.25, lon: -75.57, country: 'CO', locales: ['en', 'es'] },
  { id: 3687238, slug: 'cartagena', lat: 10.40, lon: -75.49, country: 'CO', locales: ['en', 'es'] },

  // ── Peru ──────────────────────────────────────────────────
  { id: 3936456, slug: 'lima', lat: -12.04, lon: -77.03, country: 'PE', locales: ['en', 'es'], priority: 0.8 },
  { id: 3941584, slug: 'cusco', lat: -13.53, lon: -71.97, country: 'PE', locales: ['en', 'es'] },

  // ── Ecuador ───────────────────────────────────────────────
  { id: 3652462, slug: 'quito', lat: -0.23, lon: -78.52, country: 'EC', locales: ['en', 'es'], priority: 0.8 },

  // ── Mexico (more tourist destinations) ────────────────────
  { id: 3531673, slug: 'cancun', lat: 21.17, lon: -86.85, country: 'MX', locales: ['en', 'es'] },
  { id: 3521342, slug: 'playa-del-carmen', lat: 20.63, lon: -87.08, country: 'MX', locales: ['en', 'es'] },
  { id: 3515040, slug: 'tulum', lat: 20.21, lon: -87.46, country: 'MX', locales: ['en', 'es'] },
  { id: 3996322, slug: 'mazatlan', lat: 23.22, lon: -106.42, country: 'MX', locales: ['en', 'es'] },
  { id: 3991328, slug: 'puerto-vallarta', lat: 20.62, lon: -105.23, country: 'MX', locales: ['en', 'es'] },
  { id: 3530103, slug: 'cozumel', lat: 20.50, lon: -86.94, country: 'MX', locales: ['en', 'es'] },
  { id: 3522507, slug: 'oaxaca', lat: 17.06, lon: -96.73, country: 'MX', locales: ['en', 'es'] },

  // ── Panama ────────────────────────────────────────────────
  { id: 3703443, slug: 'panama-city', lat: 8.99, lon: -79.52, country: 'PA', locales: ['en', 'es'], priority: 0.8 },

  // ── Cuba ──────────────────────────────────────────────────
  { id: 3553478, slug: 'havana', lat: 23.13, lon: -82.38, country: 'CU', locales: ['en', 'es'], priority: 0.8 },

  // ── Jamaica ───────────────────────────────────────────────
  { id: 3489460, slug: 'montego-bay', lat: 18.47, lon: -77.92, country: 'JM', locales: ['en'] },

  // ── Bahamas ───────────────────────────────────────────────
  { id: 3571824, slug: 'nassau', lat: 25.06, lon: -77.34, country: 'BS', locales: ['en'] },

  // ── Belize ────────────────────────────────────────────────
  { id: 3582677, slug: 'belize-city', lat: 17.50, lon: -88.20, country: 'BZ', locales: ['en'] },

  // ── Japan ─────────────────────────────────────────────────
  { id: 1850147, slug: 'tokyo', lat: 35.69, lon: 139.69, country: 'JP', locales: ['en'], priority: 0.8 },
  { id: 1853909, slug: 'osaka', lat: 34.69, lon: 135.50, country: 'JP', locales: ['en'] },
  { id: 1857910, slug: 'kyoto', lat: 35.02, lon: 135.75, country: 'JP', locales: ['en'] },

  // ── South Korea ───────────────────────────────────────────
  { id: 1835848, slug: 'seoul', lat: 37.57, lon: 126.98, country: 'KR', locales: ['en'], priority: 0.8 },
  { id: 1838524, slug: 'busan', lat: 35.10, lon: 129.03, country: 'KR', locales: ['en'] },

  // ── Taiwan ────────────────────────────────────────────────
  { id: 1668341, slug: 'taipei', lat: 25.05, lon: 121.53, country: 'TW', locales: ['en'], priority: 0.8 },

  // ── Thailand (more cities) ────────────────────────────────
  { id: 1609350, slug: 'bangkok', lat: 13.75, lon: 100.50, country: 'TH', locales: ['en'], priority: 0.8 },
  { id: 1151254, slug: 'phuket', lat: 7.89, lon: 98.40, country: 'TH', locales: ['en'] },
  { id: 1153671, slug: 'chiang-mai', lat: 18.79, lon: 98.98, country: 'TH', locales: ['en'] },
  { id: 1614295, slug: 'pattaya', lat: 12.93, lon: 100.88, country: 'TH', locales: ['en'] },

  // ── Vietnam ───────────────────────────────────────────────
  { id: 1566083, slug: 'ho-chi-minh-city', lat: 10.82, lon: 106.63, country: 'VN', locales: ['en'], priority: 0.8 },
  { id: 1581130, slug: 'hanoi', lat: 21.02, lon: 105.84, country: 'VN', locales: ['en'], priority: 0.8 },
  { id: 1583992, slug: 'da-nang', lat: 16.07, lon: 108.22, country: 'VN', locales: ['en'] },
  { id: 1572151, slug: 'nha-trang', lat: 12.25, lon: 109.19, country: 'VN', locales: ['en'] },

  // ── Indonesia ─────────────────────────────────────────────
  { id: 1642911, slug: 'jakarta', lat: -6.21, lon: 106.85, country: 'ID', locales: ['en'], priority: 0.8 },
  { id: 1645528, slug: 'denpasar', lat: -8.65, lon: 115.22, country: 'ID', locales: ['en'] },
  { id: 1622846, slug: 'ubud', lat: -8.51, lon: 115.27, country: 'ID', locales: ['en'], priority: 0.5 },

  // ── Philippines ───────────────────────────────────────────
  { id: 1701668, slug: 'manila', lat: 14.60, lon: 120.98, country: 'PH', locales: ['en'], priority: 0.8 },

  // ── Malaysia ──────────────────────────────────────────────
  { id: 1735161, slug: 'kuala-lumpur', lat: 3.14, lon: 101.69, country: 'MY', locales: ['en'], priority: 0.8 },

  // ── Cambodia ──────────────────────────────────────────────
  { id: 1821306, slug: 'phnom-penh', lat: 11.56, lon: 104.92, country: 'KH', locales: ['en'], priority: 0.8 },

  // ── Sri Lanka ─────────────────────────────────────────────
  { id: 1248991, slug: 'colombo', lat: 6.94, lon: 79.85, country: 'LK', locales: ['en'], priority: 0.8 },

  // ── India ─────────────────────────────────────────────────
  { id: 1275339, slug: 'mumbai', lat: 19.07, lon: 72.88, country: 'IN', locales: ['en'], priority: 0.8 },
  { id: 1261481, slug: 'new-delhi', lat: 28.62, lon: 77.21, country: 'IN', locales: ['en'], priority: 0.8 },
  { id: 1253367, slug: 'goa', lat: 15.40, lon: 73.82, country: 'IN', locales: ['en'] },

  // ── Maldives ──────────────────────────────────────────────
  { id: 1282027, slug: 'male', lat: 4.18, lon: 73.51, country: 'MV', locales: ['en'] },

  // ── Turkey (more tourist destinations) ────────────────────
  { id: 323777, slug: 'antalya', lat: 36.91, lon: 30.70, country: 'TR', locales: ['en'] },
  { id: 320995, slug: 'bodrum', lat: 37.04, lon: 27.43, country: 'TR', locales: ['en'] },
  { id: 314967, slug: 'fethiye', lat: 36.64, lon: 29.13, country: 'TR', locales: ['en'] },

  // ── Morocco ───────────────────────────────────────────────
  { id: 2553604, slug: 'casablanca', lat: 33.59, lon: -7.61, country: 'MA', locales: ['en', 'fr'], priority: 0.8 },
  { id: 2542997, slug: 'marrakesh', lat: 31.63, lon: -8.00, country: 'MA', locales: ['en', 'fr'] },
  { id: 2561668, slug: 'agadir', lat: 30.42, lon: -9.60, country: 'MA', locales: ['en', 'fr'] },

  // ── Jordan ────────────────────────────────────────────────
  { id: 250441, slug: 'amman', lat: 31.96, lon: 35.95, country: 'JO', locales: ['en'], priority: 0.8 },

  // ── Qatar ─────────────────────────────────────────────────
  { id: 290030, slug: 'doha', lat: 25.29, lon: 51.53, country: 'QA', locales: ['en'], priority: 0.8 },

  // ── Oman ──────────────────────────────────────────────────
  { id: 287286, slug: 'muscat', lat: 23.58, lon: 58.41, country: 'OM', locales: ['en'], priority: 0.8 },

  // ── Georgia ───────────────────────────────────────────────
  { id: 611717, slug: 'tbilisi', lat: 41.69, lon: 44.83, country: 'GE', locales: ['en'], priority: 0.8 },

  // ── Azerbaijan ────────────────────────────────────────────
  { id: 587084, slug: 'baku', lat: 40.38, lon: 49.89, country: 'AZ', locales: ['en'], priority: 0.8 },

  // ── Latvia ────────────────────────────────────────────────
  { id: 456172, slug: 'riga', lat: 56.95, lon: 24.11, country: 'LV', locales: ['en'], priority: 0.8 },

  // ── Lithuania ─────────────────────────────────────────────
  { id: 593116, slug: 'vilnius', lat: 54.69, lon: 25.28, country: 'LT', locales: ['en'], priority: 0.8 },

  // ── Kenya ─────────────────────────────────────────────────
  { id: 184745, slug: 'nairobi', lat: -1.28, lon: 36.82, country: 'KE', locales: ['en'], priority: 0.8 },

  // ── South Africa ──────────────────────────────────────────
  { id: 3369157, slug: 'cape-town', lat: -33.93, lon: 18.42, country: 'ZA', locales: ['en'], priority: 0.8 },
  { id: 993800, slug: 'johannesburg', lat: -26.20, lon: 28.04, country: 'ZA', locales: ['en'], priority: 0.8 },

  // ── Tanzania ──────────────────────────────────────────────
  { id: 148730, slug: 'zanzibar', lat: -6.16, lon: 39.20, country: 'TZ', locales: ['en'] },

  // ── Mauritius ─────────────────────────────────────────────
  { id: 934154, slug: 'port-louis', lat: -20.16, lon: 57.50, country: 'MU', locales: ['en', 'fr'] },

  // ── Seychelles ────────────────────────────────────────────
  { id: 241131, slug: 'victoria-seychelles', lat: -4.62, lon: 55.45, country: 'SC', locales: ['en'] },

  // ── Uzbekistan ────────────────────────────────────────────
  { id: 1512569, slug: 'tashkent', lat: 41.26, lon: 69.22, country: 'UZ', locales: ['en'], priority: 0.8 },

  // ── Kazakhstan ────────────────────────────────────────────
  { id: 1526384, slug: 'almaty', lat: 43.25, lon: 76.91, country: 'KZ', locales: ['en'] },

  // ── Italy (more tourist spots) ────────────────────────────
  { id: 3172087, slug: 'olbia', lat: 40.92, lon: 9.50, country: 'IT', locales: ['en', 'it'] },
  { id: 2522975, slug: 'taormina', lat: 37.85, lon: 15.29, country: 'IT', locales: ['en', 'it'], priority: 0.5 },
  { id: 3166350, slug: 'sorrento', lat: 40.63, lon: 14.38, country: 'IT', locales: ['en', 'it'], priority: 0.5 },

  // ── Spain (Canary/Balearic extras) ────────────────────────
  { id: 2521570, slug: 'arrecife', lat: 28.96, lon: -13.55, country: 'ES', locales: ['en', 'es'] },
  { id: 2512186, slug: 'puerto-del-rosario', lat: 28.50, lon: -13.86, country: 'ES', locales: ['en', 'es'] },

  // ── United States (major cities gap fill) ─────────────────
  { id: 4671654, slug: 'austin', lat: 30.27, lon: -97.74, country: 'US', locales: ['en', 'es'] },
  { id: 4167147, slug: 'orlando', lat: 28.54, lon: -81.38, country: 'US', locales: ['en', 'es'] },
  { id: 4644585, slug: 'nashville', lat: 36.17, lon: -86.78, country: 'US', locales: ['en', 'es'] },
  { id: 4460243, slug: 'charlotte', lat: 35.23, lon: -80.84, country: 'US', locales: ['en', 'es'] },
  { id: 5746545, slug: 'portland', lat: 45.52, lon: -122.68, country: 'US', locales: ['en', 'es'] },
  { id: 5389489, slug: 'sacramento', lat: 38.58, lon: -121.49, country: 'US', locales: ['en', 'es'] },
  { id: 5780993, slug: 'salt-lake-city', lat: 40.76, lon: -111.89, country: 'US', locales: ['en', 'es'] },
  { id: 5037649, slug: 'minneapolis', lat: 44.98, lon: -93.27, country: 'US', locales: ['en', 'es'] },
  { id: 5318313, slug: 'tucson', lat: 32.22, lon: -110.93, country: 'US', locales: ['en', 'es'] },
  { id: 4221552, slug: 'savannah', lat: 32.08, lon: -81.09, country: 'US', locales: ['en', 'es'] },

  // ── Saudi Arabia ──────────────────────────────────────────
  { id: 105343, slug: 'jeddah', lat: 21.49, lon: 39.19, country: 'SA', locales: ['en'], priority: 0.8 },
  { id: 108410, slug: 'riyadh', lat: 24.69, lon: 46.72, country: 'SA', locales: ['en'], priority: 0.8 },

  // ── Ghana ─────────────────────────────────────────────────
  { id: 2306104, slug: 'accra', lat: 5.56, lon: -0.20, country: 'GH', locales: ['en'], priority: 0.8 },

  // ── Nigeria ───────────────────────────────────────────────
  { id: 2332459, slug: 'lagos', lat: 6.45, lon: 3.40, country: 'NG', locales: ['en'], priority: 0.8 },

  // ── Senegal ───────────────────────────────────────────────
  { id: 2253354, slug: 'dakar', lat: 14.69, lon: -17.44, country: 'SN', locales: ['en', 'fr'], priority: 0.8 },

  // ── Tunisia ───────────────────────────────────────────────
  { id: 2464470, slug: 'tunis', lat: 36.81, lon: 10.18, country: 'TN', locales: ['en', 'fr'], priority: 0.8 },

  // ── Aruba ─────────────────────────────────────────────────
  { id: 3577154, slug: 'oranjestad', lat: 12.52, lon: -70.03, country: 'AW', locales: ['en', 'nl'] },

  // ── Barbados ──────────────────────────────────────────────
  { id: 3374036, slug: 'bridgetown', lat: 13.10, lon: -59.62, country: 'BB', locales: ['en'] },

  // ── Fiji ──────────────────────────────────────────────────
  { id: 2202064, slug: 'nadi', lat: -17.80, lon: 177.42, country: 'FJ', locales: ['en'] },

  // ── Cambodia (more cities) ────────────────────────────────
  { id: 1822214, slug: 'siem-reap', lat: 13.36, lon: 103.86, country: 'KH', locales: ['en'] },
];


/** Get all unique city objects */
export function getAllCities(): City[] {
  return cities;
}
