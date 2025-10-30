# Airbnb Data Explorer (ITE5315 Assignment 2)

Simple Express.js + Handlebars app for exploring Airbnb listing data — built for ITE5315 Assignment 2.

## Summary
This project loads a large JSON dataset of Airbnb listings and renders views (search, price filter, all listings) using Handlebars. It demonstrates server-side rendering, basic form handling, and data filtering.

## Features
- Express.js server with Handlebars templating
- Views: home, all data, search, price search, and results
- Static assets served from `public/`
- Simple data utilities for filtering and formatting
- Instructions and helper scripts provided for trimming/processing large JSON datasets

## Prerequisites
- Node.js (v16+ recommended)
- npm
- Windows (development instructions use cmd.exe)

## Install
Open a command prompt in the project root:
```cmd
npm install
```

## Run (development)
```cmd
node app.js
```
Then open: http://localhost:3000

If you use nodemon:
```cmd
npm install -g nodemon
nodemon app.js
```

## Project structure (important files)
- app.js — main Express server
- airbnb_with_photos.json — dataset (large JSON array)
- views/ — Handlebars templates (layouts, partials, pages)
- public/stylesheets/style.css — styles
- scripts/ — helper scripts (e.g., trim or analyze large JSON) — may be added
- .gitignore — repo ignores

## Important routes
- GET / — Home
- GET /viewData — View all listings (renders `viewData.hbs`)
- GET /allData — Assignment 1 data view
- GET /search/propertyLine — Search form
- GET /search/propertyLine/results?searchTerm=... — Search results
- GET /viewData/price — Price search form
- POST /viewData/price/results — Price search results

## Working with the large JSON
The repository includes a very large `airbnb_with_photos.json`. To avoid loading it fully in memory you can:
- Use a streaming script (e.g., using `stream-json`) to produce a trimmed file with the first 200 entries:
  - Install: `npm install stream-json`
  - Run a script like `node scripts/trim_airbnb.js` (script not included by default — can be added upon request).
- Or manually replace the JSON with a smaller sample for development.

## Notes and tips
- Handlebars helpers (e.g., `formatPrice`) are used in templates — ensure they are registered in `app.js`.
- Some property keys contain spaces (e.g., `room type`) — templates use bracket notation (`{{this.[room type]}}`).
- The project is intended for learning/demo purposes. Do not publish the full dataset in a public repo unless you have permission.

## Author
Deep Patel — N01679203  
ITE5315 Assignment 2 — Date: 28/10/2025
