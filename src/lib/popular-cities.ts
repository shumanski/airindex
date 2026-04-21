export interface PopularCity {
  name: string;
  geoId: number;
  lat: number;
  lon: number;
  country?: string; // ISO 2-letter for continent page country grouping
}

export const POPULAR_CITIES: Record<string, PopularCity[]> = {
  europe: [
    { name: 'London', geoId: 2643743, lat: 51.51, lon: -0.13, country: 'GB' },
    { name: 'Birmingham', geoId: 2655603, lat: 52.48, lon: -1.89, country: 'GB' },
    { name: 'Paris', geoId: 2988507, lat: 48.85, lon: 2.35, country: 'FR' },
    { name: 'Marseille', geoId: 2995469, lat: 43.3, lon: 5.38, country: 'FR' },
    { name: 'Barcelona', geoId: 3128760, lat: 41.39, lon: 2.16, country: 'ES' },
    { name: 'Madrid', geoId: 3117735, lat: 40.42, lon: -3.7, country: 'ES' },
    { name: 'Berlin', geoId: 2950159, lat: 52.52, lon: 13.41, country: 'DE' },
    { name: 'Munich', geoId: 2867714, lat: 48.14, lon: 11.58, country: 'DE' },
    { name: 'Hamburg', geoId: 2911298, lat: 53.55, lon: 9.99, country: 'DE' },
    { name: 'Cologne', geoId: 2886242, lat: 50.93, lon: 6.95, country: 'DE' },
    { name: 'Rome', geoId: 3169070, lat: 41.89, lon: 12.51, country: 'IT' },
    { name: 'Milan', geoId: 3173435, lat: 45.46, lon: 9.19, country: 'IT' },
    { name: 'Naples', geoId: 3172394, lat: 40.85, lon: 14.27, country: 'IT' },
    { name: 'Amsterdam', geoId: 2759794, lat: 52.37, lon: 4.89, country: 'NL' },
    { name: 'Rotterdam', geoId: 2747891, lat: 51.92, lon: 4.48, country: 'NL' },
    { name: 'Stockholm', geoId: 2673730, lat: 59.33, lon: 18.07, country: 'SE' },
    { name: 'Gothenburg', geoId: 2711537, lat: 57.71, lon: 11.97, country: 'SE' },
    { name: 'Athens', geoId: 264371, lat: 37.98, lon: 23.73, country: 'GR' },
    { name: 'Thessaloniki', geoId: 734077, lat: 40.64, lon: 22.93, country: 'GR' },
    { name: 'Lisbon', geoId: 2267057, lat: 38.73, lon: -9.15, country: 'PT' },
    { name: 'Porto', geoId: 2735943, lat: 41.15, lon: -8.61, country: 'PT' },
    { name: 'Vienna', geoId: 2761369, lat: 48.21, lon: 16.37, country: 'AT' },
    { name: 'Graz', geoId: 2778067, lat: 47.07, lon: 15.44, country: 'AT' },
    { name: 'Prague', geoId: 3067696, lat: 50.09, lon: 14.42, country: 'CZ' },
    { name: 'Brno', geoId: 3078610, lat: 49.2, lon: 16.61, country: 'CZ' },
    { name: 'Copenhagen', geoId: 2618425, lat: 55.68, lon: 12.57, country: 'DK' },
    { name: 'Aarhus', geoId: 2624652, lat: 56.16, lon: 10.21, country: 'DK' },
    { name: 'Oslo', geoId: 3143244, lat: 59.91, lon: 10.75, country: 'NO' },
    { name: 'Bergen', geoId: 3161732, lat: 60.39, lon: 5.32, country: 'NO' },
    { name: 'Dublin', geoId: 2964574, lat: 53.33, lon: -6.25, country: 'IE' },
    { name: 'Cork', geoId: 2965140, lat: 51.9, lon: -8.47, country: 'IE' },
    { name: 'Warsaw', geoId: 756135, lat: 52.23, lon: 21.01, country: 'PL' },
    { name: 'Kraków', geoId: 3094802, lat: 50.06, lon: 19.94, country: 'PL' },
    { name: 'Budapest', geoId: 3054643, lat: 47.5, lon: 19.04, country: 'HU' },
    { name: 'Debrecen', geoId: 721472, lat: 47.53, lon: 21.62, country: 'HU' },
    { name: 'Brussels', geoId: 2800866, lat: 50.85, lon: 4.35, country: 'BE' },
    { name: 'Antwerp', geoId: 2803138, lat: 51.22, lon: 4.4, country: 'BE' },
    { name: 'Bucharest', geoId: 683506, lat: 44.43, lon: 26.11, country: 'RO' },
    { name: 'Cluj-Napoca', geoId: 681290, lat: 46.77, lon: 23.6, country: 'RO' },
    { name: 'Helsinki', geoId: 658225, lat: 60.17, lon: 24.94, country: 'FI' },
    { name: 'Tampere', geoId: 634963, lat: 61.5, lon: 23.79, country: 'FI' },
    { name: 'Zürich', geoId: 2657896, lat: 47.37, lon: 8.55, country: 'CH' },
    { name: 'Geneva', geoId: 2660646, lat: 46.2, lon: 6.15, country: 'CH' },
    { name: 'Sofia', geoId: 727011, lat: 42.7, lon: 23.32, country: 'BG' },
    { name: 'Plovdiv', geoId: 728193, lat: 42.15, lon: 24.75, country: 'BG' },
    { name: 'Belgrade', geoId: 792680, lat: 44.8, lon: 20.47, country: 'RS' },
    { name: 'Niš', geoId: 787657, lat: 43.32, lon: 21.9, country: 'RS' },
    { name: 'Zagreb', geoId: 3186886, lat: 45.81, lon: 15.98, country: 'HR' },
    { name: 'Split', geoId: 3190261, lat: 43.51, lon: 16.44, country: 'HR' },
    { name: 'Moscow', geoId: 524901, lat: 55.75, lon: 37.62, country: 'RU' },
    { name: 'Saint Petersburg', geoId: 498817, lat: 59.94, lon: 30.31, country: 'RU' },
    { name: 'Kyiv', geoId: 703448, lat: 50.45, lon: 30.52, country: 'UA' },
    { name: 'Kharkiv', geoId: 706483, lat: 49.98, lon: 36.25, country: 'UA' },
    { name: 'Bratislava', geoId: 3060972, lat: 48.15, lon: 17.11, country: 'SK' },
    { name: 'Košice', geoId: 724443, lat: 48.71, lon: 21.26, country: 'SK' },
    { name: 'Vilnius', geoId: 593116, lat: 54.69, lon: 25.28, country: 'LT' },
    { name: 'Kaunas', geoId: 598316, lat: 54.9, lon: 23.91, country: 'LT' },
    { name: 'Riga', geoId: 456172, lat: 56.95, lon: 24.11, country: 'LV' },
    { name: 'Daugavpils', geoId: 460413, lat: 55.88, lon: 26.53, country: 'LV' },
    { name: 'Tallinn', geoId: 588409, lat: 59.44, lon: 24.75, country: 'EE' },
    { name: 'Tartu', geoId: 588335, lat: 58.38, lon: 26.72, country: 'EE' },
    { name: 'Ljubljana', geoId: 3196359, lat: 46.05, lon: 14.51, country: 'SI' },
    { name: 'Maribor', geoId: 3195506, lat: 46.56, lon: 15.65, country: 'SI' },
    { name: 'Tirana', geoId: 3183875, lat: 41.33, lon: 19.82, country: 'AL' },
    { name: 'Durrës', geoId: 3185728, lat: 41.32, lon: 19.45, country: 'AL' },
    { name: 'Sarajevo', geoId: 3191281, lat: 43.85, lon: 18.36, country: 'BA' },
    { name: 'Banja Luka', geoId: 3204541, lat: 44.78, lon: 17.21, country: 'BA' },
    { name: 'Nicosia', geoId: 146268, lat: 35.17, lon: 33.35, country: 'CY' },
    { name: 'Limassol', geoId: 146384, lat: 34.68, lon: 33.04, country: 'CY' },
    { name: 'Reykjavik', geoId: 3413829, lat: 64.14, lon: -21.9, country: 'IS' },
    { name: 'Minsk', geoId: 625144, lat: 53.9, lon: 27.57, country: 'BY' },
    { name: 'Gomel', geoId: 627907, lat: 52.43, lon: 30.98, country: 'BY' },
    { name: 'Valletta', geoId: 2562305, lat: 35.9, lon: 14.51, country: 'MT' },
    { name: 'Luxembourg', geoId: 2960316, lat: 49.61, lon: 6.13, country: 'LU' },
    { name: 'Chișinău', geoId: 618426, lat: 47.01, lon: 28.86, country: 'MD' },
  ],
  northAmerica: [
    { name: 'New York', geoId: 5128581, lat: 40.71, lon: -74.01, country: 'US' },
    { name: 'Los Angeles', geoId: 5368361, lat: 34.05, lon: -118.24, country: 'US' },
    { name: 'Chicago', geoId: 4887398, lat: 41.85, lon: -87.65, country: 'US' },
    { name: 'Houston', geoId: 4699066, lat: 29.76, lon: -95.36, country: 'US' },
    { name: 'Phoenix', geoId: 5308655, lat: 33.45, lon: -112.07, country: 'US' },
    { name: 'Miami', geoId: 4164138, lat: 25.77, lon: -80.19, country: 'US' },
    { name: 'Dallas', geoId: 4684888, lat: 32.78, lon: -96.81, country: 'US' },
    { name: 'Philadelphia', geoId: 4560349, lat: 39.95, lon: -75.16, country: 'US' },
    { name: 'San Diego', geoId: 5391811, lat: 32.72, lon: -117.16, country: 'US' },
    { name: 'San Antonio', geoId: 4726206, lat: 29.42, lon: -98.49, country: 'US' },
    { name: 'San Jose', geoId: 5392171, lat: 37.34, lon: -121.89, country: 'US' },
    { name: 'Jacksonville', geoId: 4160021, lat: 30.33, lon: -81.66, country: 'US' },
    { name: 'Toronto', geoId: 6167865, lat: 43.71, lon: -79.4, country: 'CA' },
    { name: 'Montreal', geoId: 6077243, lat: 45.51, lon: -73.59, country: 'CA' },
    { name: 'Vancouver', geoId: 6173331, lat: 49.25, lon: -123.12, country: 'CA' },
    { name: 'Calgary', geoId: 5913490, lat: 51.05, lon: -114.09, country: 'CA' },
    { name: 'Ottawa', geoId: 6094817, lat: 45.41, lon: -75.7, country: 'CA' },
    { name: 'Mexico City', geoId: 3530597, lat: 19.43, lon: -99.13, country: 'MX' },
    { name: 'Guadalajara', geoId: 4005539, lat: 20.68, lon: -103.35, country: 'MX' },
    { name: 'Monterrey', geoId: 3995465, lat: 25.68, lon: -100.32, country: 'MX' },
    { name: 'Havana', geoId: 3553478, lat: 23.13, lon: -82.38, country: 'CU' },
    { name: 'Santiago de Cuba', geoId: 3536729, lat: 20.02, lon: -75.82, country: 'CU' },
    { name: 'Santo Domingo', geoId: 3492908, lat: 18.47, lon: -69.89, country: 'DO' },
    { name: 'Santiago de los Caballeros', geoId: 3492914, lat: 19.45, lon: -70.69, country: 'DO' },
  ],
  southAmerica: [
    { name: 'São Paulo', geoId: 3448439, lat: -23.55, lon: -46.64, country: 'BR' },
    { name: 'Rio de Janeiro', geoId: 3451190, lat: -22.91, lon: -43.18, country: 'BR' },
    { name: 'Salvador', geoId: 3450554, lat: -12.98, lon: -38.49, country: 'BR' },
    { name: 'Brasília', geoId: 3469058, lat: -15.78, lon: -47.93, country: 'BR' },
    { name: 'Fortaleza', geoId: 3399415, lat: -3.72, lon: -38.54, country: 'BR' },
    { name: 'Belo Horizonte', geoId: 3470127, lat: -19.92, lon: -43.94, country: 'BR' },
    { name: 'Porto Alegre', geoId: 3452925, lat: -30.03, lon: -51.23, country: 'BR' },
    { name: 'Buenos Aires', geoId: 3435910, lat: -34.61, lon: -58.38, country: 'AR' },
    { name: 'Córdoba', geoId: 3860259, lat: -31.41, lon: -64.19, country: 'AR' },
    { name: 'Rosario', geoId: 3838583, lat: -32.95, lon: -60.64, country: 'AR' },
    { name: 'Lima', geoId: 3936456, lat: -12.04, lon: -77.03, country: 'PE' },
    { name: 'Arequipa', geoId: 3947322, lat: -16.4, lon: -71.54, country: 'PE' },
    { name: 'Bogotá', geoId: 3688689, lat: 4.61, lon: -74.08, country: 'CO' },
    { name: 'Medellín', geoId: 3674962, lat: 6.25, lon: -75.57, country: 'CO' },
    { name: 'Cali', geoId: 3687925, lat: 3.43, lon: -76.52, country: 'CO' },
    { name: 'Barranquilla', geoId: 3689147, lat: 10.97, lon: -74.78, country: 'CO' },
    { name: 'Santiago', geoId: 3871336, lat: -33.46, lon: -70.65, country: 'CL' },
    { name: 'Valparaíso', geoId: 3868626, lat: -33.04, lon: -71.63, country: 'CL' },
    { name: 'Quito', geoId: 3652462, lat: -0.23, lon: -78.52, country: 'EC' },
    { name: 'Guayaquil', geoId: 3657509, lat: -2.2, lon: -79.89, country: 'EC' },
    { name: 'Caracas', geoId: 3646738, lat: 10.49, lon: -66.88, country: 'VE' },
    { name: 'Maracaibo', geoId: 3633009, lat: 10.64, lon: -71.61, country: 'VE' },
    { name: 'Montevideo', geoId: 3441575, lat: -34.9, lon: -56.19, country: 'UY' },
    { name: 'Salto', geoId: 3440714, lat: -31.39, lon: -57.96, country: 'UY' },
    { name: 'Asunción', geoId: 3439389, lat: -25.29, lon: -57.65, country: 'PY' },
    { name: 'Ciudad del Este', geoId: 3439101, lat: -25.5, lon: -54.65, country: 'PY' },
    { name: 'La Paz', geoId: 3911925, lat: -16.5, lon: -68.15, country: 'BO' },
    { name: 'Santa Cruz de la Sierra', geoId: 3904906, lat: -17.79, lon: -63.18, country: 'BO' },
  ],
  asia: [
    { name: 'Tokyo', geoId: 1850147, lat: 35.69, lon: 139.69, country: 'JP' },
    { name: 'Osaka', geoId: 1853909, lat: 34.69, lon: 135.5, country: 'JP' },
    { name: 'Bangkok', geoId: 1609350, lat: 13.75, lon: 100.5, country: 'TH' },
    { name: 'Chiang Mai', geoId: 1153671, lat: 18.79, lon: 98.98, country: 'TH' },
    { name: 'Seoul', geoId: 1835848, lat: 37.57, lon: 126.98, country: 'KR' },
    { name: 'Busan', geoId: 1838524, lat: 35.1, lon: 129.03, country: 'KR' },
    { name: 'Singapore', geoId: 1880252, lat: 1.29, lon: 103.85, country: 'SG' },
    { name: 'Hong Kong', geoId: 1819729, lat: 22.28, lon: 114.17, country: 'HK' },
    { name: 'Dubai', geoId: 292223, lat: 25.08, lon: 55.31, country: 'AE' },
    { name: 'Abu Dhabi', geoId: 292968, lat: 24.45, lon: 54.4, country: 'AE' },
    { name: 'Mumbai', geoId: 1275339, lat: 19.07, lon: 72.88, country: 'IN' },
    { name: 'Delhi', geoId: 1273294, lat: 28.65, lon: 77.23, country: 'IN' },
    { name: 'Bengaluru', geoId: 1277333, lat: 12.97, lon: 77.59, country: 'IN' },
    { name: 'Kolkata', geoId: 1275004, lat: 22.56, lon: 88.36, country: 'IN' },
    { name: 'Chennai', geoId: 1264527, lat: 13.09, lon: 80.28, country: 'IN' },
    { name: 'Shanghai', geoId: 1796236, lat: 31.22, lon: 121.46, country: 'CN' },
    { name: 'Beijing', geoId: 1816670, lat: 39.91, lon: 116.4, country: 'CN' },
    { name: 'Shenzhen', geoId: 1795565, lat: 22.55, lon: 114.07, country: 'CN' },
    { name: 'Guangzhou', geoId: 1809858, lat: 23.12, lon: 113.25, country: 'CN' },
    { name: 'Istanbul', geoId: 745044, lat: 41.01, lon: 28.95, country: 'TR' },
    { name: 'Ankara', geoId: 323786, lat: 39.92, lon: 32.85, country: 'TR' },
    { name: 'Karachi', geoId: 1174872, lat: 24.86, lon: 67.01, country: 'PK' },
    { name: 'Lahore', geoId: 1172451, lat: 31.56, lon: 74.35, country: 'PK' },
    { name: 'Dhaka', geoId: 1185241, lat: 23.71, lon: 90.41, country: 'BD' },
    { name: 'Chattogram', geoId: 1205733, lat: 22.34, lon: 91.83, country: 'BD' },
    { name: 'Jakarta', geoId: 1642911, lat: -6.21, lon: 106.85, country: 'ID' },
    { name: 'Surabaya', geoId: 1625822, lat: -7.25, lon: 112.75, country: 'ID' },
    { name: 'Ho Chi Minh City', geoId: 1566083, lat: 10.82, lon: 106.63, country: 'VN' },
    { name: 'Hanoi', geoId: 1581130, lat: 21.02, lon: 105.84, country: 'VN' },
    { name: 'Taipei', geoId: 1668341, lat: 25.05, lon: 121.53, country: 'TW' },
    { name: 'Kaohsiung', geoId: 1673820, lat: 22.62, lon: 120.31, country: 'TW' },
    { name: 'Tehran', geoId: 112931, lat: 35.69, lon: 51.42, country: 'IR' },
    { name: 'Mashhad', geoId: 124665, lat: 36.3, lon: 59.61, country: 'IR' },
    { name: 'Riyadh', geoId: 108410, lat: 24.69, lon: 46.72, country: 'SA' },
    { name: 'Jeddah', geoId: 105343, lat: 21.49, lon: 39.19, country: 'SA' },
    { name: 'Baghdad', geoId: 98182, lat: 33.34, lon: 44.4, country: 'IQ' },
    { name: 'Erbil', geoId: 95446, lat: 36.19, lon: 44.01, country: 'IQ' },
    { name: 'Kabul', geoId: 1138958, lat: 34.53, lon: 69.17, country: 'AF' },
    { name: 'Herat', geoId: 1140026, lat: 34.35, lon: 62.2, country: 'AF' },
    { name: 'Yangon', geoId: 1298824, lat: 16.81, lon: 96.16, country: 'MM' },
    { name: 'Mandalay', geoId: 1311874, lat: 21.97, lon: 96.08, country: 'MM' },
    { name: 'Manila', geoId: 1701668, lat: 14.6, lon: 120.98, country: 'PH' },
    { name: 'Cebu City', geoId: 1717512, lat: 10.32, lon: 123.89, country: 'PH' },
    { name: 'Kuala Lumpur', geoId: 1735161, lat: 3.14, lon: 101.69, country: 'MY' },
    { name: 'Johor Bahru', geoId: 1732752, lat: 1.47, lon: 103.76, country: 'MY' },
    { name: 'Kathmandu', geoId: 1283240, lat: 27.7, lon: 85.32, country: 'NP' },
    { name: 'Pokhara', geoId: 1282898, lat: 28.27, lon: 83.97, country: 'NP' },
    { name: 'Colombo', geoId: 1248991, lat: 6.94, lon: 79.85, country: 'LK' },
    { name: 'Kandy', geoId: 1241622, lat: 7.29, lon: 80.63, country: 'LK' },
    { name: 'Phnom Penh', geoId: 1821306, lat: 11.56, lon: 104.92, country: 'KH' },
    { name: 'Siem Reap', geoId: 1822214, lat: 13.36, lon: 103.86, country: 'KH' },
    { name: 'Tel Aviv', geoId: 293397, lat: 32.08, lon: 34.78, country: 'IL' },
    { name: 'Jerusalem', geoId: 281184, lat: 31.77, lon: 35.22, country: 'IL' },
    { name: 'Amman', geoId: 250441, lat: 31.96, lon: 35.95, country: 'JO' },
    { name: 'Kuwait City', geoId: 285787, lat: 29.37, lon: 47.97, country: 'KW' },
    { name: 'Doha', geoId: 290030, lat: 25.29, lon: 51.53, country: 'QA' },
    { name: 'Tbilisi', geoId: 611717, lat: 41.69, lon: 44.83, country: 'GE' },
    { name: 'Batumi', geoId: 615532, lat: 41.64, lon: 41.63, country: 'GE' },
    { name: 'Tashkent', geoId: 1512569, lat: 41.26, lon: 69.22, country: 'UZ' },
    { name: 'Samarkand', geoId: 1216265, lat: 39.65, lon: 66.96, country: 'UZ' },
  ],
  africa: [
    { name: 'Cairo', geoId: 360630, lat: 30.06, lon: 31.25, country: 'EG' },
    { name: 'Alexandria', geoId: 361058, lat: 31.2, lon: 29.92, country: 'EG' },
    { name: 'Lagos', geoId: 2332459, lat: 6.45, lon: 3.39, country: 'NG' },
    { name: 'Abuja', geoId: 2352778, lat: 9.06, lon: 7.5, country: 'NG' },
    { name: 'Kano', geoId: 2335204, lat: 12.0, lon: 8.52, country: 'NG' },
    { name: 'Johannesburg', geoId: 993800, lat: -26.2, lon: 28.04, country: 'ZA' },
    { name: 'Cape Town', geoId: 3369157, lat: -33.93, lon: 18.42, country: 'ZA' },
    { name: 'Durban', geoId: 1007311, lat: -29.86, lon: 31.03, country: 'ZA' },
    { name: 'Nairobi', geoId: 184745, lat: -1.28, lon: 36.82, country: 'KE' },
    { name: 'Mombasa', geoId: 186301, lat: -4.05, lon: 39.66, country: 'KE' },
    { name: 'Casablanca', geoId: 2553604, lat: 33.59, lon: -7.61, country: 'MA' },
    { name: 'Rabat', geoId: 2538475, lat: 34.01, lon: -6.83, country: 'MA' },
    { name: 'Algiers', geoId: 2507480, lat: 36.73, lon: 3.09, country: 'DZ' },
    { name: 'Oran', geoId: 2485926, lat: 35.7, lon: -0.64, country: 'DZ' },
    { name: 'Dakar', geoId: 2253354, lat: 14.69, lon: -17.44, country: 'SN' },
    { name: 'Touba', geoId: 2244322, lat: 14.86, lon: -15.88, country: 'SN' },
    { name: 'Kinshasa', geoId: 2314302, lat: -4.33, lon: 15.31, country: 'CD' },
    { name: 'Lubumbashi', geoId: 922704, lat: -11.66, lon: 27.48, country: 'CD' },
    { name: 'Dar es Salaam', geoId: 160263, lat: -6.82, lon: 39.27, country: 'TZ' },
    { name: 'Mwanza', geoId: 152224, lat: -2.52, lon: 32.9, country: 'TZ' },
    { name: 'Addis Ababa', geoId: 344979, lat: 9.02, lon: 38.75, country: 'ET' },
    { name: 'Dire Dawa', geoId: 338832, lat: 9.59, lon: 41.87, country: 'ET' },
    { name: 'Accra', geoId: 2306104, lat: 5.56, lon: -0.2, country: 'GH' },
    { name: 'Kumasi', geoId: 2298890, lat: 6.69, lon: -1.62, country: 'GH' },
    { name: 'Abidjan', geoId: 2293538, lat: 5.35, lon: -4.0, country: 'CI' },
    { name: 'Bouaké', geoId: 2290956, lat: 7.69, lon: -5.03, country: 'CI' },
    { name: 'Kampala', geoId: 232422, lat: 0.32, lon: 32.58, country: 'UG' },
    { name: 'Gulu', geoId: 233346, lat: 2.77, lon: 32.3, country: 'UG' },
    { name: 'Luanda', geoId: 2240449, lat: -8.84, lon: 13.23, country: 'AO' },
    { name: 'Lubango', geoId: 3347762, lat: -14.92, lon: 13.49, country: 'AO' },
    { name: 'Lusaka', geoId: 909137, lat: -15.41, lon: 28.29, country: 'ZM' },
    { name: 'Kitwe', geoId: 911148, lat: -12.8, lon: 28.21, country: 'ZM' },
    { name: 'Khartoum', geoId: 379252, lat: 15.55, lon: 32.53, country: 'SD' },
    { name: 'Omdurman', geoId: 365137, lat: 15.64, lon: 32.48, country: 'SD' },
    { name: 'Tunis', geoId: 2464470, lat: 36.82, lon: 10.17, country: 'TN' },
    { name: 'Sfax', geoId: 2467454, lat: 34.74, lon: 10.76, country: 'TN' },
    { name: 'Douala', geoId: 2232593, lat: 4.05, lon: 9.7, country: 'CM' },
    { name: 'Yaoundé', geoId: 2220957, lat: 3.87, lon: 11.52, country: 'CM' },
    { name: 'Maputo', geoId: 1040652, lat: -25.97, lon: 32.58, country: 'MZ' },
    { name: 'Antananarivo', geoId: 1070940, lat: -18.91, lon: 47.54, country: 'MG' },
    { name: 'Kigali', geoId: 202061, lat: -1.95, lon: 30.06, country: 'RW' },
    { name: 'Tripoli', geoId: 2210247, lat: 32.89, lon: 13.19, country: 'LY' },
  ],
  oceania: [
    { name: 'Sydney', geoId: 2147714, lat: -33.87, lon: 151.21, country: 'AU' },
    { name: 'Melbourne', geoId: 2158177, lat: -37.81, lon: 144.96, country: 'AU' },
    { name: 'Brisbane', geoId: 2174003, lat: -27.47, lon: 153.03, country: 'AU' },
    { name: 'Perth', geoId: 2063523, lat: -31.95, lon: 115.86, country: 'AU' },
    { name: 'Adelaide', geoId: 2078025, lat: -34.93, lon: 138.6, country: 'AU' },
    { name: 'Gold Coast', geoId: 2165087, lat: -28.0, lon: 153.43, country: 'AU' },
    { name: 'Canberra', geoId: 2172517, lat: -35.28, lon: 149.13, country: 'AU' },
    { name: 'Hobart', geoId: 2163355, lat: -42.88, lon: 147.33, country: 'AU' },
    { name: 'Auckland', geoId: 2193733, lat: -36.85, lon: 174.76, country: 'NZ' },
    { name: 'Wellington', geoId: 2179537, lat: -41.29, lon: 174.78, country: 'NZ' },
    { name: 'Christchurch', geoId: 2192362, lat: -43.53, lon: 172.63, country: 'NZ' },
  ],
};

