/* =============================================================
   Where To Breathe — Greece Air Quality Monitor
   Main Application Script
   ============================================================= */

'use strict';

// ============================================================
// CONFIGURATION
// ============================================================
const API_KEY = '12eb02ae11fce1e15e544117347ec360';
const OWM_WEATHER_URL  = 'https://api.openweathermap.org/data/2.5/weather';
const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const OWM_AIR_URL      = 'https://api.openweathermap.org/data/2.5/air_pollution';
const OWM_AIR_FORECAST = 'https://api.openweathermap.org/data/2.5/air_pollution/forecast';

const CACHE_KEY = 'wtb_cache';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const AUTO_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// ============================================================
// LOCATIONS — All major cities and areas across Greece
// ============================================================
const LOCATIONS = [
    // ── Αττική ──
    { id: 'athens',         name: 'Αθήνα',          lat: 37.9838, lng: 23.7275 },
    { id: 'piraeus',        name: 'Πειραιάς',       lat: 37.9475, lng: 23.6372 },
    { id: 'glyfada',        name: 'Γλυφάδα',        lat: 37.8667, lng: 23.7500 },
    { id: 'maroussi',       name: 'Μαρούσι',        lat: 38.0500, lng: 23.8000 },
    { id: 'peristeri',      name: 'Περιστέρι',      lat: 38.0170, lng: 23.6917 },
    { id: 'nikaia',         name: 'Νίκαια',         lat: 37.9667, lng: 23.6333 },
    { id: 'kallithea',      name: 'Καλλιθέα',       lat: 37.9500, lng: 23.7000 },
    { id: 'nea_smyrni',     name: 'Νέα Σμύρνη',     lat: 37.9456, lng: 23.7147 },
    { id: 'kifisia',        name: 'Κηφισιά',        lat: 38.0747, lng: 23.8108 },
    { id: 'elefsina',       name: 'Ελευσίνα',       lat: 38.0422, lng: 23.5414 },
    { id: 'megara',         name: 'Μέγαρα',         lat: 37.9953, lng: 23.3428 },
    { id: 'lavrio',         name: 'Λαύριο',         lat: 37.7136, lng: 24.0544 },
    { id: 'rafina',         name: 'Ραφήνα',         lat: 38.0228, lng: 24.0094 },

    // ── Θεσσαλονίκη ──
    { id: 'thessaloniki',   name: 'Θεσσαλονίκη',    lat: 40.6401, lng: 22.9444 },
    { id: 'kalamaria',      name: 'Καλαμαριά',      lat: 40.5822, lng: 22.9532 },
    { id: 'euosmos',        name: 'Εύοσμος',        lat: 40.6697, lng: 22.9154 },
    { id: 'pylaia',         name: 'Πυλαία',         lat: 40.6009, lng: 22.9891 },
    { id: 'thermi',         name: 'Θέρμη',          lat: 40.5485, lng: 23.0197 },
    { id: 'sindos',         name: 'Σίνδος',         lat: 40.6707, lng: 22.8034 },
    { id: 'neapoli_thes',   name: 'Νεάπολη Θεσ.',   lat: 40.6534, lng: 22.9420 },
    { id: 'wraiokastro',    name: 'Ωραιόκαστρο',    lat: 40.7284, lng: 22.9187 },
    { id: 'peraia',         name: 'Περαία',          lat: 40.5031, lng: 22.9296 },
    { id: 'chalkidona',     name: 'Χαλκηδόνα',      lat: 40.7316, lng: 22.5987 },

    // ── Κεντρική Μακεδονία ──
    { id: 'serres',         name: 'Σέρρες',         lat: 41.0866, lng: 23.5484 },
    { id: 'kilkis',         name: 'Κιλκίς',         lat: 40.9937, lng: 22.8754 },
    { id: 'veria',          name: 'Βέροια',         lat: 40.5244, lng: 22.2028 },
    { id: 'naoussa',        name: 'Νάουσα',         lat: 40.6297, lng: 22.0681 },
    { id: 'katerini',       name: 'Κατερίνη',       lat: 40.2719, lng: 22.5025 },
    { id: 'edessa',         name: 'Έδεσσα',         lat: 40.8019, lng: 22.0472 },
    { id: 'giannitsa',      name: 'Γιαννιτσά',      lat: 40.7917, lng: 22.4083 },
    { id: 'polygyros',      name: 'Πολύγυρος',      lat: 40.3753, lng: 23.4372 },

    // ── Δυτική Μακεδονία ──
    { id: 'kozani',         name: 'Κοζάνη',         lat: 40.3006, lng: 21.7889 },
    { id: 'ptolemaida',     name: 'Πτολεμαΐδα',     lat: 40.5131, lng: 21.6794 },
    { id: 'florina',        name: 'Φλώρινα',        lat: 40.7828, lng: 21.4097 },
    { id: 'kastoria',       name: 'Καστοριά',       lat: 40.5194, lng: 21.3006 },
    { id: 'grevena',        name: 'Γρεβενά',        lat: 40.0844, lng: 21.4275 },

    // ── Ανατολική Μακεδονία & Θράκη ──
    { id: 'kavala',         name: 'Καβάλα',         lat: 40.9397, lng: 24.4014 },
    { id: 'drama',          name: 'Δράμα',          lat: 41.1497, lng: 24.1486 },
    { id: 'xanthi',         name: 'Ξάνθη',          lat: 41.1350, lng: 24.8881 },
    { id: 'komotini',       name: 'Κομοτηνή',       lat: 41.1224, lng: 25.4033 },
    { id: 'alexandroupoli',  name: 'Αλεξανδρούπολη', lat: 40.8462, lng: 25.8743 },
    { id: 'orestiada',      name: 'Ορεστιάδα',      lat: 41.5053, lng: 26.2858 },
    { id: 'thasos',         name: 'Θάσος',          lat: 40.7764, lng: 24.7089 },

    // ── Ήπειρος ──
    { id: 'ioannina',       name: 'Ιωάννινα',       lat: 39.6650, lng: 20.8537 },
    { id: 'arta',           name: 'Άρτα',           lat: 39.1600, lng: 20.9853 },
    { id: 'preveza',        name: 'Πρέβεζα',        lat: 38.9508, lng: 20.7517 },
    { id: 'igoumenitsa',    name: 'Ηγουμενίτσα',    lat: 39.5036, lng: 20.2672 },

    // ── Θεσσαλία ──
    { id: 'larissa',        name: 'Λάρισα',         lat: 39.6372, lng: 22.4200 },
    { id: 'volos',          name: 'Βόλος',          lat: 39.3666, lng: 22.9425 },
    { id: 'trikala',        name: 'Τρίκαλα',        lat: 39.5558, lng: 21.7679 },
    { id: 'karditsa',       name: 'Καρδίτσα',       lat: 39.3653, lng: 21.9217 },
    { id: 'skiathos',       name: 'Σκιάθος',        lat: 39.1622, lng: 23.4903 },

    // ── Στερεά Ελλάδα ──
    { id: 'lamia',          name: 'Λαμία',          lat: 38.8992, lng: 22.4342 },
    { id: 'chalkida',       name: 'Χαλκίδα',        lat: 38.4625, lng: 23.5989 },
    { id: 'livadeia',       name: 'Λιβαδειά',       lat: 38.4353, lng: 22.8783 },
    { id: 'thiva',          name: 'Θήβα',           lat: 38.3261, lng: 23.3189 },
    { id: 'amfissa',        name: 'Άμφισσα',        lat: 38.5264, lng: 22.3786 },

    // ── Δυτική Ελλάδα ──
    { id: 'patra',          name: 'Πάτρα',          lat: 38.2466, lng: 21.7346 },
    { id: 'agrinio',        name: 'Αγρίνιο',        lat: 38.6218, lng: 21.4073 },
    { id: 'messolonghi',    name: 'Μεσολόγγι',      lat: 38.3714, lng: 21.4306 },
    { id: 'pyrgos',         name: 'Πύργος',         lat: 37.6708, lng: 21.4417 },

    // ── Πελοπόννησος ──
    { id: 'kalamata',       name: 'Καλαμάτα',       lat: 37.0389, lng: 22.1142 },
    { id: 'tripoli',        name: 'Τρίπολη',        lat: 37.5111, lng: 22.3792 },
    { id: 'sparti',         name: 'Σπάρτη',         lat: 37.0739, lng: 22.4297 },
    { id: 'korinthos',      name: 'Κόρινθος',       lat: 37.9386, lng: 22.9322 },
    { id: 'nafplio',        name: 'Ναύπλιο',        lat: 37.5633, lng: 22.8011 },
    { id: 'argos',          name: 'Άργος',          lat: 37.6317, lng: 22.7283 },

    // ── Ιόνια Νησιά ──
    { id: 'kerkyra',        name: 'Κέρκυρα',        lat: 39.6243, lng: 19.9217 },
    { id: 'lefkada',        name: 'Λευκάδα',        lat: 38.8337, lng: 20.7069 },
    { id: 'zakynthos',      name: 'Ζάκυνθος',       lat: 37.7872, lng: 20.8979 },
    { id: 'kefalonia',      name: 'Κεφαλονιά',      lat: 38.1747, lng: 20.4892 },

    // ── Κρήτη ──
    { id: 'heraklion',      name: 'Ηράκλειο',       lat: 35.3387, lng: 25.1442 },
    { id: 'chania',         name: 'Χανιά',          lat: 35.5138, lng: 24.0180 },
    { id: 'rethymno',       name: 'Ρέθυμνο',        lat: 35.3693, lng: 24.4731 },
    { id: 'agios_nikolaos', name: 'Άγιος Νικόλαος', lat: 35.1903, lng: 25.7167 },
    { id: 'ierapetra',      name: 'Ιεράπετρα',      lat: 35.0094, lng: 25.7372 },
    { id: 'sitia',          name: 'Σητεία',         lat: 35.2039, lng: 26.1011 },

    // ── Βόρειο Αιγαίο ──
    { id: 'mytilini',       name: 'Μυτιλήνη',       lat: 39.1047, lng: 26.5547 },
    { id: 'chios',          name: 'Χίος',           lat: 38.3681, lng: 26.1367 },
    { id: 'samos',          name: 'Σάμος',          lat: 37.7572, lng: 26.9758 },
    { id: 'limnos',         name: 'Λήμνος',         lat: 39.9175, lng: 25.0453 },

    // ── Νότιο Αιγαίο ──
    { id: 'syros',          name: 'Σύρος',          lat: 37.4500, lng: 24.9333 },
    { id: 'mykonos',        name: 'Μύκονος',        lat: 37.4467, lng: 25.3289 },
    { id: 'santorini',      name: 'Σαντορίνη',      lat: 36.3932, lng: 25.4615 },
    { id: 'naxos',          name: 'Νάξος',          lat: 37.1036, lng: 25.3767 },
    { id: 'rhodes',         name: 'Ρόδος',          lat: 36.4349, lng: 28.2176 },
    { id: 'kos',            name: 'Κως',            lat: 36.8943, lng: 26.9869 },
    { id: 'paros',          name: 'Πάρος',          lat: 37.0858, lng: 25.1522 },
    { id: 'kalymnos',       name: 'Κάλυμνος',       lat: 36.9500, lng: 26.9833 },
    { id: 'milos',          name: 'Μήλος',          lat: 36.7400, lng: 24.4194 },
];

