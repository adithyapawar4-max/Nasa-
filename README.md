# Flame in Freefall — experiment comparison app

Frontend application (Vite + React + TypeScript + Tailwind CSS + Recharts) focused on Member 4's Comparison page. It reads experiment records from Google Sheets, normalizes them, and compares two selected experiments side by side.

## Features
- Comparison page matching the Screen 05 layout.
- Google Sheets data access with header mapping, numeric parsing, and missing-value protection.
- Side-by-side comparison table, differences, and side-by-side bars for spread rate and burn duration.
- Source report cards with safe external links.
- Sixty-second auto-refresh, manual refresh, timestamp, and cached-data warning.
- Settings panel (gear icon) with an opt-in demo simulation toggle.

## Demo simulation (Settings)
The gear icon in the header opens Settings. The **Demo simulation** switch loads clearly labeled synthetic records so the comparison page can be previewed without Google Sheets.

- Default state comes from `VITE_DEMO_MODE` when set (for example `VITE_DEMO_MODE=true npm run dev`); the toggle always overrides it and is available in every build.
- The choice is saved in `localStorage` under `flame-in-freefall:demo` and persists across reloads.
- While demo mode is on, an amber banner is shown and the header gear gets an amber dot. Demo records are never mixed with live spreadsheet rows; switching the toggle reloads the data source.
- Turning demo mode off with no Sheets credentials shows the normal configuration error instead of data.

## Required environment variables
Copy `.env.example` to `.env` and fill in the values:

```bash
VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
VITE_GOOGLE_SHEETS_RANGE=Experiments!A1:Z1000
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
# Optional:
# VITE_GOOGLE_SHEETS_REFRESH_INTERVAL_MS=60000
```

1. **Spreadsheet ID**: open the spreadsheet and copy the ID from the URL between `/d/` and `/edit`.
2. **Range**: include the sheet name and column span, e.g. `Experiments!A1:Z1000`.
3. **Google Sheets API key**: create an API key in Google Cloud, enable the Google Sheets API, and restrict it to the Sheets API plus your app origin.
4. **Public readability**: for this browser-only integration the spreadsheet and API configuration must allow read access to configured users. Never expose private keys in frontend code.
5. **Private spreadsheets**: use a backend or server-side proxy that authenticates to Google. Do not put service-account private keys or OAuth secrets in `VITE_` variables.

## Header mapping
Actual spreadsheet headers are mapped in `src/config/experimentHeaderMap.ts`. The mapping is based on normalized (lowercase, punctuation-removed) header names. Add aliases there if your columns use different names. Supported logical fields:

`experiment_id`, `experiment_name`, `experiment_series`, `test_number`, `material`,
`airflow_cm_s`, `oxygen_percent`, `spread_rate_cm_s`, `burn_duration_s`,
`test_date`, `source_report`, `source_page`, `notes`.

## Running the project
```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Testing the comparison page without live data
The app does not ship fabricated results. With Google Sheets unconfigured, the page shows a setup/connection state instead of measurements. Use the demo-simulation switch in Settings to preview the page with clearly labeled synthetic records.

## Removing demo mode later
Demo mode is intentionally isolated. To retire it after the project:

1. Delete the demo toggle section in `src/components/SettingsMenu.tsx` (marked `DEMO ONLY`), plus the demo-state lines in that file (the amber source label/dot and the `useDemoMode` import).
2. Delete `src/demo/` and `src/tests/demoMode.test.ts`.
3. Remove `DemoModeProvider` from `src/App.tsx`.
4. In `src/components/Navbar.tsx`, drop `useDemoMode` and the amber dot; delete `SettingsMenu` too if the whole Settings panel is retired (recommended once no settings remain).
5. In `src/pages/ComparisonPage.tsx`, call `useExperimentData()` without the demo argument and remove `useDemoMode`.
6. In `src/hooks/useExperimentData.ts`, remove the `demoEnabled` parameter and the demo branch, restoring the Sheets-only path.
7. Remove `VITE_DEMO_MODE` from `.env.example` / `.env`.

The demo banner and “Demo preview” chart tags disappear automatically once demo mode is gone.

## Refresh behavior
Data loads on mount and every 60 seconds (or `VITE_GOOGLE_SHEETS_REFRESH_INTERVAL_MS`). Manual refresh is available in the status bar. Failed refreshes keep the last successful data and show a cached-data warning plus a timestamp.

## Tests and build checks
```bash
npm run lint
npm run build
npm run test
```

## Remaining setup steps / blockers
- Add a valid spreadsheet ID/range/API key for live integration.
- Map headers in `src/config/experimentHeaderMap.ts` to your sheet.
- Provide real experiment data; the UI never substitutes sample measurements.