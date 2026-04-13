import json
from pathlib import Path
import unittest


class HotelSchemaTests(unittest.TestCase):
    def test_hotel_schema(self) -> None:
        hotels = json.loads(Path("data/hotels.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(hotels), 4)
        for hotel in hotels:
            self.assertIn("name", hotel)
            self.assertIn("city", hotel)
            self.assertIn("rating", hotel)
            self.assertIn("pricePerNight", hotel)
            self.assertIsInstance(hotel["pricePerNight"], int)


if __name__ == "__main__":
    unittest.main()