// ============================================================
// AQI TABLES — European AQI standard (with PM2.5)
// ============================================================
const AQI_TABLE = [
    { category: 'Good',           no2: [0, 40],    o3: [0, 50],    so2: [0, 100],   pm25: [0, 10]   },
    { category: 'Fair',           no2: [41, 90],   o3: [51, 100],  so2: [101, 200], pm25: [10, 20]  },
    { category: 'Moderate',       no2: [91, 120],  o3: [101, 130], so2: [201, 350], pm25: [20, 25]  },
    { category: 'Poor',           no2: [121, 230], o3: [131, 240], so2: [351, 500], pm25: [25, 50]  },
    { category: 'Very Poor',      no2: [231, 340], o3: [241, 380], so2: [501, 750], pm25: [50, 75]  },
    { category: 'Extremely Poor', no2: [341, 1000],o3: [381, 800], so2: [751, 1250],pm25: [75, 800] }
];

const AQI_INDEX = [
    { category: 'Good',           range: [0, 25]  },
    { category: 'Fair',           range: [25, 50] },
    { category: 'Moderate',       range: [50, 75] },
    { category: 'Poor',           range: [75, 100]},
    { category: 'Very Poor',      range: [100, 125]},
    { category: 'Extremely Poor', range: [125, 150]}
];

