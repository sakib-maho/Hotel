# Hotel Booking Dashboard (Upgraded)

<!-- BrandCloud:readme-standard -->
[![Maintained](https://img.shields.io/badge/Maintained-yes-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Showcase](https://img.shields.io/badge/Portfolio-Showcase-blue.svg)](#)

_Part of the `sakib-maho` project showcase series with consistent documentation and quality standards._

This repository is upgraded into a modern static hotel booking dashboard with searchable
and sortable listings backed by JSON data.

## Features

- Search by hotel/city
- City-based filter
- Price sorting (ascending/descending)
- JSON-driven listing data
- Data schema test for hotel entries
- Legacy archives preserved under `legacy/archives/`

## Quick Start

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```

## License

MIT License. See `LICENSE`.
