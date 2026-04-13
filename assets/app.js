const state = { hotels: [], filtered: [] };

async function loadHotels() {
  const response = await fetch("data/hotels.json");
  if (!response.ok) {
    throw new Error("Failed to load hotels.");
  }
  return response.json();
}

function populateCities() {
  const cities = [...new Set(state.hotels.map((hotel) => hotel.city))].sort();
  const filter = document.getElementById("cityFilter");
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    filter.appendChild(option);
  });
}

function applyFilterAndSort() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const city = document.getElementById("cityFilter").value;
  const sort = document.getElementById("sortSelect").value;

  state.filtered = state.hotels.filter((hotel) => {
    const text = `${hotel.name} ${hotel.city}`.toLowerCase();
    const matchesQuery = query === "" || text.includes(query);
    const matchesCity = city === "all" || hotel.city === city;
    return matchesQuery && matchesCity;
  });

  state.filtered.sort((a, b) =>
    sort === "price-asc" ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
  );

  render();
}

function render() {
  const grid = document.getElementById("grid");
  const template = document.getElementById("cardTemplate");
  const meta = document.getElementById("meta");
  grid.innerHTML = "";
  meta.textContent = `${state.filtered.length} hotel(s) found`;

  state.filtered.forEach((hotel) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".name").textContent = hotel.name;
    fragment.querySelector(".info").textContent = `${hotel.city} • ${hotel.rating} star`;
    fragment.querySelector(".price").textContent = `$${hotel.pricePerNight}/night`;
    grid.appendChild(fragment);
  });
}

async function main() {
  state.hotels = await loadHotels();
  state.filtered = [...state.hotels];
  populateCities();
  applyFilterAndSort();

  document.getElementById("searchInput").addEventListener("input", applyFilterAndSort);
  document.getElementById("cityFilter").addEventListener("change", applyFilterAndSort);
  document.getElementById("sortSelect").addEventListener("change", applyFilterAndSort);
}

main().catch((error) => {
  document.getElementById("meta").textContent = error.message;
});
