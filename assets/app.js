const STORAGE_KEY = "hotel-booking-dashboard.v2";

const state = {
  hotels: [],
  favorites: new Set(),
  bookings: [],
  bookingHotelId: null,
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      favorites: [...state.favorites],
      bookings: state.bookings,
    })
  );
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.round((b - a) / 86400000);
}

function hotelById(id) {
  return state.hotels.find((h) => h.id === id);
}

function uniqueCities() {
  return [...new Set(state.hotels.map((h) => h.city))].sort();
}

function filteredHotels() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const city = document.getElementById("cityFilter").value;
  const sort = document.getElementById("sortSelect").value;
  const favOnly = document.getElementById("favOnly").checked;

  let rows = state.hotels.filter((hotel) => {
    const hay = `${hotel.name} ${hotel.city}`.toLowerCase();
    const qOk = !q || hay.includes(q);
    const cityOk = city === "all" || hotel.city === city;
    const favOk = !favOnly || state.favorites.has(hotel.id);
    return qOk && cityOk && favOk;
  });

  rows = [...rows].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating-desc") return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
  return rows;
}

function renderCityOptions() {
  const select = document.getElementById("cityFilter");
  const current = select.value || "all";
  select.innerHTML = `<option value="all">All cities</option>`;
  uniqueCities().forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    select.appendChild(opt);
  });
  select.value = current;
}

function renderHotels() {
  const list = document.getElementById("hotelList");
  const template = document.getElementById("hotelTemplate");
  const rows = filteredHotels();
  document.getElementById("stats").textContent = `${rows.length} hotels shown`;
  list.innerHTML = "";

  rows.forEach((hotel) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".name").textContent = hotel.name;
    fragment.querySelector(".city").textContent = hotel.city;
    fragment.querySelector(".price").textContent = `$${hotel.price}/night`;
    fragment.querySelector(".rating").textContent = hotel.rating.toFixed(1);
    fragment.querySelector(".rooms").textContent = String(hotel.roomsAvailable);
    fragment.querySelector(".amenities").textContent = (hotel.amenities || []).join(" · ");

    const favBtn = fragment.querySelector(".fav-btn");
    if (state.favorites.has(hotel.id)) {
      favBtn.textContent = "★";
      favBtn.classList.add("active");
    }
    favBtn.addEventListener("click", () => {
      if (state.favorites.has(hotel.id)) state.favorites.delete(hotel.id);
      else state.favorites.add(hotel.id);
      persist();
      renderHotels();
    });

    fragment.querySelector(".book-btn").addEventListener("click", () => openBooking(hotel.id));
    list.appendChild(fragment);
  });
}

function renderBookings() {
  const list = document.getElementById("bookingList");
  const empty = document.getElementById("bookingEmpty");
  list.innerHTML = "";
  empty.hidden = state.bookings.length > 0;

  state.bookings.forEach((booking, index) => {
    const hotel = hotelById(booking.hotelId);
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${hotel ? hotel.name : booking.hotelId}</strong><br/>
      <span class="muted">${booking.checkIn} → ${booking.checkOut} · ${booking.guests} guests</span><br/>
      <span>Total: $${booking.total}</span>
    `;
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      const [removed] = state.bookings.splice(index, 1);
      const h = hotelById(removed.hotelId);
      if (h) h.roomsAvailable += 1;
      persist();
      renderBookings();
      renderHotels();
    });
    li.appendChild(cancel);
    list.appendChild(li);
  });
}

function openBooking(hotelId) {
  const hotel = hotelById(hotelId);
  if (!hotel || hotel.roomsAvailable < 1) return;
  state.bookingHotelId = hotelId;
  document.getElementById("dialogTitle").textContent = `Book ${hotel.name}`;
  document.getElementById("bookingError").hidden = true;
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("checkIn").value = today;
  document.getElementById("checkOut").value = today;
  document.getElementById("guests").value = "2";
  document.getElementById("bookingDialog").showModal();
}

function confirmBooking(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const hotel = hotelById(state.bookingHotelId);
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const guests = Number(document.getElementById("guests").value);
  const error = document.getElementById("bookingError");
  const nights = nightsBetween(checkIn, checkOut);

  if (!hotel) return;
  if (nights < 1) {
    error.hidden = false;
    error.textContent = "Check-out must be after check-in.";
    return;
  }
  if (hotel.roomsAvailable < 1) {
    error.hidden = false;
    error.textContent = "No rooms left for this hotel.";
    return;
  }

  hotel.roomsAvailable -= 1;
  state.bookings.unshift({
    id: `b_${Date.now()}`,
    hotelId: hotel.id,
    checkIn,
    checkOut,
    guests,
    total: nights * hotel.price,
  });
  persist();
  document.getElementById("bookingDialog").close();
  renderBookings();
  renderHotels();
}

async function boot() {
  const response = await fetch("data/hotels.json");
  if (!response.ok) throw new Error("Unable to load hotels.");
  state.hotels = await response.json();

  const saved = loadState();
  state.favorites = new Set(saved.favorites || []);
  state.bookings = saved.bookings || [];

  renderCityOptions();
  renderHotels();
  renderBookings();

  ["searchInput", "cityFilter", "sortSelect", "favOnly"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderHotels);
    document.getElementById(id).addEventListener("change", renderHotels);
  });
  document.getElementById("bookingForm").addEventListener("submit", confirmBooking);
}

boot().catch((error) => {
  document.getElementById("stats").textContent = error.message;
});

export { nightsBetween, filteredHotels };
