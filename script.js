const today = new Date();
let currentDate = new Date(today);

const monthNames = [
  "GENNAIO","FEBBRAIO","MARZO","APRILE","MAGGIO","GIUGNO",
  "LUGLIO","AGOSTO","SETTEMBRE","OTTOBRE","NOVEMBRE","DICEMBRE"
];

const dayNamesFull = ["DOM","LUN","MAR","MER","GIO","VEN","SAB"];
const dayNamesShort = ["D","L","M","M","G","V","S"];

/******** FESTIVITÀ ITALIANE ********/

/* feste fisse (valgono ogni anno) */
const fixedHolidays = new Set([
  "01-01", // Capodanno
  "01-06", // Epifania
  "04-25", // Liberazione
  "05-01", // Lavoro
  "06-02", // Repubblica
  "08-15", // Ferragosto
  "11-01", // Ognissanti
  "12-08", // Immacolata
  "12-25", // Natale
  "12-26"  // Santo Stefano
]);

/* feste mobili per anno */
const variableHolidays = new Set([
  // 2024
  "2024-03-31", // Pasqua
  "2024-04-01", // Lunedì dell'Angelo

  // 2025
  "2025-04-20",
  "2025-04-21",

  // 2026
  "2026-04-05",
  "2026-04-06",

  // 2027
  "2027-03-28",
  "2027-03-29"
]);

/******** COMPLEANNI ********/
const birthdays = {
  "02-08": "Compleanno Katiuscia",
  "06-24": "Compleanno Sonia",
  "07-02": "Compleanno Laura",
  "07-03": "Compleanno Mamma",
  "07-06": "Compleanno Francesco",
  "08-02": "Compleanno Fabio",
  "01-29": "Compleanno Papà"
};

/******** RENDER ********/
function renderAll() {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  renderCalendar("prev-days","prev-month",y,m-1,false,false);
  renderCalendar("days","current-month",y,m,true,true);
  renderCalendar("next-days","next-month",y,m+1,false,false);
}

function renderCalendar(containerId, titleId, y, m, showBirthdays, isMain) {
  const ref = new Date(y, m, 1);
  y = ref.getFullYear();
  m = ref.getMonth();

  const container = document.getElementById(containerId);
  const title = document.getElementById(titleId);
  container.innerHTML = "";
  title.textContent = `${monthNames[m]} ${y}`;

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = today.toISOString().slice(0,10);

  let leftCol, rightCol;
  if (isMain) {
    leftCol = document.createElement("div");
    rightCol = document.createElement("div");
    leftCol.className = "month-half";
    rightCol.className = "month-half";
    container.append(leftCol, rightCol);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const md  = `${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const div = document.createElement("div");
    div.className = "day";

    if (iso === todayIso && isMain) div.classList.add("today");

    if (
      date.getDay() === 0 ||               // domenica
      fixedHolidays.has(md) ||             // feste fisse
      variableHolidays.has(iso)            // feste mobili
    ) {
      div.classList.add("sunday");
    }

    const name = isMain
      ? dayNamesFull[date.getDay()]
      : dayNamesShort[date.getDay()];

    div.innerHTML = `
      <div class="day-number">${d}</div>
      <div class="day-name">${name}</div>
      ${showBirthdays && birthdays[md] ? `<div class="birthday">${birthdays[md]}</div>` : ""}
    `;

    if (isMain) (d <= 15 ? leftCol : rightCol).appendChild(div);
    else container.appendChild(div);
  }
}

/******** NAVIGAZIONE ********/
function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  renderAll();
}

function resetToToday() {
  currentDate = new Date(today);
  renderAll();
}

/******** AUTO ********/
renderAll();

(function midnightReload(){
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24,0,0,0);
  setTimeout(() => location.reload(), midnight - now);
})();

(function nightMode(){
  const h = new Date().getHours();
  if (h >= 21 || h < 7) document.body.classList.add("night");
})();

/******** NASCONDI DEBUG OVERLAY (se esiste in HTML) ********/
(function hideDebugOverlay(){
  const dbg = document.getElementById("debug-orientation");
  if (dbg) dbg.style.display = "none";
})();

/******** KIOSK ROTATION + FILL (Raspberry-safe) ********/
(function kioskRotateAndFill(){
  const app = document.getElementById("calendar-app");
  if (!app) return;

  function setMode(){
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Sul tuo Pi: h>w anche su schermo fisico landscape -> ruotiamo
    if (h > w) {
      app.classList.add("rotated");
      app.classList.remove("normal");
    } else {
      app.classList.add("normal");
      app.classList.remove("rotated");
    }
  }

  function setFillScale(){
    // reset scala (variabile CSS)
    app.style.setProperty("--kiosk-scale", "1");

    const rect = app.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // COVER: riempie tutto lo schermo (niente nero). Può tagliare un filo ai bordi.
    const s = Math.max(vw / rect.width, vh / rect.height);

    const safe = Math.max(0.1, Math.min(s, 3));
    app.style.setProperty("--kiosk-scale", String(safe));
  }

  function applyAll(){
    setMode();
    // dopo cambio classe, ricalcola scala
    setTimeout(setFillScale, 80);
  }

  window.addEventListener("resize", applyAll);
  applyAll();
})();
