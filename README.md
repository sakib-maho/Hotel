# Hotel Booking Dashboard (Upgraded)

This repository is upgraded into a modern static hotel booking dashboard with searchable
and sortable listings backed by JSON data.

## Features

- Search by hotel/city
- City-based filter
- Price sorting (ascending/descending)
- JSON-driven listing data
- Data schema test for hotel entries
- Legacy archives preserved under `legacy/archives/`

## Run Locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Run Tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```

## License

MIT License. See `LICENSE`.