const AQI_COLORS = {
    'Good':           { color: '#38a169', bg: 'rgba(56,161,105,0.15)' },
    'Fair':           { color: '#48bb78', bg: 'rgba(72,187,120,0.15)' },
    'Moderate':       { color: '#d69e2e', bg: 'rgba(214,158,46,0.15)' },
    'Poor':           { color: '#dd6b20', bg: 'rgba(221,107,32,0.15)' },
    'Very Poor':      { color: '#e53e3e', bg: 'rgba(229,62,62,0.15)' },
    'Extremely Poor': { color: '#805ad5', bg: 'rgba(128,90,213,0.15)' }
};

const AQI_DESCRIPTIONS = {
    'Good':           'Η ποιότητα αέρα είναι εξαιρετική. Ιδανικές συνθήκες για υπαίθριες δραστηριότητες.',
    'Fair':           'Η ποιότητα αέρα είναι αποδεκτή. Κατάλληλη για τις περισσότερες δραστηριότητες.',
    'Moderate':       'Μέτρια ποιότητα αέρα. Ευαίσθητα άτομα μπορεί να επηρεαστούν.',
    'Poor':           'Κακή ποιότητα αέρα. Αποφύγετε παρατεταμένη έκθεση στον εξωτερικό αέρα.',
    'Very Poor':      'Πολύ κακή ποιότητα. Μείνετε σε εσωτερικούς χώρους αν ανήκετε σε ευπαθή ομάδα.',
    'Extremely Poor': 'Εξαιρετικά κακή ποιότητα. Αποφύγετε κάθε υπαίθρια δραστηριότητα.'
};

