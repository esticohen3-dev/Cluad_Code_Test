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
  // With form sections, the same question can appear in several sections and so in
  // several columns. Each field keeps every matching column and takes the first non-empty one.
  const findAll = (test) => headers.map((h, i) => (test(h) ? i : -1)).filter((i) => i >= 0);
  const col = {
    type: findAll((h) => h.includes("מה מוסיפים")),
    city: findAll((h) => h.includes("עיר")),
    name: findAll((h) => h.startsWith("שם")),
    endDate: findAll((h) => h.includes("עד תאריך")),
    date: findAll((h) => h.includes("תאריך") && !h.includes("עד תאריך") && !h.includes("חותמת")),
    status: findAll((h) => h.includes("סטטוס")),
    link: findAll((h) => h.includes("קישור")),
    notes: findAll((h) => h.includes("פרטים") || h.includes("הערות")),
  };
  const get = (r, k) => {
    for (const i of col[k]) {
      const v = (r[i] || "").trim();
      if (v) return v;
    }
    return "";
  };
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

// ---------- In-site "add" form ----------
// Entries are submitted in the background to the Google Form (which feeds the Google Sheet),
// so viewers never leave the site. The sheet is published as CSV and read back on load.

const FORM = TRIP.googleForm || {};
const formReady = () => FORM.formId && FORM.entries && FORM.entries.type && FORM.entries.name;

// Snapshot of the hand-written data, so sheet entries can be re-merged without duplicates.
const BASE = JSON.parse(JSON.stringify({ attractions: TRIP.attractions, hotels: TRIP.hotels, days: TRIP.days }));
let sheetEntries = [];

// Entries saved from this browser that may not be in the published sheet yet
// (Google can take a few minutes to refresh it). Kept for 30 minutes at most.
const PENDING_KEY = "trip-pending-adds";
const PENDING_TTL = 30 * 60 * 1000;
const sameEntry = (a, b) => a.type === b.type && a.name === b.name && (a.date || "") === (b.date || "");

function loadPending() {
  try {
    const list = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    return list.filter((p) => Date.now() - p.savedAt < PENDING_TTL && !sheetEntries.some((e) => sameEntry(e, p.entry)));
  } catch { return []; }
}
function savePending(list) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
}

function rebuild() {
  const base = JSON.parse(JSON.stringify(BASE));
  TRIP.attractions = base.attractions;
  TRIP.hotels = base.hotels;
  TRIP.days = base.days;
  const pending = loadPending();
  savePending(pending);
  mergeSheetEntries([...sheetEntries, ...pending.map((p) => p.entry)]);
  addHotelsToTimeline();
  renderAll();
}

// Puts every hotel's check-in and check-out on the daily timeline, creating a day card if needed.
// A day with a check-out in one place and a check-in in another is marked as a travel day.
function addHotelsToTimeline() {
  const dayFor = (date, place, title) => {
    let day = TRIP.days.find((d) => d.date === date);
    if (!day) {
      day = { date, place, type: "stay", title, items: [] };
      TRIP.days.push(day);
    }
    day.items = day.items || [];
    return day;
  };
  for (const h of TRIP.hotels) {
    if (!h.name) continue;
    const tag = h.status === "booked" ? "" : " (בבדיקה)";
    if (h.checkIn) {
      const day = dayFor(h.checkIn, h.stop, `צ'ק-אין ב${h.stop}`);
      day.items.push(`🏨 צ'ק-אין: ${h.name}${tag}`);
      day.checkInPlace = h.stop;
    }
    if (h.checkOut) {
      const day = dayFor(h.checkOut, h.stop, `צ'ק-אאוט מ${h.stop}`);
      day.items.push(`🧳 צ'ק-אאוט: ${h.name}${tag}`);
      day.checkOutPlace = h.stop;
    }
  }
  for (const d of TRIP.days) {
    if (d.type === "stay" && d.checkInPlace && d.checkOutPlace && d.checkInPlace !== d.checkOutPlace) {
      d.type = "move";
      d.place = `${d.checkOutPlace} ← ${d.checkInPlace}`;
      d.title = `עוברים מ${d.checkOutPlace} ל${d.checkInPlace}`;
    }
  }
  TRIP.days.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

function renderAddButtons() {
  if (!formReady()) return;
  document.querySelector(".tabs").insertAdjacentHTML("beforeend",
    `<button type="button" class="add-tab" data-add="אטרקציה / רעיון">➕ הוספה</button>`);
  const typeFor = { days: "תוכנית ליום", hotels: "מלון", attractions: "אטרקציה / רעיון" };
  for (const [id, type] of Object.entries(typeFor)) {
    document.querySelector(`#${id} h2`).insertAdjacentHTML("beforeend",
      ` <button type="button" class="add-btn" data-add="${type}">➕ הוספה</button>`);
  }
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-add]");
    if (btn) openAddDialog(btn.dataset.add);
  });
}

const LABELS = {
  "אטרקציה / רעיון": { name: "שם האטרקציה", namePh: "לדוגמה: שיט לאיי פי פי", notes: "פרטים / הערות", mode: "attraction" },
  "מלון": { name: "שם המלון", namePh: "לדוגמה: Kata Beach Resort", date: "צ'ק-אין", notes: "הערות (מחיר, ארוחת בוקר...)", mode: "hotel" },
  "תוכנית ליום": { name: "כותרת ליום", namePh: "לדוגמה: יום בים", date: "תאריך", notes: "מה עושים? (כל דבר בשורה נפרדת)", mode: "day" },
};