// Country display names for continent pages
export const COUNTRY_NAMES: Record<string, string> = {
  GB: 'United Kingdom', FR: 'France', ES: 'Spain', DE: 'Germany',
  IT: 'Italy', NL: 'Netherlands', SE: 'Sweden', GR: 'Greece',
  PT: 'Portugal', AT: 'Austria', CZ: 'Czech Republic', DK: 'Denmark',
  NO: 'Norway', IE: 'Ireland', PL: 'Poland', HU: 'Hungary',
  BE: 'Belgium', RO: 'Romania', FI: 'Finland', CH: 'Switzerland',
  BG: 'Bulgaria', RS: 'Serbia', HR: 'Croatia', RU: 'Russia', UA: 'Ukraine',
  SK: 'Slovakia', LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia',
  SI: 'Slovenia', AL: 'Albania', BA: 'Bosnia and Herzegovina',
  CY: 'Cyprus', IS: 'Iceland', BY: 'Belarus', MT: 'Malta',
  LU: 'Luxembourg', MD: 'Moldova',
  US: 'United States', CA: 'Canada', MX: 'Mexico',
  CU: 'Cuba', DO: 'Dominican Republic',
  BR: 'Brazil', AR: 'Argentina', PE: 'Peru', CO: 'Colombia',
  CL: 'Chile', EC: 'Ecuador', VE: 'Venezuela', UY: 'Uruguay',
  PY: 'Paraguay', BO: 'Bolivia',
  JP: 'Japan', TH: 'Thailand', KR: 'South Korea', SG: 'Singapore',
  HK: 'Hong Kong', AE: 'UAE', IN: 'India', CN: 'China',
  TR: 'Turkey', PK: 'Pakistan', BD: 'Bangladesh',
  ID: 'Indonesia', VN: 'Vietnam', TW: 'Taiwan', IR: 'Iran',
  SA: 'Saudi Arabia', IQ: 'Iraq', AF: 'Afghanistan', MM: 'Myanmar',
  PH: 'Philippines', MY: 'Malaysia', NP: 'Nepal', LK: 'Sri Lanka',
  KH: 'Cambodia', IL: 'Israel', JO: 'Jordan', KW: 'Kuwait',
  QA: 'Qatar', GE: 'Georgia', UZ: 'Uzbekistan',
  EG: 'Egypt', NG: 'Nigeria', ZA: 'South Africa', KE: 'Kenya',
  MA: 'Morocco', DZ: 'Algeria', SN: 'Senegal',
  CD: 'DR Congo', TZ: 'Tanzania', ET: 'Ethiopia', GH: 'Ghana',
  CI: 'Ivory Coast', UG: 'Uganda', AO: 'Angola', ZM: 'Zambia', SD: 'Sudan',
  TN: 'Tunisia', CM: 'Cameroon', MZ: 'Mozambique', MG: 'Madagascar',
  RW: 'Rwanda', LY: 'Libya',
  AU: 'Australia', NZ: 'New Zealand',
  // Additional countries from sitemap cities
  ME: 'Montenegro', PR: 'Puerto Rico', CR: 'Costa Rica', PA: 'Panama',
  JM: 'Jamaica', BS: 'Bahamas', BZ: 'Belize', AW: 'Aruba', BB: 'Barbados',
  MV: 'Maldives', OM: 'Oman', AZ: 'Azerbaijan', KZ: 'Kazakhstan',
  MU: 'Mauritius', SC: 'Seychelles', FJ: 'Fiji',
};

