// Renders the site from TRIP (data.js). Content changes belong in data.js, not here.

const TBD = '<span class="badge tbd">עוד לא נסגר</span>';
const $ = (id) => document.getElementById(id);
const val = (v) => (v === null || v === undefined || v === "" ? TBD : escapeHtml(String(v)));

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" });
}

function renderHero() {
  $("title").textContent = TRIP.title;
  $("subtitle").textContent = TRIP.subtitle;
  const el = $("countdown");
  if (!TRIP.startDate) {
    el.innerHTML = "📅 התאריכים ייקבעו בקרוב";
    return;
  }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(TRIP.startDate + "T00:00:00");
  const end = TRIP.endDate ? new Date(TRIP.endDate + "T00:00:00") : start;
  const days = Math.round((start - today) / 86400000);
  if (days > 0) el.innerHTML = `עוד <strong>${days}</strong> ימים לטיול! 🏝️`;
  else if (today <= end) el.innerHTML = "🎉 אנחנו בטיול!";
  else el.innerHTML = "🥥 היה מדהים!";
}

function renderTravelers() {
  $("travelers-list").innerHTML = TRIP.travelers.map((t) => `
    <div class="card traveler">
      <div class="avatar">${t.emoji || "🙂"}</div>
      <div class="name">${escapeHtml(t.name)}</div>
    </div>`).join("");
}

function renderLeg(l) {
  return `
    <div class="leg">
      <div class="leg-date muted">${l.date ? escapeHtml(formatDate(l.date)) : TBD}</div>
      <div class="flight-route">
        <div class="airport"><div class="code">${escapeHtml(l.fromCode)}</div><div class="muted">${escapeHtml(l.from)}</div><div class="time" dir="ltr">${val(l.departTime)}</div></div>
        <div class="plane-line"><span>✈️</span>${l.duration ? `<small>${escapeHtml(l.duration)} שע׳</small>` : ""}</div>
        <div class="airport"><div class="code">${escapeHtml(l.toCode)}</div><div class="muted">${escapeHtml(l.to)}</div><div class="time" dir="ltr">${val(l.arriveTime)}</div></div>
      </div>
      <div class="leg-meta muted">${val(l.airline)} · <span dir="ltr">${val(l.flightNumber)}</span></div>
    </div>`;
}

function renderFlights() {
  $("flights-list").innerHTML = TRIP.flights.map((f) => `
    <div class="card">
      <h3>${escapeHtml(f.label)} <span class="badge ok">הוזמן ✓</span></h3>
      <div class="muted">${escapeHtml(f.summary || "")}</div>
      ${f.legs.map(renderLeg).join('<div class="layover">🕐 עצירה בדובאי</div>')}
      ${f.note ? `<p class="flight-note">${escapeHtml(f.note)}</p>` : ""}
    </div>`).join("");
}

function renderRoute() {
  $("route-list").innerHTML = TRIP.stops.map((s, i) => `
    ${i > 0 ? '<div class="arrow">⬅</div>' : ""}
    <div class="card stop ${s.confirmed ? "" : "tbd"}">
      <div class="emoji">${s.emoji}</div>
      <h3>${escapeHtml(s.name)}</h3>
      <div class="muted">${s.nights ? `${s.nights} לילות` : escapeHtml(s.note || "")}</div>
    </div>`).join("");
}

function renderDays() {
  if (!TRIP.days.length) {
    $("days-list").innerHTML = `<div class="empty">🗓️ התוכנית היומית תופיע כאן ברגע שהתאריכים והמסלול ייסגרו</div>`;
    return;
  }
  const icon = { move: "🚐", flight: "✈️", stay: "☀️" };
  $("days-list").innerHTML = TRIP.days.map((d, i) => `
    <div class="card day ${d.type || "stay"}">
      <div class="muted">יום ${i + 1}${d.date ? " · " + escapeHtml(formatDate(d.date)) : ""} · ${escapeHtml(d.place || "")}</div>
      <h3>${icon[d.type] || "☀️"} ${escapeHtml(d.title || "")}</h3>
      ${d.items && d.items.length ? `<ul>${d.items.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");
}

function renderHotels() {
  const badge = {
    "not-booked": '<span class="badge tbd">עוד לא הוזמן</span>',
    considering: '<span class="badge maybe">בבדיקה</span>',
    booked: '<span class="badge ok">הוזמן ✓</span>',
  };
  $("hotels-list").innerHTML = TRIP.hotels.map((h) => `
    <div class="card">
      <h3>🏨 ${escapeHtml(h.stop)}</h3>
      ${badge[h.status] || ""}
      <p>${h.name ? (h.link ? `<a href="${escapeHtml(h.link)}" target="_blank" rel="noopener">${escapeHtml(h.name)}</a>` : escapeHtml(h.name)) : '<span class="muted">עוד בוחרים מלון</span>'}</p>
      ${h.checkIn ? `<div class="muted">${escapeHtml(formatDate(h.checkIn))} – ${escapeHtml(formatDate(h.checkOut) || "?")}</div>` : ""}
    </div>`).join("");
}

function renderAttractions() {
  const cities = [...new Set(TRIP.attractions.map((a) => a.city))];
  $("attractions-list").innerHTML = cities.map((city) => `
    <div class="city-group">
      <h3>${escapeHtml(city)}</h3>
      <div class="grid">
        ${TRIP.attractions.filter((a) => a.city === city).map((a) => `
          <div class="card attraction">
            <div class="emoji">${a.emoji || "📍"}</div>
            <div>
              <strong>${escapeHtml(a.name)}</strong>
              ${a.planned ? '<span class="badge ok">בתוכנית</span>' : '<span class="badge maybe">רעיון</span>'}
              <div class="muted">${escapeHtml(a.note || "")}</div>
            </div>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

renderHero();
renderTravelers();
renderFlights();
renderRoute();
renderDays();
renderHotels();
renderAttractions();