const SENSITIVITY_THRESHOLDS = {
    low:      { good: 75, moderate: 100 },
    moderate: { good: 50, moderate: 75 },
    high:     { good: 25, moderate: 50 }
};

const SENSITIVITY_LABELS = {
    low:      'Χαμηλή',
    moderate: 'Μέτρια',
    high:     'Υψηλή'
};

const POLLUTANT_NAMES = {
    no2:  'NO\u2082',
    o3:   'O\u2083',
    so2:  'SO\u2082',
    pm25: 'PM2.5'
};

// ============================================================
// APPLICATION STATE
// ============================================================
let allData = {};
let selectedLocation = null;
let selectedSensitivity = null;
let mapInstance = null;
let mapMarkers = {};
let pollutantChart = null;

// ============================================================
// DOM HELPERS
// ============================================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ============================================================
// AQI CALCULATION FUNCTIONS
// ============================================================
function getCategoryInfo(value, pollutantKey) {
    for (const row of AQI_TABLE) {
        const range = row[pollutantKey];
        if (!range) continue;
        if (value >= range[0] && value <= range[1]) {
            return { category: row.category, Clow: range[0], Chigh: range[1] };
        }
    }
    const last = AQI_TABLE[AQI_TABLE.length - 1];
    return { category: last.category, Clow: last[pollutantKey][0], Chigh: last[pollutantKey][1] };
}

function getIndexRange(category) {
    const entry = AQI_INDEX.find(e => e.category === category);
    return entry ? { Ilow: entry.range[0], Ihigh: entry.range[1] } : { Ilow: 0, Ihigh: 25 };
}

function calcSubIndex(C, pollutantKey) {
    const { category, Clow, Chigh } = getCategoryInfo(C, pollutantKey);
    const { Ilow, Ihigh } = getIndexRange(category);
    if (Chigh === Clow) return Ilow;
    return parseFloat((((Ihigh - Ilow) / (Chigh - Clow)) * (C - Clow) + Ilow).toFixed(1));
}

function calculateAQI(components) {
    const pollutants = {
        no2:  components.no2   ?? 0,
        o3:   components.o3    ?? 0,
        so2:  components.so2   ?? 0,
        pm25: components.pm2_5 ?? components.pm25 ?? 0
    };

    const subIndices = {};
    let maxAQI = 0;
    let dominantPollutant = '';

    for (const [key, value] of Object.entries(pollutants)) {
        const sub = calcSubIndex(value, key);
        subIndices[key] = sub;
        if (sub > maxAQI) {
            maxAQI = sub;
            dominantPollutant = key;
        }
    }

    let category = 'Good';
    for (const entry of AQI_INDEX) {
        if (maxAQI >= entry.range[0] && maxAQI < entry.range[1]) {
            category = entry.category;
            break;
        }
    }
    if (maxAQI >= 125) category = 'Extremely Poor';

    return {
        value: Math.round(maxAQI),
        category,
        dominantPollutant,
        subIndices,
        components: pollutants
    };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function arrAvg(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function formatTime(date) {
    return date.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString('el-GR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

// ============================================================
// API FUNCTIONS
// ============================================================
async function fetchJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    return resp.json();
}

async function fetchLocationData(loc) {
    const params = `lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`;

    const [weather, air, forecast, airForecast] = await Promise.all([
        fetchJSON(`${OWM_WEATHER_URL}?${params}&units=metric&lang=el`),
        fetchJSON(`${OWM_AIR_URL}?${params}`),
        fetchJSON(`${OWM_FORECAST_URL}?${params}&units=metric&lang=el`),
        fetchJSON(`${OWM_AIR_FORECAST}?${params}`)
    ]);

    return { weather, air, forecast, airForecast };
}

async function fetchAllData() {
    const loadingEl = $('#loading-overlay');
    const errorEl   = $('#error-banner');
    loadingEl.classList.remove('hidden');
    errorEl.classList.remove('show');

    try {
        // Check local cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                allData = data;
                loadingEl.classList.add('hidden');
                return;
            }
        }

        // Fetch all locations in parallel
        const results = await Promise.allSettled(
            LOCATIONS.map(loc => fetchLocationData(loc))
        );

        let failCount = 0;
        LOCATIONS.forEach((loc, i) => {
            if (results[i].status === 'fulfilled') {
                allData[loc.id] = results[i].value;
            } else {
                console.warn(`Failed to fetch data for ${loc.name}:`, results[i].reason);
                allData[loc.id] = null;
                failCount++;
            }
        });

        if (failCount === LOCATIONS.length) {
            errorEl.classList.add('show');
        }

        // Save to cache
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: allData,
                timestamp: Date.now()
            }));
        } catch (e) {
            // quota exceeded — ignore
        }

    } catch (err) {
        console.error('Fatal error fetching data:', err);
        $('#error-banner').classList.add('show');
    }

    loadingEl.classList.add('hidden');
}