// Reverse: English name → country code
const COUNTRY_NAME_TO_CODE_MAP: Record<string, string> = {};
for (const code in COUNTRY_NAMES) {
  COUNTRY_NAME_TO_CODE_MAP[COUNTRY_NAMES[code]] = code;
}
export const COUNTRY_NAME_TO_CODE: Record<string, string> = COUNTRY_NAME_TO_CODE_MAP;

// Continent slug ↔ key mapping
export const CONTINENT_SLUGS: Record<string, string> = {
  europe: 'europe',
  'north-america': 'northAmerica',
  'south-america': 'southAmerica',
  asia: 'asia',
  africa: 'africa',
  oceania: 'oceania',
};

// Reverse: key → slug
const CONTINENT_KEY_TO_SLUG_MAP: Record<string, string> = {};
for (const slug in CONTINENT_SLUGS) {
  const key = CONTINENT_SLUGS[slug];
  CONTINENT_KEY_TO_SLUG_MAP[key] = slug;
}
export const CONTINENT_KEY_TO_SLUG: Record<string, string> = CONTINENT_KEY_TO_SLUG_MAP;

// Map center & zoom per continent
export const CONTINENT_VIEW: Record<string, { center: [number, number]; zoom: number }> = {
  europe: { center: [50, 10], zoom: 4 },
  northAmerica: { center: [38, -97], zoom: 3 },
  southAmerica: { center: [-15, -60], zoom: 3 },
  asia: { center: [25, 80], zoom: 3 },
  africa: { center: [5, 20], zoom: 3 },
  oceania: { center: [-28, 145], zoom: 4 },
};

