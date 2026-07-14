import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class HotelSchemaTests(unittest.TestCase):
    def test_hotel_schema(self):
        data = json.loads((ROOT / "data" / "hotels.json").read_text())
        self.assertGreaterEqual(len(data), 4)
        for hotel in data:
            for key in ("id", "name", "city", "price", "rating", "roomsAvailable"):
                self.assertIn(key, hotel)
            self.assertGreater(hotel["price"], 0)
            self.assertGreaterEqual(hotel["roomsAvailable"], 0)

    def test_booking_features_present(self):
        source = (ROOT / "assets" / "app.js").read_text()
        for token in ["localStorage", "bookings", "favorites", "nightsBetween", "confirmBooking"]:
            self.assertIn(token, source)


if __name__ == "__main__":
    unittest.main()
