# Where To Breathe — Greece Air Quality Monitor

A real-time air quality monitoring web application covering **all of Greece**. Users can explore an interactive map, view live AQI data, weather conditions, pollutant breakdowns, and 5-day forecasts for **90+ locations** — making it easy to decide when and where it's safe to be outdoors.

> **Evolution of [WhereToBreathe V1](https://github.com/):** The original version covered only Thessaloniki with static January 2024 data. V2 expands nationwide with live API data, modern UI, and many new features.

---

## Features

| Feature | Description |
|---------|-------------|
| **Interactive Map** | Leaflet-based map of Greece with color-coded AQI markers for 90+ cities & islands |
| **Real-Time Data** | Live weather, air pollution, and forecast data from the OpenWeatherMap API |
| **AQI Calculation** | European-standard Air Quality Index computed from NO₂, O₃, SO₂, and PM2.5 concentrations |
| **Pollutant Breakdown** | Detailed view of 6 pollutants (NO₂, O₃, SO₂, PM2.5, PM10, CO) with bar chart visualization |
| **5-Day Forecast** | Combined weather and air quality forecast for the selected location |
| **Sensitivity Assessment** | Personalized outdoor activity recommendations based on Low / Moderate / High sensitivity levels |
| **Stats Dashboard** | At-a-glance statistics: total locations monitored, average AQI, best & worst areas |
| **Smart Caching** | 15-minute local storage cache to reduce API calls and improve load times |
| **Auto-Refresh** | Data automatically refreshes every 15 minutes to stay current |
| **Responsive Design** | Fully responsive layout that works on desktop, tablet, and mobile devices |



## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties (CSS variables), grid/flexbox layout, smooth transitions
- **Vanilla JavaScript (ES6+)** — No frameworks, pure JS with async/await
- **[Leaflet.js](https://leafletjs.com/)** — Interactive map with CARTO basemap tiles
- **[Chart.js](https://www.chartjs.org/)** — Pollutant concentration bar charts
- **[OpenWeatherMap API](https://openweathermap.org/api)** — Weather, air pollution & forecast data
- **[Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)** — Clean, modern typography

---

## Project Structure

```
WhereToBreatheV2/
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # Application stylesheet (927 lines)
├── js/
│   └── app.js          # Main application logic (922 lines)
├── Images/
│   └── Logo.png        # App favicon / logo
└── README.md           # This file
```

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- An internet connection (for API & map tile requests)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/WhereToBreatheV2.git
   cd WhereToBreatheV2
   ```

2. **Open in browser**
   
   Simply open `index.html` in your browser — no build step or server required.

   Alternatively, serve it with any static file server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve .
   ```

3. **Visit** `http://localhost:8000` and start exploring!

---

## API Key

The app uses the [OpenWeatherMap API](https://openweathermap.org/api) for live data. A default API key is included for demo purposes. To use your own:

1. Sign up at [openweathermap.org](https://openweathermap.org/) (free tier available)
2. Replace the `API_KEY` constant in `js/app.js`:
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```

---

## How AQI Is Calculated

The application follows the **European Air Quality Index** standard:

1. **Pollutant concentrations** (NO₂, O₃, SO₂, PM2.5) are fetched from the API
2. Each pollutant is mapped to a **sub-index** using linear interpolation within defined breakpoint ranges
3. The **overall AQI** equals the highest sub-index (worst pollutant determines the score)
4. The **dominant pollutant** is identified and displayed

| AQI Range | Category | Color |
|-----------|----------|-------|
| 0 – 25 | Good | 🟢 Green |
| 25 – 50 | Fair | 🟢 Light Green |
| 50 – 75 | Moderate | 🟡 Yellow |
| 75 – 100 | Poor | 🟠 Orange |
| 100 – 125 | Very Poor | 🔴 Red |
| 125+ | Extremely Poor | 🟣 Purple |

---

## Covered Regions

The app monitors **90+ locations** across all major regions of Greece:

- **Αττική** — Αθήνα, Πειραιάς, Γλυφάδα, Κηφισιά, Ελευσίνα…
- **Θεσσαλονίκη** — Θεσσαλονίκη, Καλαμαριά, Εύοσμος, Θέρμη, Σίνδος…
- **Κεντρική Μακεδονία** — Σέρρες, Κατερίνη, Βέροια, Έδεσσα…
- **Δυτική Μακεδονία** — Κοζάνη, Φλώρινα, Καστοριά…
- **Αν. Μακεδονία & Θράκη** — Καβάλα, Ξάνθη, Αλεξανδρούπολη…
- **Ήπειρος** — Ιωάννινα, Άρτα, Πρέβεζα…
- **Θεσσαλία** — Λάρισα, Βόλος, Τρίκαλα…
- **Στερεά Ελλάδα** — Λαμία, Χαλκίδα…
- **Δυτική Ελλάδα** — Πάτρα, Αγρίνιο…
- **Πελοπόννησος** — Καλαμάτα, Τρίπολη, Κόρινθος, Ναύπλιο…
- **Ιόνια Νησιά** — Κέρκυρα, Ζάκυνθος, Κεφαλονιά…
- **Κρήτη** — Ηράκλειο, Χανιά, Ρέθυμνο…
- **Βόρειο Αιγαίο** — Μυτιλήνη, Χίος, Σάμος…
- **Νότιο Αιγαίο** — Σαντορίνη, Μύκονος, Ρόδος, Κως…

---

## V1 vs V2 — What Changed

| Aspect | V1 (WhereToBreathe) | V2 (Where To Breathe) |
|--------|---------------------|----------------------|
| **Coverage** | 10 areas in Thessaloniki | 90+ locations across all of Greece |
| **Data Source** | Static JSON files (Jan 2024) | Live OpenWeatherMap API |
| **Weather** | Basic weather widget | Full weather panel + 5-day forecast |
| **AQI Pollutants** | NO₂, O₃, SO₂ | NO₂, O₃, SO₂, PM2.5, PM10, CO |
| **Visualization** | Simple calendar + map | Stats dashboard, pollutant charts, forecast cards |
| **Date Selection** | Calendar picker for past dates | Real-time current data with auto-refresh |
| **Caching** | None | Local storage cache (15 min TTL) |
| **UI/UX** | Functional layout | Modern card-based design with CSS variables, transitions |
| **Language** | English UI | Greek UI (Ελληνικά) |