/** Group cities by country code, preserving order */
export function groupByCountry(cities: PopularCity[]): Record<string, PopularCity[]> {
  const map: Record<string, PopularCity[]> = {};
  for (const c of cities) {
    const cc = c.country || '??';
    (map[cc] ??= []).push(c);
  }
  return map;
}

// Country slug → ISO code (lowercase country name → code)
const COUNTRY_SLUGS_MAP: Record<string, string> = {};
for (const code in COUNTRY_NAMES) {
  const slug = COUNTRY_NAMES[code].toLowerCase().replace(/\s+/g, '-');
  COUNTRY_SLUGS_MAP[slug] = code;
}
export const COUNTRY_SLUGS: Record<string, string> = COUNTRY_SLUGS_MAP;

// Reverse: ISO code → country slug
const COUNTRY_CODE_TO_SLUG_MAP: Record<string, string> = {};
for (const slug in COUNTRY_SLUGS) {
  COUNTRY_CODE_TO_SLUG_MAP[COUNTRY_SLUGS[slug]] = slug;
}
export const COUNTRY_CODE_TO_SLUG: Record<string, string> = COUNTRY_CODE_TO_SLUG_MAP;

/** Get all cities for a given country code across all continents */
export function getCitiesByCountry(countryCode: string): PopularCity[] {
  const result: PopularCity[] = [];
  for (const cities of Object.values(POPULAR_CITIES)) {
    for (const c of cities) {
      if (c.country === countryCode) result.push(c);
    }
  }
  return result;
}

