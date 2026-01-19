const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const monthNames = [
  "GENNAIO","FEBBRAIO","MARZO","APRILE","MAGGIO","GIUGNO",
  "LUGLIO","AGOSTO","SETTEMBRE","OTTOBRE","NOVEMBRE","DICEMBRE"
];

const dayNames = ["D","L","M","M","G","V","S"];

const fixedHolidaysSet = new Set([
  "01-01","01-06","04-25","05-01","06-02",
  "08-15","11-01","12-08","12-25","12-26"
]);

const birthdays = {
  "02-08": "Comple K",
  "07-05": "Comple Marco",
  "01-02": "Comple K"
};

function renderCalendar(containerId, titleId, y, m, showBirthdays) {
  const dateRef = new Date(y, m, 1);
  y = dateRef.getFullYear();
  m = dateRef.getMonth();

  const container = document.getElementById(containerId);
  const title = document.getElementById(titleId);
  container.innerHTML = "";

  title.textContent = `${monthNames[m]} ${y}`;

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = today.toISOString().slice(0, 10);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const md  = `${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const div = document.createElement("div");
    div.className = "day";

    if (iso === todayIso && containerId === "days") div.classList.add("today");
    if (date.getDay() === 0 || fixedHolidaysSet.has(md)) div.classList.add("sunday");

    div.innerHTML = `
      <div class="day-number">${d}</div>
      <div class="day-name">${dayNames[date.getDay()]}</div>
      ${showBirthdays && birthdays[md] ? `<div class="birthday">${birthdays[md]}</div>` : ""}
    `;

    container.appendChild(div);
  }
}

renderCalendar("prev-days","prev-month",year,month-1,false);
renderCalendar("days","current-month",year,month,true);
renderCalendar("next-days","next-month",year,month+1,false);

/* MOBILE */
function openMonth(type) {
  if (window.innerWidth > 900) return;
  const cal = document.getElementById("calendar");
  cal.className = "mobile-focus " + type;
  document.getElementById("back-button").style.display = "block";
}

function closeMonth() {
  const cal = document.getElementById("calendar");
  cal.className = "mobile-overview";
  document.getElementById("back-button").style.display = "none";
}
/*********** REFRESH A MEZZANOTTE ***********/
(function midnightReload() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => location.reload(), midnight - now);
})();

/*********** MODALITÀ NOTTE ***********/
(function nightMode() {
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 7) {
    document.body.classList.add("night");
  }
})();