// ============================================================
// MAP
// ============================================================
function initMap() {
    mapInstance = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([38.5, 24.0], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; <a href="https://carto.com/">CARTO</a>'
    }).addTo(mapInstance);

    LOCATIONS.forEach(loc => {
        const data = allData[loc.id];
        let aqiInfo = null;
        let markerColor = '#999';

        if (data?.air?.list?.[0]) {
            aqiInfo = calculateAQI(data.air.list[0].components);
            markerColor = AQI_COLORS[aqiInfo.category]?.color || '#999';
        }

        const marker = L.circleMarker([loc.lat, loc.lng], {
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.6,
            radius: 10,
            weight: 2
        }).addTo(mapInstance);

        // Popup content
        const aqiText = aqiInfo
            ? `AQI: ${aqiInfo.value} (${aqiInfo.category})`
            : 'AQI: Μη διαθέσιμο';
        const tempText = data?.weather?.main?.temp != null
            ? `${Math.round(data.weather.main.temp)}°C`
            : '--°C';
        const descText = data?.weather?.weather?.[0]?.description || '';
        const badgeClass = aqiInfo
            ? 'bg-' + aqiInfo.category.toLowerCase().replace(/\s+/g, '-')
            : '';

        marker.bindPopup(`
            <div class="popup-title">${loc.name}</div>
            <div class="popup-aqi"><span class="popup-badge ${badgeClass}">${aqiText}</span></div>
            <div class="popup-weather">${descText}, ${tempText}</div>
        `);

        marker.bindTooltip(loc.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -8],
            className: 'marker-label'
        });

        marker.on('click', () => {
            selectedLocation = loc;
            updateSidebar();
            updateForecast();
            updateResult();
            highlightMarker(loc.id);
        });

        mapMarkers[loc.id] = marker;
    });

    window.addEventListener('resize', () => mapInstance.invalidateSize());
}

function highlightMarker(activeId) {
    LOCATIONS.forEach(loc => {
        const marker = mapMarkers[loc.id];
        if (!marker) return;
        if (loc.id === activeId) {
            marker.setStyle({ fillOpacity: 0.9, weight: 3 });
            marker.setRadius(14);
        } else {
            marker.setStyle({ fillOpacity: 0.5, weight: 2 });
            marker.setRadius(10);
        }
    });
}

// ============================================================
// STATS BAR
// ============================================================
function updateStatsBar() {
    let totalAQI = 0, count = 0;
    let bestArea = null, bestAQI = 999;
    let worstArea = null, worstAQI = -1;

    LOCATIONS.forEach(loc => {
        const data = allData[loc.id];
        if (!data?.air?.list?.[0]) return;
        const aqi = calculateAQI(data.air.list[0].components);
        totalAQI += aqi.value;
        count++;
        if (aqi.value < bestAQI)  { bestAQI = aqi.value;  bestArea = loc; }
        if (aqi.value > worstAQI) { worstAQI = aqi.value; worstArea = loc; }
    });

    if (count > 0) {
        const avg = Math.round(totalAQI / count);
        let avgCat = 'Good';
        for (const entry of AQI_INDEX) {
            if (avg >= entry.range[0] && avg < entry.range[1]) { avgCat = entry.category; break; }
        }
        if (avg >= 125) avgCat = 'Extremely Poor';

        $('#stat-avg-aqi').textContent = avg;
        $('#stat-avg-aqi').style.color = AQI_COLORS[avgCat]?.color || '';
        $('#stat-avg-label').textContent = avgCat;
    }

    if (bestArea) {
        const bestCat = calculateAQI(allData[bestArea.id].air.list[0].components).category;
        $('#stat-best-area').textContent = bestArea.name;
        $('#stat-best-aqi').textContent = `AQI: ${bestAQI}`;
        $('#stat-best-aqi').style.color = AQI_COLORS[bestCat]?.color || '';
    }

    if (worstArea) {
        const worstCat = calculateAQI(allData[worstArea.id].air.list[0].components).category;
        $('#stat-worst-area').textContent = worstArea.name;
        $('#stat-worst-aqi').textContent = `AQI: ${worstAQI}`;
        $('#stat-worst-aqi').style.color = AQI_COLORS[worstCat]?.color || '';
    }

    $('#last-updated').textContent = 'Ενημέρωση: ' + formatTime(new Date());
}