/** Find which continent key a country belongs to */
export function getContinentForCountry(countryCode: string): string | null {
  return COUNTRY_TO_CONTINENT[countryCode] || null;
}

// Country → continent key mapping (built from POPULAR_CITIES + manual additions)
export const COUNTRY_TO_CONTINENT: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [key, cities] of Object.entries(POPULAR_CITIES)) {
    for (const c of cities) {
      if (c.country && !map[c.country]) map[c.country] = key;
    }
  }
  // Countries from sitemap cities not present in POPULAR_CITIES
  Object.assign(map, {
    ME: 'europe',
    PR: 'northAmerica', CR: 'northAmerica', PA: 'northAmerica',
    JM: 'northAmerica', BS: 'northAmerica', BZ: 'northAmerica',
    AW: 'northAmerica', BB: 'northAmerica',
    MV: 'asia', OM: 'asia', AZ: 'asia', KZ: 'asia',
    MU: 'africa', SC: 'africa',
    FJ: 'oceania',
  });
  return map;
})();

/** Get ALL cities for a continent (popular + sitemap cities merged, no duplicates) */
const _continentCitiesCache = new Map<string, PopularCity[]>();
export function getAllCitiesForContinent(continentKey: string): PopularCity[] {
  const cached = _continentCitiesCache.get(continentKey);
  if (cached) return cached;
  const { getAllCities } = require('./cities') as { getAllCities: () => Array<{ id: number; slug: string; lat: number; lon: number; country: string }> };
  const seen = new Set<number>();
  const result: PopularCity[] = [];

  for (const c of POPULAR_CITIES[continentKey] || []) {
    seen.add(c.geoId);
    result.push(c);
  }

  for (const c of getAllCities()) {
    if (seen.has(c.id)) continue;
    if (COUNTRY_TO_CONTINENT[c.country] !== continentKey) continue;
    seen.add(c.id);
    result.push({
      name: c.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      geoId: c.id,
      lat: c.lat,
      lon: c.lon,
      country: c.country,
    });
  }

  _continentCitiesCache.set(continentKey, result);
  return result;
}

