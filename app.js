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

// Day 1 = TRIP.startDate; falls back to list position when dates are missing.
function dayNumber(d, i) {
  if (d.date && TRIP.startDate) {
    const n = Math.round((new Date(d.date + "T00:00:00") - new Date(TRIP.startDate + "T00:00:00")) / 86400000) + 1;
    return `יום ${n}`;
  }
  return `יום ${i + 1}`;
}

function renderDays() {
  if (!TRIP.days.length) {
    $("days-list").innerHTML = `<div class="empty">🗓️ התוכנית היומית תופיע כאן ברגע שהתאריכים והמסלול ייסגרו</div>`;
    return;
  }
  const icon = { move: "🚐", flight: "✈️", stay: "☀️" };
  $("days-list").innerHTML = TRIP.days.map((d, i) => `
    <div class="card day ${d.type || "stay"}">
      <div class="muted">${dayNumber(d, i)}${d.date ? " · " + escapeHtml(formatDate(d.date)) : ""} · ${escapeHtml(d.place || "")}</div>
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
      ${h.note ? `<div class="muted">${escapeHtml(h.note)}</div>` : ""}
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
              <strong>${a.link ? `<a href="${escapeHtml(a.link)}" target="_blank" rel="noopener">${escapeHtml(a.name)}</a>` : escapeHtml(a.name)}</strong>
              ${a.planned ? '<span class="badge ok">בתוכנית</span>' : '<span class="badge maybe">רעיון</span>'}
              <div class="muted">${escapeHtml(a.note || "")}</div>
            </div>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

// ---------- Additions from the Google Form / Sheet ----------
// The form's question titles become the sheet's column headers; columns are matched by keyword.

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

// Accepts "2027-08-08", or day-first "8/8/2027" / "08.08.2027" (Israeli sheet locale).
function toIsoDate(s) {
  if (!s) return null;
  s = s.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

function safeLink(s) {
  s = (s || "").trim();
  return /^https?:\/\//i.test(s) ? s : null;
}

function sheetRowsToObjects(rows) {
  const headers = rows[0].map((h) => h.trim());
  const find = (test) => headers.findIndex(test);
  const col = {
    type: find((h) => h.includes("מה מוסיפים")),
    city: find((h) => h.includes("עיר")),
    name: find((h) => h.startsWith("שם")),
    endDate: find((h) => h.includes("עד תאריך")),
    date: find((h) => h.includes("תאריך") && !h.includes("עד תאריך") && !h.includes("חותמת")),
    status: find((h) => h.includes("סטטוס")),
    link: find((h) => h.includes("קישור")),
    notes: find((h) => h.includes("פרטים") || h.includes("הערות")),
  };
  const get = (r, k) => (col[k] >= 0 ? (r[col[k]] || "").trim() : "");
  return rows.slice(1).map((r) => ({
    type: get(r, "type"), city: get(r, "city"), name: get(r, "name"),
    date: toIsoDate(get(r, "date")), endDate: toIsoDate(get(r, "endDate")),
    status: get(r, "status"), link: safeLink(get(r, "link")), notes: get(r, "notes"),
  }));
}

function mergeSheetEntries(entries) {
  for (const e of entries) {
    if (e.type.includes("אטרקציה")) {
      if (!e.name) continue;
      TRIP.attractions.push({ city: e.city || "כללי", name: e.name, emoji: "📍", planned: false, note: e.notes, link: e.link, fromForm: true });
    } else if (e.type.includes("מלון")) {
      if (!e.name) continue;
      const hotel = {
        stop: e.city || "?", name: e.name, link: e.link, checkIn: e.date, checkOut: e.endDate,
        status: e.status.includes("הוזמן") ? "booked" : "considering", note: e.notes, fromForm: true,
      };
      // A booked hotel replaces the empty "not booked yet" slot for that city.
      const slot = TRIP.hotels.findIndex((h) => h.stop === hotel.stop && h.status === "not-booked");
      if (slot >= 0 && hotel.status === "booked") TRIP.hotels[slot] = hotel;
      else TRIP.hotels.push(hotel);
    } else if (e.type.includes("תוכנית")) {
      if (!e.date) continue;
      const items = e.notes ? e.notes.split(/\n|,/).map((x) => x.trim()).filter(Boolean) : [];
      const existing = TRIP.days.find((d) => d.date === e.date);
      if (existing) {
        existing.items = [...(existing.items || []), ...(e.name ? [e.name] : []), ...items];
      } else {
        TRIP.days.push({ date: e.date, place: e.city, type: "stay", title: e.name || "תוכנית ליום", items, fromForm: true });
      }
    }
  }
  TRIP.days.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

function renderAddButtons() {
  if (!TRIP.formUrl) return;
  const url = safeLink(TRIP.formUrl);
  if (!url) return;
  document.querySelector(".tabs").insertAdjacentHTML("beforeend",
    `<a class="add-tab" href="${escapeHtml(url)}" target="_blank" rel="noopener">➕ הוספה</a>`);
  for (const id of ["days", "hotels", "attractions"]) {
    document.querySelector(`#${id} h2`).insertAdjacentHTML("beforeend",
      ` <a class="add-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener">➕ הוספה</a>`);
  }
}

function renderAll() {
  renderHero();
  renderTravelers();
  renderFlights();
  renderRoute();
  renderDays();
  renderHotels();
  renderAttractions();
}

renderAll();
renderAddButtons();

if (TRIP.sheetCsvUrl) {
  fetch(TRIP.sheetCsvUrl, { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((text) => {
      const rows = parseCsv(text);
      if (rows.length > 1) {
        mergeSheetEntries(sheetRowsToObjects(rows));
        renderAll();
      }
    })
    .catch((err) => console.warn("Could not load additions from the sheet:", err));
}
