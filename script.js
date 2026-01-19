const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const monthNames = [
  "GENNAIO","FEBBRAIO","MARZO","APRILE","MAGGIO","GIUGNO",
  "LUGLIO","AGOSTO","SETTEMBRE","OTTOBRE","NOVEMBRE","DICEMBRE"
];

// Nomi completi per mese centrale
const dayNamesFull = ["DOM","LUN","MAR","MER","GIO","VEN","SAB"];
// Lettera singola per mesi laterali
const dayNamesShort = ["D","L","M","M","G","V","S"];

const fixedHolidaysSet = new Set([
  "01-01","01-06","04-25","05-01","06-02",
  "08-15","11-01","12-08","12-25","12-26"
]);

const birthdays = {
  "02-08": "Compleanno Katiuscia",
  "06-24": "Compleanno Sonia",
  "07-02": "Compleanno Laura",
  "07-03": "Compleanno Mamma",
  "07-06": "Compleanno Francesco",
  "08-02": "Compleanno Fabio",
  "01-29": "Compleanno Papà"
};

function renderCalendar(containerId, titleId, y, m, showBirthdays, isMain) {
  const ref = new Date(y, m, 1);
  y = ref.getFullYear();
  m = ref.getMonth();

  const container = document.getElementById(containerId);
  const title = document.getElementById(titleId);
  container.innerHTML = "";

  title.textContent = `${monthNames[m]} ${y}`;

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = today.toISOString().slice(0, 10);

  // colonne SOLO per mese centrale
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
    if (date.getDay() === 0 || fixedHolidaysSet.has(md)) div.classList.add("sunday");

    const dayName = isMain
      ? dayNamesFull[date.getDay()]
      : dayNamesShort[date.getDay()];

    div.innerHTML = `
      <div class="day-number">${d}</div>
      <div class="day-name">${dayName}</div>
      ${showBirthdays && birthdays[md] ? `<div class="birthday">${birthdays[md]}</div>` : ""}
    `;

    if (isMain) {
      (d <= 15 ? leftCol : rightCol).appendChild(div);
    } else {
      container.appendChild(div);
    }
  }
}

// render
renderCalendar("prev-days","prev-month",year,month-1,false,false);
renderCalendar("days","current-month",year,month,true,true);
renderCalendar("next-days","next-month",year,month+1,false,false);

/*********** REFRESH MEZZANOTTE ***********/
(function midnightReload(){
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24,0,0,0);
  setTimeout(() => location.reload(), midnight - now);
})();

/*********** MODALITÀ NOTTE ***********/
(function nightMode(){
  const h = new Date().getHours();
  if (h >= 21 || h < 7) document.body.classList.add("night");
})();