// ============================================================
// SIDEBAR — WEATHER & AQI
// ============================================================
function updateSidebar() {
    if (!selectedLocation) return;
    const data = allData[selectedLocation.id];
    if (!data) return;

    updateWeatherPanel(data);
    updateAQIPanel(data);
    updatePollutants(data);
}

function updateWeatherPanel(data) {
    const w = data.weather;
    const weatherPanel = $('#weather-panel');
    if (!w) return;

    const iconCode = w.weather?.[0]?.icon || '01d';
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const windKmh = w.wind?.speed ? (w.wind.speed * 3.6).toFixed(1) : '--';

    weatherPanel.innerHTML = `
        <div class="weather-location">${selectedLocation.name}</div>
        <div class="weather-date">${formatDate(new Date())}</div>
        <div class="weather-main">
            <img src="${iconUrl}" alt="${w.weather?.[0]?.description || ''}" loading="lazy">
            <span class="weather-temp-big">${Math.round(w.main?.temp ?? 0)}&deg;</span>
        </div>
        <div class="weather-desc">${w.weather?.[0]?.description || '--'}</div>
        <div class="weather-details-grid">
            <div class="weather-detail">
                <div class="weather-detail-label">Αίσθηση</div>
                <div class="weather-detail-value">${Math.round(w.main?.feels_like ?? 0)}&deg;C</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Υγρασία</div>
                <div class="weather-detail-value">${w.main?.humidity ?? '--'}%</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Άνεμος</div>
                <div class="weather-detail-value">${windKmh} km/h</div>
            </div>
            <div class="weather-detail">
                <div class="weather-detail-label">Πίεση</div>
                <div class="weather-detail-value">${w.main?.pressure ?? '--'} hPa</div>
            </div>
        </div>
    `;
}

function updateAQIPanel(data) {
    const aqiPanel = $('#aqi-panel');
    if (!data.air?.list?.[0]) return;

    const aqi = calculateAQI(data.air.list[0].components);
    const colorInfo = AQI_COLORS[aqi.category] || AQI_COLORS['Good'];

    aqiPanel.innerHTML = `
        <div class="aqi-gauge">
            <div class="aqi-gauge-circle" style="border-color:${colorInfo.color}; background:${colorInfo.bg};">
                <div class="aqi-gauge-value" style="color:${colorInfo.color};">${aqi.value}</div>
                <div class="aqi-gauge-label" style="color:${colorInfo.color};">AQI</div>
            </div>
        </div>
        <div class="aqi-gauge-category" style="color:${colorInfo.color};">${aqi.category}</div>
        <div class="aqi-gauge-desc">${AQI_DESCRIPTIONS[aqi.category] || ''}</div>
    `;
}

// ============================================================
// POLLUTANTS
// ============================================================
function updatePollutants(data) {
    const grid = $('#pollutants-grid');
    const emptyEl = $('#pollutants-empty');
    const chartContainer = $('#chart-container');

    if (!data?.air?.list?.[0]) return;

    emptyEl.style.display = 'none';
    grid.style.display = 'grid';
    chartContainer.style.display = 'block';

    const comp = data.air.list[0].components;
    const pollutants = [
        { key: 'no2',  label: 'NO\u2082',  value: comp.no2,   unit: '\u03BCg/m\u00B3', max: 340 },
        { key: 'o3',   label: 'O\u2083',   value: comp.o3,    unit: '\u03BCg/m\u00B3', max: 380 },
        { key: 'so2',  label: 'SO\u2082',  value: comp.so2,   unit: '\u03BCg/m\u00B3', max: 750 },
        { key: 'pm25', label: 'PM2.5',     value: comp.pm2_5, unit: '\u03BCg/m\u00B3', max: 75  },
        { key: 'pm10', label: 'PM10',      value: comp.pm10,  unit: '\u03BCg/m\u00B3', max: 200 },
        { key: 'co',   label: 'CO',        value: comp.co,    unit: '\u03BCg/m\u00B3', max: 15000 }
    ];

    grid.innerHTML = pollutants.map(p => {
        const hasSub = ['no2', 'o3', 'so2', 'pm25'].includes(p.key);
        const cat = hasSub ? getCategoryInfo(p.value ?? 0, p.key).category : 'Good';
        const color = hasSub ? (AQI_COLORS[cat]?.color || '#3182ce') : '#3182ce';
        const pct = Math.min(((p.value ?? 0) / p.max) * 100, 100);

        return `
            <div class="pollutant-card">
                <div class="pollutant-name">${p.label}</div>
                <div class="pollutant-value" style="color:${color};">${(p.value ?? 0).toFixed(1)}</div>
                <div class="pollutant-unit">${p.unit}</div>
                <div class="pollutant-bar">
                    <div class="pollutant-bar-fill" style="width:${pct}%; background:${color};"></div>
                </div>
            </div>
        `;
    }).join('');

    updatePollutantChart(pollutants);
}

