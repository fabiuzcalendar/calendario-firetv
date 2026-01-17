/***********************
 * CALENDARIO
 ***********************/
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const monthNames = [
  "GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO",
  "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"
];

const dayNames = ["D", "L", "M", "M", "G", "V", "S"];

// FESTIVITÀ
const holidays = [
  "2026-01-01","2026-04-03","2026-04-05","2026-04-06",
  "2026-04-27","2026-05-05","2026-05-14",
  "2026-05-24","2026-05-25",
  "2026-12-25","2026-12-26"
];

const italianHolidays = [
  "2026-01-01","2026-01-06","2026-04-05","2026-04-06",
  "2026-04-25","2026-05-01","2026-06-02",
  "2026-08-15","2026-11-01","2026-12-08",
  "2026-12-25","2026-12-26"
];

const fixedHolidays = [
  "01-01","01-06","04-25","05-01","06-02",
  "08-15","11-01","12-08","12-25","12-26"
];

// Set per performance
const holidaysSet = new Set(holidays);
const italianHolidaysSet = new Set(italianHolidays);
const fixedHolidaysSet = new Set(fixedHolidays);

// COMPLEANNI
const birthdays = {
  "02-08": "Comple K",
  "07-05": "Comple Marco",
  "01-02": "Comple K"
};

function renderCalendar(containerId, titleId, year, month, showBirthdays) {
  const container = document.getElementById(containerId);
  const title = document.getElementById(titleId);

  container.innerHTML = "";

  const leftCol = document.createElement("div");
  const rightCol = document.createElement("div");
  leftCol.className = "month-half";
  rightCol.className = "month-half";

  container.append(leftCol, rightCol);

  const ref = new Date(year, month, 1);
  const y = ref.getFullYear();
  const m = ref.getMonth();

  title.textContent = `${monthNames[m]} ${y}`;

  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const todayIso =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const md  = `${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    if (iso === todayIso && containerId === "days") {
      dayDiv.classList.add("today");
    }

    if (
      date.getDay() === 0 ||
      holidaysSet.has(iso) ||
      italianHolidaysSet.has(iso) ||
      fixedHolidaysSet.has(md)
    ) {
      dayDiv.classList.add("sunday");
    }

    let birthdayText = "";
    if (showBirthdays && birthdays[md]) {
      birthdayText = `<div class="birthday">${birthdays[md]}</div>`;
    }

    dayDiv.innerHTML = `
      <div class="day-number">${d}</div>
      <div class="day-name">${dayNames[date.getDay()]}</div>
      ${birthdayText}
    `;

    (d <= 15 ? leftCol : rightCol).appendChild(dayDiv);
  }
}

// Render mesi
renderCalendar("prev-days", "prev-month", year, month - 1, false);
renderCalendar("days", "current-month", year, month, true);
renderCalendar("next-days", "next-month", year, month + 1, false);

/***********************
 * REFRESH A MEZZANOTTE
 ***********************/
(function scheduleMidnightReload() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => location.reload(), midnight - now);
})();

/***********************
 * MODALITÀ NOTTE
 ***********************/
(function applyNightMode() {
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 7) {
    document.body.classList.add("night");
  }
})();

/***********************
 * FULLSCREEN FIRE TV
 ***********************/
function goFullscreen() {
  if (window.innerWidth > 900) {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }
}

document.addEventListener("keydown", goFullscreen, { once: true });
document.addEventListener("click", goFullscreen, { once: true });

/***********************
 * MOBILE: APERTURA MESE
 ***********************/
function openMonth(type) {
  if (window.innerWidth > 900) return;

  const calendar = document.getElementById("calendar");
  calendar.classList.remove("mobile-overview");
  calendar.classList.add("mobile-focus", type);

  document.getElementById("back-button").style.display = "block";
}

function closeMonth() {
  const calendar = document.getElementById("calendar");
  calendar.className = "mobile-overview";

  document.getElementById("back-button").style.display = "none";
}