function currentType() {
  return $("add-form").querySelector('input[name="type"]:checked').value;
}

function updateDialogFields() {
  const form = $("add-form");
  const l = LABELS[currentType()];
  form.querySelectorAll("[data-show]").forEach((el) => {
    el.hidden = !el.dataset.show.split(" ").includes(l.mode);
  });
  form.querySelector('[data-label-for="name"]').textContent = l.name;
  form.querySelector('[data-label-for="notes"]').textContent = l.notes;
  if (l.date) form.querySelector('[data-label-for="date"]').textContent = l.date;
  form.elements.name.placeholder = l.namePh;
  $("add-error").hidden = true;
}

function openAddDialog(type) {
  const form = $("add-form");
  form.reset();
  form.querySelector(`input[name="type"][value="${type}"]`).checked = true;
  const cities = [...new Set([...TRIP.stops.filter((s) => s.confirmed).map((s) => s.name), ...TRIP.attractions.map((a) => a.city)])];
  $("city-options").innerHTML = cities.map((c) => `<option value="${escapeHtml(c)}">`).join("");
  form.elements.date.min = form.elements.endDate.min = TRIP.startDate || "";
  form.elements.date.max = form.elements.endDate.max = TRIP.endDate || "";
  updateDialogFields();
  $("add-dialog").showModal();
  form.elements.city.focus();
}

function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { t.hidden = true; }, 4500);
}

function readDialog() {
  const f = $("add-form").elements;
  const type = currentType();
  const mode = LABELS[type].mode;
  return {
    type,
    city: f.city.value.trim(),
    name: f.name.value.trim(),
    date: mode === "attraction" ? null : f.date.value || null,
    endDate: mode === "hotel" ? f.endDate.value || null : null,
    status: mode === "hotel" ? $("add-form").querySelector('input[name="status"]:checked').value : "",
    link: f.link.value.trim(),
    notes: f.notes.value.trim(),
  };
}

function validate(e) {
  if (!e.name) return LABELS[e.type].name + " – חובה למלא";
  if (e.type === "תוכנית ליום" && !e.date) return "צריך לבחור תאריך";
  if (e.link && !safeLink(e.link)) return "הקישור צריך להתחיל ב-https://";
  if (e.date && e.endDate && e.endDate < e.date) return "תאריך הצ'ק-אאוט לפני הצ'ק-אין";
  return null;
}

async function submitToForm(e) {
  const E = FORM.entries;
  const body = new URLSearchParams();
  const put = (key, value) => { if (E[key] && value) body.append(`entry.${E[key]}`, value); };
  const putDate = (key, iso) => {
    if (!E[key] || !iso) return;
    const [y, m, d] = iso.split("-");
    body.append(`entry.${E[key]}_year`, y);
    body.append(`entry.${E[key]}_month`, String(+m));
    body.append(`entry.${E[key]}_day`, String(+d));
  };
  put("type", e.type);
  put("city", e.city);
  put("name", e.name);
  putDate("date", e.date);
  putDate("endDate", e.endDate);
  put("status", e.status);
  put("link", e.link);
  put("notes", e.notes);
  // The form has 3 sections; Google needs the path taken through them.
  body.append("pageHistory", e.type === "מלון" ? "0,1,2" : "0,2");
  // Google Forms does not allow reading the response cross-origin; a network error still throws.
  await fetch(`https://docs.google.com/forms/d/e/${encodeURIComponent(FORM.formId)}/formResponse`, {
    method: "POST", mode: "no-cors", body,
  });
}

function setupAddDialog() {
  if (!formReady()) return;
  const form = $("add-form");
  form.addEventListener("change", (ev) => { if (ev.target.name === "type") updateDialogFields(); });
  $("add-close").addEventListener("click", () => $("add-dialog").close());
  $("add-dialog").addEventListener("click", (ev) => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const entry = readDialog();
    const err = validate(entry);
    if (err) {
      $("add-error").textContent = err;
      $("add-error").hidden = false;
      return;
    }
    const btn = $("add-save");
    btn.disabled = true;
    btn.textContent = "שומרים...";
    try {
      await submitToForm(entry);
      const pending = loadPending();
      pending.push({ entry: { ...entry, link: safeLink(entry.link) }, savedAt: Date.now() });
      savePending(pending);
      rebuild();
      $("add-dialog").close();
      showToast("✅ נשמר! יופיע לכל המשפחה תוך כמה דקות");
    } catch {
      $("add-error").textContent = "לא הצלחנו לשמור – בדקו את החיבור לאינטרנט ונסו שוב";
      $("add-error").hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = "שמירה";
    }
  });
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

rebuild();
renderAddButtons();
setupAddDialog();

if (TRIP.sheetCsvUrl) {
  fetch(TRIP.sheetCsvUrl, { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((text) => {
      const rows = parseCsv(text);
      if (rows.length > 1) {
        sheetEntries = sheetRowsToObjects(rows);
        rebuild();
      }
    })
    .catch((err) => console.warn("Could not load additions from the sheet:", err));
}