function updatePollutantChart(pollutants) {
    const ctx = $('#pollutantChart').getContext('2d');
    if (pollutantChart) pollutantChart.destroy();

    const labels = pollutants.map(p => p.label);
    const values = pollutants.map(p => p.value ?? 0);
    const colors = pollutants.map(p => {
        const hasSub = ['no2', 'o3', 'so2', 'pm25'].includes(p.key);
        if (!hasSub) return '#3182ce';
        const cat = getCategoryInfo(p.value ?? 0, p.key).category;
        return AQI_COLORS[cat]?.color || '#3182ce';
    });

    pollutantChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Συγκέντρωση (μg/m³)',
                data: values,
                backgroundColor: colors.map(c => c + '33'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y.toFixed(1)} μg/m³`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f4f8' },
                    ticks: { font: { family: 'Inter', size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 11, weight: '600' } }
                }
            }
        }
    });
}

// ============================================================
// 5-DAY FORECAST
// ============================================================
function updateForecast() {
    if (!selectedLocation) return;
    const data = allData[selectedLocation.id];
    if (!data) return;

    $('#forecast-location-label').textContent = selectedLocation.name;
    const emptyEl = $('#forecast-empty');
    const gridEl = $('#forecast-grid');

    if (!data.forecast?.list) return;

    emptyEl.style.display = 'none';
    gridEl.style.display = 'grid';

    // Group weather forecast by day
    const dailyForecasts = {};
    data.forecast.list.forEach(item => {
        const dateKey = new Date(item.dt * 1000).toLocaleDateString('el-GR');
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = { temps: [], icons: [], descriptions: [], dt: item.dt };
        }
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].icons.push(item.weather[0].icon);
        dailyForecasts[dateKey].descriptions.push(item.weather[0].description);
    });

    // Group air pollution forecast by day
    const dailyAir = {};
    if (data.airForecast?.list) {
        data.airForecast.list.forEach(item => {
            const dateKey = new Date(item.dt * 1000).toLocaleDateString('el-GR');
            if (!dailyAir[dateKey]) {
                dailyAir[dateKey] = { no2: [], o3: [], so2: [], pm25: [] };
            }
            const c = item.components;
            dailyAir[dateKey].no2.push(c.no2 ?? 0);
            dailyAir[dateKey].o3.push(c.o3 ?? 0);
            dailyAir[dateKey].so2.push(c.so2 ?? 0);
            dailyAir[dateKey].pm25.push(c.pm2_5 ?? 0);
        });
    }

    const days = Object.keys(dailyForecasts).slice(0, 5);

    gridEl.innerHTML = days.map((dateKey, i) => {
        const dayData = dailyForecasts[dateKey];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));

        const noonIdx = Math.floor(dayData.icons.length / 2);
        const icon = dayData.icons[noonIdx] || dayData.icons[0];
        const desc = dayData.descriptions[noonIdx] || dayData.descriptions[0];

        let aqiBadge = '';
        if (dailyAir[dateKey]) {
            const avgComp = {
                no2:   arrAvg(dailyAir[dateKey].no2),
                o3:    arrAvg(dailyAir[dateKey].o3),
                so2:   arrAvg(dailyAir[dateKey].so2),
                pm2_5: arrAvg(dailyAir[dateKey].pm25)
            };
            const aqi = calculateAQI(avgComp);
            const col = AQI_COLORS[aqi.category];
            aqiBadge = `<span class="forecast-aqi" style="background:${col.bg}; color:${col.color};">AQI ${aqi.value}</span>`;
        }

        const dayName = i === 0
            ? 'Σήμερα'
            : new Date(dayData.dt * 1000).toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric' });

        return `
            <div class="forecast-card ${i === 0 ? 'active' : ''}">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" title="${desc}" loading="lazy">
                </div>
                <div class="forecast-temp">${maxTemp}&deg; / ${minTemp}&deg;</div>
                ${aqiBadge}
            </div>
        `;
    }).join('');
}

// ============================================================
// SENSITIVITY & RESULTS
// ============================================================
function selectSensitivity(btn) {
    $$('.sensitivity-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSensitivity = btn.dataset.sensitivity;
    updateResult();
}

function updateResult() {
    const panel = $('#result-panel');

    if (!selectedLocation || !selectedSensitivity) {
        panel.classList.remove('show');
        return;
    }

    const data = allData[selectedLocation.id];
    if (!data?.air?.list?.[0]) {
        panel.classList.remove('show');
        return;
    }

    const aqi = calculateAQI(data.air.list[0].components);
    const t = SENSITIVITY_THRESHOLDS[selectedSensitivity];
    let status, statusIcon, message;

    if (aqi.value < t.good) {
        status = 'good';
        statusIcon = '✅';
        message = `<strong>${selectedLocation.name}</strong> έχει καλή ποιότητα αέρα. ` +
            (selectedSensitivity === 'high'
                ? 'Ασφαλείς συνθήκες για υπαίθριες δραστηριότητες ακόμα και για ευαίσθητα άτομα.'
                : 'Εξαιρετική ευκαιρία για υπαίθριες δραστηριότητες!');
    } else if (aqi.value < t.moderate) {
        status = 'moderate-result';
        statusIcon = '⚠️';
        message = `<strong>${selectedLocation.name}</strong> έχει μέτρια ποιότητα αέρα. ` +
            (selectedSensitivity === 'high'
                ? 'Συνιστάται προσοχή. Αποφύγετε παρατεταμένη υπαίθρια δραστηριότητα.'
                : 'Ελαφρές υπαίθριες δραστηριότητες με προσοχή.');
    } else {
        status = 'poor';
        statusIcon = '🚫';
        message = `<strong>${selectedLocation.name}</strong> έχει κακή ποιότητα αέρα. ` +
            (selectedSensitivity === 'high'
                ? 'Μείνετε σε εσωτερικούς χώρους. Η ποιότητα αέρα είναι επικίνδυνη για ευαίσθητα άτομα.'
                : 'Περιορίστε την έκθεσή σας. Εξετάστε εναλλακτική τοποθεσία.');
    }

    const dominantName = POLLUTANT_NAMES[aqi.dominantPollutant] || aqi.dominantPollutant;

    panel.className = `result-panel ${status} show`;
    $('#result-header').innerHTML =
        `${statusIcon} Αξιολόγηση για ${selectedLocation.name}`;
    $('#result-message').innerHTML = `
        ${message}<br><br>
        <small style="color:var(--text-muted);">
            AQI: <strong>${aqi.value}</strong> &middot;
            Κυρίαρχος ρύπος: <strong>${dominantName}</strong> &middot;
            Ευαισθησία: <strong>${SENSITIVITY_LABELS[selectedSensitivity]}</strong>
        </small>
    `;
}

// ============================================================
// REFRESH
// ============================================================
async function refreshData() {
    const btn = $('#refresh-btn');
    btn.classList.add('spinning');

    localStorage.removeItem(CACHE_KEY);
    await fetchAllData();

    // Update map markers
    LOCATIONS.forEach(loc => {
        const data = allData[loc.id];
        const marker = mapMarkers[loc.id];
        if (!marker) return;

        let markerColor = '#999';
        let aqiText = 'AQI: Μη διαθέσιμο';
        let tempText = '--°C';
        let descText = '';
        let badgeClass = '';

        if (data?.air?.list?.[0]) {
            const aqi = calculateAQI(data.air.list[0].components);
            markerColor = AQI_COLORS[aqi.category]?.color || '#999';
            aqiText = `AQI: ${aqi.value} (${aqi.category})`;
            badgeClass = 'bg-' + aqi.category.toLowerCase().replace(/\s+/g, '-');
        }
        if (data?.weather) {
            tempText = `${Math.round(data.weather.main?.temp ?? 0)}°C`;
            descText = data.weather.weather?.[0]?.description || '';
        }

        marker.setStyle({ color: markerColor, fillColor: markerColor });
        marker.setPopupContent(`
            <div class="popup-title">${loc.name}</div>
            <div class="popup-aqi"><span class="popup-badge ${badgeClass}">${aqiText}</span></div>
            <div class="popup-weather">${descText}, ${tempText}</div>
        `);
    });

    updateStatsBar();

    if (selectedLocation) {
        updateSidebar();
        updateForecast();
        updateResult();
        highlightMarker(selectedLocation.id);
    }

    btn.classList.remove('spinning');
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    await fetchAllData();
    initMap();
    updateStatsBar();

    // Update locations count
    $('#stat-locations-count').textContent = LOCATIONS.length;

    // Refresh button
    $('#refresh-btn').addEventListener('click', refreshData);

    // Sensitivity buttons — use event delegation instead of inline onclick
    $$('.sensitivity-btn').forEach(btn => {
        btn.addEventListener('click', () => selectSensitivity(btn));
    });

    // Auto-select Athens as default
    const defaultLoc = LOCATIONS.find(l => l.id === 'athens');
    if (defaultLoc && allData[defaultLoc.id]) {
        selectedLocation = defaultLoc;
        updateSidebar();
        updateForecast();
        highlightMarker(defaultLoc.id);

        const lowBtn = $('[data-sensitivity="low"]');
        if (lowBtn) {
            lowBtn.classList.add('active');
            selectedSensitivity = 'low';
            updateResult();
        }
    }

    // Auto-refresh
    setInterval(refreshData, AUTO_REFRESH_INTERVAL);
});
