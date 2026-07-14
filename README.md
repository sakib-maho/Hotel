# Hotel Booking Dashboard

Browser-based hotel search and booking dashboard (no backend required).

## Features

- Search by hotel/city
- City filter + price/rating/name sorting
- Favorites
- Booking dialog with date validation
- Local booking list with cancel + room inventory updates
- `localStorage` persistence
- Schema + source tests

## Quick start

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```

## License

MIT