/** Get ALL cities for a country (popular + sitemap cities merged, no duplicates) */
const _countryCitiesCache = new Map<string, PopularCity[]>();
export function getAllCitiesForCountry(countryCode: string): PopularCity[] {
  const cached = _countryCitiesCache.get(countryCode);
  if (cached) return cached;
  const { getAllCities } = require('./cities') as { getAllCities: () => Array<{ id: number; slug: string; lat: number; lon: number; country: string }> };
  const seen = new Set<number>();
  const result: PopularCity[] = [];

  for (const cities of Object.values(POPULAR_CITIES)) {
    for (const c of cities) {
      if (c.country === countryCode && !seen.has(c.geoId)) {
        seen.add(c.geoId);
        result.push(c);
      }
    }
  }

  for (const c of getAllCities()) {
    if (c.country !== countryCode || seen.has(c.id)) continue;
    seen.add(c.id);
    result.push({
      name: c.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      geoId: c.id,
      lat: c.lat,
      lon: c.lon,
      country: c.country,
    });
  }

  _countryCitiesCache.set(countryCode, result);
  return result;
}
export function getCountriesInContinent(continentKey: string): string[] {
  const codes = new Set<string>();
  for (const [cc, key] of Object.entries(COUNTRY_TO_CONTINENT)) {
    if (key === continentKey) codes.add(cc);
  }
  return [...codes];
}
